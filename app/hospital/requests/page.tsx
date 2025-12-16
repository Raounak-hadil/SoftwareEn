'use client'

import React, { useState, useEffect } from 'react'
import HospitalLayout from '@/components/HospitalLayout'

// --- Interfaces matching your Supabase/Backend responses ---

interface DoctorDetails {
  first_name: string
  last_name: string
  speciality: string
  email: string
}

interface DoctorRequest {
  id: number
  hospital_id: number
  doctor_id: number
  urgency: string // specific to doctor request table
  blood_type: string
  quantity: number
  request_date: string
  status: string
  seen: boolean
  doctor_details?: DoctorDetails // Joined data
}

interface HospitalDetails {
  hosname: string
  city: string
}

interface HospitalRequest {
  id: number
  hospital_from_id: number
  hospital_to_id: number
  email: string
  blood_type: string
  priority: string // 'priority' in hospital request table
  units_needed: number
  notes: string
  status: string
  hospital_from_details?: HospitalDetails // Joined data
}

interface Donator {
  id: number
  name: string // Assuming DB view or frontend mapping
  phone: string
  bloodType: string
  lastDonation: string
}

// NOTE: Based on your backend, donators might return snake_case. 
// If your DB returns `first_name`, you may need to adjust the interface below.
interface DBDonator {
  id: number
  first_name: string
  last_name: string
  phone_num: string
  blood_type: string
  last_donation_date: string
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'forever-donators' | 'other-requests'>('requests')
  
  // Data State
  const [doctorRequests, setDoctorRequests] = useState<DoctorRequest[]>([])
  const [hospitalRequests, setHospitalRequests] = useState<HospitalRequest[]>([])
  const [foreverDonators, setForeverDonators] = useState<DBDonator[]>([])
  const [loading, setLoading] = useState(true)
  const [hospitals, setHospitals] = useState<{ id: number; hosname: string; city?: string }[]>([])

  // Modal State
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showDonatorModal, setShowDonatorModal] = useState(false)
  const [selectedDonator, setSelectedDonator] = useState<DBDonator | null>(null)
  // Track which doctor request is being updated and which action is in progress
  const [updatingRequestId, setUpdatingRequestId] = useState<number | null>(null)
  const [updatingAction, setUpdatingAction] = useState<'Approved' | 'Rejected' | null>(null)

  // Form State for Sending Request
  const [requestForm, setRequestForm] = useState({
    hospital_to_id: '',
    email: 'contact@myhospital.com', // Default or user input
    blood_type: 'O+',
    priority: 'Medium',
    units_needed: 1,
    notes: ''
  })

  // --- 1. Fetch All Data ---
  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch Doctor Requests
      const docRes = await fetch('/api/hospital/doctorsRequests/Requests')
      const docData = await docRes.json()
      if (docData.success) setDoctorRequests(docData.pending_requests)

      // Fetch Incoming Hospital Requests
      const hospRes = await fetch('/api/hospital/hospitalRequests/incoming')
      const hospData = await hospRes.json()
      if (hospData.success) setHospitalRequests(hospData.incoming_requests)

      // Fetch Donators
      // Linked to /app/api/hospital/Donnations/myDonors/route.ts
      const donRes = await fetch('/api/hospital/Donnations/myDonors') 
      const donData = await donRes.json()
      if (donData.success) setForeverDonators(donData.donators)

      // Fetch hospitals for the request target dropdown
      const hosRes = await fetch('/api/hospitals_list')
      const hosData = await hosRes.json()
      if (hosData?.hospitals && Array.isArray(hosData.hospitals)) setHospitals(hosData.hospitals)

    } catch (error) {
      console.error("Failed to fetch requests data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- 2. Action Handlers ---

  const handleDoctorAction = async (id: number, status: 'Approved' | 'Rejected') => {
    // Prevent concurrent updates
    if (updatingRequestId) return

    setUpdatingRequestId(id)
    setUpdatingAction(status)

    try {
      const res = await fetch('/api/hospital/doctorsRequests/Requests/update_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, new_status: status })
      })

      const json = await res.json()
      if (res.ok && json?.success) {
        // Remove the handled request from UI
        setDoctorRequests(prev => prev.filter(r => r.id !== id))
        // Optional: show a brief confirmation
        // eslint-disable-next-line no-alert
        alert(`Request ${status.toLowerCase()} successfully.`)
      } else {
        // eslint-disable-next-line no-alert
        alert(json?.error || 'Failed to update the request')
        console.error('Failed to update doctor request:', json)
      }
    } catch (error) {
      console.error('Error updating doctor request:', error)
      // eslint-disable-next-line no-alert
      alert('Something went wrong while updating the request')
    } finally {
      setUpdatingRequestId(null)
      setUpdatingAction(null)
    }
  }

  const handleHospitalAction = async (id: number, status: 'Approved' | 'Rejected') => {
    try {
      const res = await fetch('/api/hospital/hospitalRequests/update_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: id, new_status: status })
      })
      if (res.ok) {
        // Optimistic update: Remove from list
        setHospitalRequests(prev => prev.filter(r => r.id !== id))
      }
    } catch (error) {
      console.error("Error updating hospital request:", error)
    }
  }

  // --- 3. Handle Form Submission (Your POST Logic) ---
  const handleSendRequest = async () => {
    if (!requestForm.hospital_to_id) return alert("Please select a Target Hospital")

    try {
      const res = await fetch('/api/hospital/hospitalRequests/requestForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospital_to_id: parseInt(requestForm.hospital_to_id),
          email: requestForm.email,
          blood_type: requestForm.blood_type,
          priority: requestForm.priority,
          units_needed: requestForm.units_needed,
          notes: requestForm.notes
        })
      })

      const result = await res.json()
      
      if (res.ok && result.success) {
        alert("Request sent successfully!")
        setShowRequestModal(false)
        // Reset form
        setRequestForm(prev => ({ ...prev, units_needed: 1, notes: '' }))
      } else {
        alert(result.error || "Failed to send request")
      }
    } catch (error) {
      console.error("Error sending request:", error)
    }
  }

  // Helper for status colors
  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      'Approved': 'text-green-600 bg-green-100',
      'Completed': 'text-green-600 bg-green-100',
      'Processing': 'text-blue-600 bg-blue-100',
      'Pending': 'text-yellow-600 bg-yellow-100',
      'Rejected': 'text-red-600 bg-red-100',
      'On Hold': 'text-orange-600 bg-orange-100',
      'In Transit': 'text-purple-600 bg-purple-100',
    }
    return `px-2 py-1 rounded-full text-xs font-semibold ${map[status] || 'text-gray-600 bg-gray-100'}`
  }

  return (
    <HospitalLayout>
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="text-[32px] font-bold text-[#111827] mb-[30px]">Requests</h1>
        <button 
          className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c]" 
          onClick={() => setShowRequestModal(true)}
        >
          Request from Other Hospital
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 mb-[30px]">
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'requests' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
          onClick={() => setActiveTab('requests')}
        >
          Doctor Requests
        </button>
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'other-requests' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
          onClick={() => setActiveTab('other-requests')}
        >
          Incoming Hospital Requests
        </button>
        
      </div>

      {loading && <div className="p-10 text-center text-gray-500">Loading requests...</div>}

      {/* DOCTOR REQUESTS TABLE */}
      {!loading && activeTab === 'requests' && (
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Doctor</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Speciality</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Urgency</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Quantity</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Date</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Status</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctorRequests.length === 0 && <tr><td colSpan={8} className="p-4 text-center text-gray-500">No pending doctor requests.</td></tr>}
              {doctorRequests.map((request) => (
                <tr key={request.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-medium">
                    {request.doctor_details 
                      ? `${request.doctor_details.first_name} ${request.doctor_details.last_name}` 
                      : `ID: ${request.doctor_id}`}
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    {request.doctor_details?.speciality || '-'}
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <span className={request.urgency === 'Emergency' ? 'text-red-600 font-bold' : ''}>
                      {request.urgency}
                    </span>
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-bold">{request.blood_type}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.quantity}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    {new Date(request.request_date).toLocaleDateString()}
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <span className={getStatusClass(request.status)}>{request.status}</span>
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button
                        className="py-1.5 px-3 rounded text-xs font-semibold bg-[#dc2626] text-white hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDoctorAction(request.id, 'Approved')}
                        disabled={updatingRequestId === request.id}
                      >
                        {updatingRequestId === request.id && updatingAction === 'Approved' ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        className="py-1.5 px-3 rounded text-xs font-semibold bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleDoctorAction(request.id, 'Rejected')}
                        disabled={updatingRequestId === request.id}
                      >
                        {updatingRequestId === request.id && updatingAction === 'Rejected' ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* HOSPITAL INCOMING REQUESTS TABLE */}
      {!loading && activeTab === 'other-requests' && (
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Hospital From</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">City</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Email</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Priority</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Units</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Notes</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Status</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitalRequests.length === 0 && <tr><td colSpan={9} className="p-4 text-center text-gray-500">No incoming requests.</td></tr>}
              {hospitalRequests.map((request) => (
                <tr key={request.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-medium">
                    {request.hospital_from_details?.hosname || `ID: ${request.hospital_from_id}`}
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    {request.hospital_from_details?.city || '-'}
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.email}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-bold">{request.blood_type}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.priority}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.units_needed}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#6b7280] text-xs max-w-[150px] truncate">{request.notes}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <span className={getStatusClass(request.status)}>{request.status}</span>
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button className="py-1.5 px-3 rounded text-xs font-semibold bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                        onClick={() => handleHospitalAction(request.id, 'Approved')}>
                        Approve
                      </button>
                      <button className="py-1.5 px-3 rounded text-xs font-semibold bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                         onClick={() => handleHospitalAction(request.id, 'Rejected')}>
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

     

      {/* REQUEST FORM MODAL (LINKED TO /api/hospital_request/route.ts) */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowRequestModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Request Blood from Other Hospital</h2>
              <button className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]" onClick={() => setShowRequestModal(false)}>×</button>
            </div>
            
            <div className="mb-5">
              <label className="block mb-2 font-semibold text-[#111827] text-sm">Target Hospital:</label>
              <select
                className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white"
                value={requestForm.hospital_to_id}
                onChange={(e) => setRequestForm({...requestForm, hospital_to_id: e.target.value})}
              >
                <option value="">Select hospital</option>
                {hospitals.map(h => (
                  <option key={h.id} value={String(h.id)}>{h.hosname}{h.city ? ` — ${h.city}` : ''} (ID: {h.id})</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Choose the hospital to request from.</p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-[#111827] text-sm">Your Contact Email:</label>
              <input 
                type="email" 
                className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white"
                value={requestForm.email}
                onChange={(e) => setRequestForm({...requestForm, email: e.target.value})}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
              <select 
                className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white"
                value={requestForm.blood_type}
                onChange={(e) => setRequestForm({...requestForm, blood_type: e.target.value})}
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-[#111827] text-sm">Units Needed:</label>
              <input 
                type="number" 
                className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm" 
                min="1"
                value={requestForm.units_needed}
                onChange={(e) => setRequestForm({...requestForm, units_needed: parseInt(e.target.value)})}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-[#111827] text-sm">Priority:</label>
              <select 
                className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white"
                value={requestForm.priority}
                onChange={(e) => setRequestForm({...requestForm, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-semibold text-[#111827] text-sm">Notes:</label>
              <textarea
                className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                rows={3}
                placeholder="Additional notes"
                value={requestForm.notes}
                onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
              ></textarea>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button 
                className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                onClick={handleSendRequest}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DONATOR CONTACT MODAL (Placeholder for future SMS API) */}
      {showDonatorModal && selectedDonator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowDonatorModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Contact Donator</h2>
              <button className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]" onClick={() => setShowDonatorModal(false)}>×</button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-bold">{selectedDonator.first_name} {selectedDonator.last_name}</p>
                <p>Phone: {selectedDonator.phone_num}</p>
                <p>Blood: {selectedDonator.blood_type}</p>
              </div>

              <div className="flex gap-2">
                 <button className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700">Call Now</button>
                 <button className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Send SMS</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}