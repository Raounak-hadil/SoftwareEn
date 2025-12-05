'use client'

import React, { useState } from 'react'
import HospitalLayout from '@/components/HospitalLayout'

// Mock data for requests
const mockRequests = [
  {
    id: 1,
    from: 'CHU Mustapha',
    for: 'CHU Mustapha',
    requestedBy: 'Dr. Jason Price',
    date: '04 Sep 2024',
    type: 'O+',
    quantity: 2,
    status: 'Completed',
  },
  {
    id: 2,
    from: 'CHU Mustapha',
    for: 'CHU Mustapha',
    requestedBy: 'Dr. Duane Dean',
    date: '28 May 2024',
    type: 'A+',
    quantity: 3,
    status: 'Processing',
  },
  {
    id: 3,
    from: 'CHU Mustapha',
    for: 'CHU Mustapha',
    requestedBy: 'Dr. Jonathan Barker',
    date: '23 Nov 2024',
    type: 'B-',
    quantity: 1,
    status: 'Rejected',
  },
  {
    id: 4,
    from: 'Hospital ABC',
    for: 'CHU Mustapha',
    requestedBy: 'Hospital ABC Admin',
    date: '15 Aug 2024',
    type: 'O-',
    quantity: 5,
    status: 'On Hold',
  },
  {
    id: 5,
    from: 'CHU Mustapha',
    for: 'Hospital XYZ',
    requestedBy: 'CHU Mustapha Admin',
    date: '21 Dec 2024',
    type: 'AB+',
    quantity: 4,
    status: 'In Transit',
  },
]

const mockForeverDonators = [
  {
    id: 1,
    name: 'Ahmed Benali',
    phone: '+213 555 123 456',
    bloodType: 'O+',
    lastDonation: '15 Jan 2024',
  },
  {
    id: 2,
    name: 'Fatima Zohra',
    phone: '+213 555 234 567',
    bloodType: 'A+',
    lastDonation: '20 Jan 2024',
  },
  {
    id: 3,
    name: 'Mohamed Amine',
    phone: '+213 555 345 678',
    bloodType: 'B-',
    lastDonation: '10 Jan 2024',
  },
]

// DoctorRequests and HospitalRequests interfaces and data
interface DoctorRequest {
  id: number;
  hospital_id: number;
  doctor_id: number;
  urgency: string;
  blood_type: string;
  quantity: number;
  request_date: string;
  status: string;
  seen: boolean;
}
interface HospitalRequest {
  id: number;
  hospital_from_id: number;
  hospital_to_id: number;
  email: string;
  blood_type: string;
  priority: string;
  units_needed: number;
  notes: string;
  status: string;
}

const mockDoctorRequests: DoctorRequest[] = [
  { id: 1, hospital_id: 1, doctor_id: 1, urgency: 'Urgent', blood_type: 'O+', quantity: 2, request_date: '2024-09-15', status: 'Completed', seen: true },
  { id: 2, hospital_id: 1, doctor_id: 2, urgency: 'Normal', blood_type: 'A+', quantity: 3, request_date: '2024-05-28', status: 'Processing', seen: false },
  { id: 3, hospital_id: 1, doctor_id: 3, urgency: 'Emergency', blood_type: 'B-', quantity: 1, request_date: '2024-11-23', status: 'Rejected', seen: true },
];
const mockHospitalRequests: HospitalRequest[] = [
  { id: 1, hospital_from_id: 2, hospital_to_id: 1, email: 'abc@hospital.com', blood_type: 'O-', priority: 'Urgent', units_needed: 5, notes: 'Fast delivery needed', status: 'On Hold' },
  { id: 2, hospital_from_id: 1, hospital_to_id: 3, email: 'xyz@hospital.com', blood_type: 'AB+', priority: 'Normal', units_needed: 4, notes: '-', status: 'In Transit' },
];

interface Donator {
  id: number
  name: string
  phone: string
  bloodType: string
  lastDonation: string
}

export default function RequestsPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'forever-donators' | 'other-requests'>('requests')
  const [doctorRequests, setDoctorRequests] = useState<DoctorRequest[]>(mockDoctorRequests)
  const [hospitalRequests, setHospitalRequests] = useState<HospitalRequest[]>(mockHospitalRequests)
  const [foreverDonators] = useState<Donator[]>(mockForeverDonators)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showDonatorModal, setShowDonatorModal] = useState(false)
  const [selectedDonator, setSelectedDonator] = useState<Donator | null>(null)

  const getStatusClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      Completed: 'status-completed',
      Processing: 'status-processing',
      Rejected: 'status-rejected',
      'On Hold': 'status-on-hold',
      'In Transit': 'status-in-transit',
    }
    return statusMap[status] || 'status-processing'
  }

  const handleRequestDonator = (donator: Donator) => {
    setSelectedDonator(donator)
    setShowDonatorModal(true)
  }

  const handleApproveDoctor = (id: number) => {
    setDoctorRequests(dr => dr.map(r => r.id === id ? { ...r, status: 'Approved' } : r))
  }
  const handleRejectDoctor = (id: number) => {
    setDoctorRequests(dr => dr.map(r => r.id === id ? { ...r, status: 'Rejected' } : r))
  }
  const handleApproveHospital = (id: number) => {
    setHospitalRequests(hr => hr.map(r => r.id === id ? { ...r, status: 'Approved' } : r))
  }
  const handleRejectHospital = (id: number) => {
    setHospitalRequests(hr => hr.map(r => r.id === id ? { ...r, status: 'Rejected' } : r))
  }

  return (
    <HospitalLayout>
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="text-[32px] font-bold text-[#111827] mb-[30px]">Requests</h1>
        <button 
          className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" 
          onClick={() => setShowRequestModal(true)}
        >
          Request from Other Hospital
        </button>
      </div>

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
          Other Hospitals Requests
        </button>
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'forever-donators' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
          onClick={() => setActiveTab('forever-donators')}
        >
          Forever Donators
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Hospital ID</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Doctor ID</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Urgency</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Quantity</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Request Date</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Status</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Seen</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctorRequests.map((request) => (
                <tr key={request.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.hospital_id}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.doctor_id}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.urgency}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.blood_type}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.quantity}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.request_date}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.status}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.seen ? 'Yes' : 'No'}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" onClick={() => handleApproveDoctor(request.id)}>Approve</button>
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]" onClick={() => handleRejectDoctor(request.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'other-requests' && (
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Hospital From ID</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Hospital To ID</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Email</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Priority</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Units Needed</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Notes</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Status</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitalRequests.map((request) => (
                <tr key={request.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.hospital_from_id}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.hospital_to_id}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.email}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.blood_type}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.priority}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.units_needed}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.notes}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.status}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" onClick={() => handleApproveHospital(request.id)}>Approve</button>
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]" onClick={() => handleRejectHospital(request.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'forever-donators' && (
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Name</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Phone</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Last Donation</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foreverDonators.map((donator) => (
                <tr key={donator.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.name}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.phone}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.bloodType}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.lastDonation}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button
                        className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover"
                        onClick={() => handleRequestDonator(donator)}
                      >
                        Request
                      </button>
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]">Call</button>
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]">SMS</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-5 font-semibold text-[#111827]">Showing {foreverDonators.length} forever donators</div>
        </div>
      )}

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowRequestModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Request Blood from Other Hospital</h2>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]"
                onClick={() => setShowRequestModal(false)}
              >
                ×
              </button>
            </div>
            <div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Hospital:</label>
                <select className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white">
                  <option>Select Hospital</option>
                  <option>Hospital ABC</option>
                  <option>Hospital XYZ</option>
                  <option>Hospital DEF</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                <select className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white">
                  <option>Select Blood Type</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Quantity:</label>
                <input type="number" className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" placeholder="Enter quantity" min="1" />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Urgency:</label>
                <select className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white">
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Notes:</label>
                <textarea
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                  rows={3}
                  placeholder="Additional notes"
                ></textarea>
              </div>
              <div className="flex gap-2.5 justify-end">
                <button
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover">Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDonatorModal && selectedDonator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowDonatorModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Request from Forever Donator</h2>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]"
                onClick={() => {
                  setShowDonatorModal(false)
                  setSelectedDonator(null)
                }}
              >
                ×
              </button>
            </div>
            <div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Donator:</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                  value={selectedDonator.name}
                  readOnly
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Phone:</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                  value={selectedDonator.phone}
                  readOnly
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                  value={selectedDonator.bloodType}
                  readOnly
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Preferred Date:</label>
                <input type="date" className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Preferred Time:</label>
                <input type="time" className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Contact Method:</label>
                <select className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white">
                  <option>Phone Call</option>
                  <option>SMS</option>
                  <option>Both</option>
                </select>
              </div>
              <div className="flex gap-2.5 justify-end">
                <button
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                  onClick={() => {
                    setShowDonatorModal(false)
                    setSelectedDonator(null)
                  }}
                >
                  Cancel
                </button>
                <button className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover">Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}

