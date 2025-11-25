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
      <div className="page-header">
        <h1 className="page-title">Requests</h1>
        <button className="btn btn-primary" onClick={() => setShowRequestModal(true)}>
          Request from Other Hospital
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Doctor Requests
        </button>
        <button
          className={`tab ${activeTab === 'other-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('other-requests')}
        >
          Other Hospitals Requests
        </button>
        <button
          className={`tab ${activeTab === 'forever-donators' ? 'active' : ''}`}
          onClick={() => setActiveTab('forever-donators')}
        >
          Forever Donators
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Hospital ID</th>
                <th>Doctor ID</th>
                <th>Urgency</th>
                <th>Blood Type</th>
                <th>Quantity</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Seen</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctorRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.hospital_id}</td>
                  <td>{request.doctor_id}</td>
                  <td>{request.urgency}</td>
                  <td>{request.blood_type}</td>
                  <td>{request.quantity}</td>
                  <td>{request.request_date}</td>
                  <td>{request.status}</td>
                  <td>{request.seen ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-small" onClick={() => handleApproveDoctor(request.id)}>Approve</button>
                      <button className="btn btn-secondary btn-small" onClick={() => handleRejectDoctor(request.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'other-requests' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Hospital From ID</th>
                <th>Hospital To ID</th>
                <th>Email</th>
                <th>Blood Type</th>
                <th>Priority</th>
                <th>Units Needed</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitalRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.hospital_from_id}</td>
                  <td>{request.hospital_to_id}</td>
                  <td>{request.email}</td>
                  <td>{request.blood_type}</td>
                  <td>{request.priority}</td>
                  <td>{request.units_needed}</td>
                  <td>{request.notes}</td>
                  <td>{request.status}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-small" onClick={() => handleApproveHospital(request.id)}>Approve</button>
                      <button className="btn btn-secondary btn-small" onClick={() => handleRejectHospital(request.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'forever-donators' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Blood Type</th>
                <th>Last Donation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foreverDonators.map((donator) => (
                <tr key={donator.id}>
                  <td>{donator.name}</td>
                  <td>{donator.phone}</td>
                  <td>{donator.bloodType}</td>
                  <td>{donator.lastDonation}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => handleRequestDonator(donator)}
                      >
                        Request
                      </button>
                      <button className="btn btn-secondary btn-small">Call</button>
                      <button className="btn btn-secondary btn-small">SMS</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary-text">Showing {foreverDonators.length} forever donators</div>
        </div>
      )}

      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Request Blood from Other Hospital</h2>
              <button
                className="modal-close"
                onClick={() => setShowRequestModal(false)}
              >
                ×
              </button>
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Hospital:</label>
                <select className="form-select">
                  <option>Select Hospital</option>
                  <option>Hospital ABC</option>
                  <option>Hospital XYZ</option>
                  <option>Hospital DEF</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type:</label>
                <select className="form-select">
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
              <div className="form-group">
                <label className="form-label">Quantity:</label>
                <input type="number" className="form-input" placeholder="Enter quantity" min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Urgency:</label>
                <select className="form-select">
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes:</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Additional notes"
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary">Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDonatorModal && selectedDonator && (
        <div className="modal-overlay" onClick={() => setShowDonatorModal(false)}>
          <div className="modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Request from Forever Donator</h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowDonatorModal(false)
                  setSelectedDonator(null)
                }}
              >
                ×
              </button>
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Donator:</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedDonator.name}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone:</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedDonator.phone}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type:</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedDonator.bloodType}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Date:</label>
                <input type="date" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time:</label>
                <input type="time" className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Method:</label>
                <select className="form-select">
                  <option>Phone Call</option>
                  <option>SMS</option>
                  <option>Both</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDonatorModal(false)
                    setSelectedDonator(null)
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary">Send Request</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}

