'use client'

import React, { useState } from 'react'
import HospitalLayout from '@/components/HospitalLayout'
import Link from 'next/link';

// Update Doctor interface (removes `name`, adds proper db fields)
interface Doctor {
  id: number
  hospital_id: number
  first_name: string
  last_name: string
  email: string
  phone_num: string
  speciality: string
  image: string
  // Optionally add auth_id if needed for your app logic
  auth_id?: string
}

// Mock data uses new schema
type DoctorInput = Omit<Doctor, 'id' | 'image'>;
const mockDoctors = [
  {
    id: 1,
    hospital_id: 1,
    first_name: 'Jason',
    last_name: 'Price',
    email: 'jason.price@hospital.com',
    phone_num: '+213 670123456',
    speciality: 'Cardiologist',
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    hospital_id: 1,
    first_name: 'Duane',
    last_name: 'Dean',
    email: 'duane.dean@hospital.com',
    phone_num: '+213 670234567',
    speciality: 'Hematologist',
    image: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 3,
    hospital_id: 1,
    first_name: 'Jonathan',
    last_name: 'Barker',
    email: 'jonathan.barker@hospital.com',
    phone_num: '+213 670345678',
    speciality: 'Emergency Medicine',
    image: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 4,
    hospital_id: 2,
    first_name: 'Rosie',
    last_name: 'Glover',
    email: 'rosie.glover@hospital.com',
    phone_num: '+213 670345679',
    speciality: 'Surgeon',
    image: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 5,
    hospital_id: 2,
    first_name: 'Patrick',
    last_name: 'Greer',
    email: 'patrick.greer@hospital.com',
    phone_num: '+213 670987654',
    speciality: 'Internal Medicine',
    image: 'https://i.pravatar.cc/150?img=16',
  },
  {
    id: 6,
    hospital_id: 3,
    first_name: 'Darrell',
    last_name: 'Ortega',
    email: 'darrell.ortega@hospital.com',
    phone_num: '+213 670112233',
    speciality: 'Pediatrician',
    image: 'https://i.pravatar.cc/150?img=17',
  },
];

// 2. Bring in stock mock data for linkage
const mockStock = [
  { id: 1, hospital_id: 1, blood_type: 'O+', quantity: 25, date: '2024-09-15' },
  { id: 2, hospital_id: 1, blood_type: 'O-', quantity: 15, date: '2024-09-16' },
  { id: 3, hospital_id: 1, blood_type: 'A+', quantity: 30, date: '2024-09-17' },
  { id: 4, hospital_id: 2, blood_type: 'B+', quantity: 18, date: '2024-09-19' },
  { id: 5, hospital_id: 3, blood_type: 'AB+', quantity: 10, date: '2024-09-21' },
]

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'doctors'>('doctors')
  const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [form, setForm] = useState<DoctorInput>({
    first_name: '',
    last_name: '',
    email: '',
    phone_num: '',
    speciality: '',
    auth_id: '',
  })

  const handleMessage = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  // Update Add Doctor (use new fields)
  const handleAddDoctor = () => {
    const newDoctor: Doctor = {
      ...form,
      id: doctors.length + 1, // or use real id generator
      image: 'https://i.pravatar.cc/150?img=' + (doctors.length + 10),
    }
    setDoctors([newDoctor, ...doctors])
    setShowModal(false)
    setForm({ first_name: '', last_name: '', email: '', phone_num: '', speciality: '', auth_id: '' })
  }

  return (
    <HospitalLayout>
      <div className="page-header">
        <h1 className="page-title">CHU Mustapha</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New Doctor
        </button>
      </div>

      <div className="tabs">
        <Link href="/hospital/stock" legacyBehavior><a className="tab">Stock</a></Link>
        <button className={`tab ${activeTab === 'doctors' ? 'active' : ''}`} onClick={() => setActiveTab('doctors')}>Doctors</button>
      </div>

      <div className="cards-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card">
            <img
              src={doctor.image}
              alt={`${doctor.first_name} ${doctor.last_name}`}
              className="card-image"
            />
            <h3 className="card-title">{doctor.first_name} {doctor.last_name}</h3>
            <p className="card-text">{doctor.email}</p>
            <p className="card-text" style={{ fontSize: '12px', color: '#6b7280' }}>
              {doctor.speciality}
            </p>
            <p className="card-text">{doctor.phone_num}</p>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => { setSelectedHospitalId(doctor.hospital_id); setActiveTab('stock') }}
            >
              Show Stock
            </button>
            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px' }}
              onClick={() => handleMessage(doctor)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                style={{ width: '16px', height: '16px' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Message
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedDoctor ? `Message ${selectedDoctor.first_name} ${selectedDoctor.last_name}` : 'Add New Doctor'}
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowModal(false)
                  setSelectedDoctor(null)
                }}
              >
                ×
              </button>
            </div>
            {selectedDoctor ? (
              <div>
                <div className="form-group">
                  <label className="form-label">To:</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedDoctor.email}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject:</label>
                  <input type="text" className="form-input" placeholder="Enter subject" />
                </div>
                <div className="form-group">
                  <label className="form-label">Message:</label>
                  <textarea
                    className="form-input"
                    rows={5}
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false)
                      setSelectedDoctor(null)
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary">Send Message</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label className="form-label">First Name:</label>
                  <input type="text" className="form-input" placeholder="Enter first name" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name:</label>
                  <input type="text" className="form-input" placeholder="Enter last name" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input type="email" className="form-input" placeholder="Enter email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number:</label>
                  <input type="text" className="form-input" placeholder="Enter phone number" value={form.phone_num} onChange={e => setForm(f => ({ ...f, phone_num: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Speciality:</label>
                  <input type="text" className="form-input" placeholder="Enter speciality" value={form.speciality} onChange={e => setForm(f => ({ ...f, speciality: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Auth ID (optional):</label>
                  <input type="text" className="form-input" placeholder="Enter auth id" value={form.auth_id} onChange={e => setForm(f => ({ ...f, auth_id: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddDoctor}>
                    Add Doctor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}

