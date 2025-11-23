'use client'

import React, { useState } from 'react'
import HospitalLayout from '@/components/HospitalLayout'

// Mock data for doctors
const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Jason Price',
    email: 'jason.price@hospital.com',
    specialty: 'Cardiologist',
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    name: 'Dr. Duane Dean',
    email: 'duane.dean@hospital.com',
    specialty: 'Hematologist',
    image: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 3,
    name: 'Dr. Jonathan Barker',
    email: 'jonathan.barker@hospital.com',
    specialty: 'Emergency Medicine',
    image: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 4,
    name: 'Dr. Rosie Glover',
    email: 'rosie.glover@hospital.com',
    specialty: 'Surgeon',
    image: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 5,
    name: 'Dr. Patrick Greer',
    email: 'patrick.greer@hospital.com',
    specialty: 'Internal Medicine',
    image: 'https://i.pravatar.cc/150?img=16',
  },
  {
    id: 6,
    name: 'Dr. Darrell Ortega',
    email: 'darrell.ortega@hospital.com',
    specialty: 'Pediatrician',
    image: 'https://i.pravatar.cc/150?img=17',
  },
]

interface Doctor {
  id: number
  name: string
  email: string
  specialty: string
  image: string
}

export default function DoctorsPage() {
  const [doctors] = useState<Doctor[]>(mockDoctors)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

  const handleMessage = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
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
        <button className="tab">Stock</button>
        <button className="tab active">Doctors</button>
      </div>

      <div className="cards-grid">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="card">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="card-image"
            />
            <h3 className="card-title">{doctor.name}</h3>
            <p className="card-text">{doctor.email}</p>
            <p className="card-text" style={{ fontSize: '12px', color: '#6b7280' }}>
              {doctor.specialty}
            </p>
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
                {selectedDoctor ? `Message ${selectedDoctor.name}` : 'Add New Doctor'}
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
                  <label className="form-label">Name:</label>
                  <input type="text" className="form-input" placeholder="Enter doctor name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email:</label>
                  <input type="email" className="form-input" placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialty:</label>
                  <input type="text" className="form-input" placeholder="Enter specialty" />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary">Add Doctor</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}

