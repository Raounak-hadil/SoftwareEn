'use client'

import React, { useState, useEffect } from 'react'
import HospitalLayout from '@/components/HospitalLayout'
import Link from 'next/link';

// 1. Interfaces matching your Supabase structure
interface Doctor {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_num: string
  speciality: string
  // Backend doesn't seem to return image yet, so we'll handle that in UI
  image?: string 
}

// 2. Mock Stock (Keeping this as you didn't provide a backend for it yet)
const mockStock = [
  { id: 1, hospital_id: 1, blood_type: 'O+', quantity: 25, date: '2024-09-15' },
  { id: 2, hospital_id: 1, blood_type: 'O-', quantity: 15, date: '2024-09-16' },
  { id: 3, hospital_id: 1, blood_type: 'A+', quantity: 30, date: '2024-09-17' },
  { id: 4, hospital_id: 2, blood_type: 'B+', quantity: 18, date: '2024-09-19' },
  { id: 5, hospital_id: 3, blood_type: 'AB+', quantity: 10, date: '2024-09-21' },
]

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'doctors' | 'requests'>('doctors')
  
  // State for data
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorRequests, setDoctorRequests] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  
  // Note: The "Add Doctor" form is currently frontend-only logic 
  // until you provide an endpoint for creating doctors manually.
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_num: '',
    speciality: '',
    auth_id: '',
  })

  // --- 1. Fetch Data from Backend ---
  const fetchDoctorsData = async () => {
    setLoading(true)
    try {
      // Fetch Active Doctors
      // ASSUMPTION: Your GET accepted doctors route is at /api/hospital/doctors
      const docRes = await fetch('/api/hospital/doctors/myDoctors') 
      const docJson = await docRes.json()
      if (docJson.success) {
        setDoctors(docJson.doctors)
      }

      // Fetch Doctor Requests
      // ASSUMPTION: Your GET requests route is at /api/hospital/doctor-requests
      // (Rename this path to wherever you put that second GET snippet)
      const reqRes = await fetch('/api/hospital/doctors/doctor_requests') 
      const reqJson = await reqRes.json()
      if (reqJson.success) {
        setDoctorRequests(reqJson.doctors)
      }

    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctorsData()
  }, [])

  // --- 2. Action Handlers ---

  const handleMessage = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setShowModal(true)
  }

  // Handle Accept/Reject logic using your PUT endpoint
  const handleReviewRequest = async (doctor_id: number, status: 'Accept' | 'Reject') => {
    try {
      const res = await fetch('/api/hospital/doctors/review_doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id, status }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Action failed")
        return
      }

      // If successful, update UI locally (Optimistic update)
      // 1. Remove from requests
      const reviewedDoc = doctorRequests.find(d => d.id === doctor_id)
      setDoctorRequests(prev => prev.filter(d => d.id !== doctor_id))

      // 2. If Accepted, add to doctors list
      if (status === 'Accept' && reviewedDoc) {
        setDoctors(prev => [reviewedDoc, ...prev])
      }

    } catch (error) {
      console.error("Request failed", error)
      alert("Something went wrong connecting to the server.")
    }
  }

  // --- Helper to generate Avatar since DB doesn't have images yet ---
  const getAvatar = (name: string, seed: number) => {
    return `https://i.pravatar.cc/150?u=${name.replace(' ', '')}${seed}`
  }

  return (
    <HospitalLayout>
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="text-[32px] font-bold text-[#111827] mb-[30px]">Hospital Management</h1>
      </div>

      <div className="flex gap-2.5 mb-[30px]">
        <button 
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'doctors' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`} 
          onClick={() => setActiveTab('doctors')}
        >
          Doctors
        </button>
        <button 
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'requests' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`} 
          onClick={() => setActiveTab('requests')}
        >
          Doctor Requests
          {doctorRequests.length > 0 && (
            <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
              {doctorRequests.length}
            </span>
          )}
        </button>
        <Link href="/hospital/stock" className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 bg-white text-[#dc2626] border border-[#dc2626]">
          Stock
        </Link>
      </div>

      {/* Loading State */}
      {loading && <div className="text-gray-500 py-10">Loading hospital data...</div>}

      {/* --- REQUESTS TAB --- */}
      {!loading && activeTab === 'requests' && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mt-5">
          {doctorRequests.length === 0 && <p className="text-gray-500">No pending requests.</p>}
          
          {doctorRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
              <img
                src={getAvatar(req.email, req.id)}
                alt={`${req.first_name} ${req.last_name}`}
                className="w-full h-[200px] object-cover rounded-lg mb-[15px]"
              />
              <h3 className="text-lg font-semibold text-[#111827] mb-2">{req.first_name} {req.last_name}</h3>
              <p className="text-sm text-[#6b7280] mb-[15px]">{req.email}</p>
              <p className="text-xs text-[#6b7280] mb-[15px] bg-gray-100 inline-block px-2 py-1 rounded">
                {req.speciality}
              </p>
              <p className="text-sm text-[#6b7280] mb-[15px]">{req.phone_num}</p>
              
              <div className="flex gap-2.5 mt-2.5">
                <button
                  className="flex-1 py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c] justify-center"
                  onClick={() => handleReviewRequest(req.id, 'Accept')}
                >
                  Accept
                </button>
                <button
                  className="flex-1 py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb] justify-center"
                  onClick={() => handleReviewRequest(req.id, 'Reject')}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- DOCTORS TAB --- */}
      {!loading && activeTab === 'doctors' && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mt-5">
           {doctors.length === 0 && <p className="text-gray-500">No doctors assigned yet.</p>}

          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
              <img
                src={getAvatar(doctor.email, doctor.id)}
                alt={`${doctor.first_name} ${doctor.last_name}`}
                className="w-full h-[200px] object-cover rounded-lg mb-[15px]"
              />
              <h3 className="text-lg font-semibold text-[#111827] mb-2">{doctor.first_name} {doctor.last_name}</h3>
              <p className="text-sm text-[#6b7280] mb-[15px]">{doctor.email}</p>
              <p className="text-xs text-[#6b7280] mb-[15px] bg-gray-100 inline-block px-2 py-1 rounded">
                {doctor.speciality}
              </p>
              <p className="text-sm text-[#6b7280] mb-[15px]">{doctor.phone_num}</p>
              <button
                className="w-full mt-2.5 py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c] justify-center"
                onClick={() => handleMessage(doctor)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Message
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- MESSAGE MODAL (Frontend Logic) --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">
                {selectedDoctor ? `Message ${selectedDoctor.first_name}` : 'Add New Doctor'}
              </h2>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]"
                onClick={() => {
                  setShowModal(false)
                  setSelectedDoctor(null)
                }}
              >
                ×
              </button>
            </div>
            
            {/* Simple Message Form */}
            {selectedDoctor && (
              <div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-[#111827] text-sm">To:</label>
                  <input
                    type="text"
                    className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-gray-50"
                    value={selectedDoctor.email}
                    readOnly
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-[#111827] text-sm">Message:</label>
                  <textarea
                    className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                    rows={5}
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <div className="flex gap-2.5 justify-end">
                  <button
                    className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer bg-white text-[#111827] border border-[#e5e7eb]"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer bg-[#dc2626] text-white">
                    Send
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