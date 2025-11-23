'use client'

import React, { useState } from 'react'
import HospitalLayout from '@/components/HospitalLayout'

// Mock data for stock
const mockStock = [
  {
    id: 1,
    type: 'O+',
    description: 'Universal Donor',
    quantity: 25,
    requests: 5,
    difference: 20,
  },
  {
    id: 2,
    type: 'O-',
    description: 'Universal Recipient',
    quantity: 15,
    requests: 3,
    difference: 12,
  },
  {
    id: 3,
    type: 'A+',
    description: 'Type A Positive',
    quantity: 30,
    requests: 8,
    difference: 22,
  },
  {
    id: 4,
    type: 'A-',
    description: 'Type A Negative',
    quantity: 12,
    requests: 2,
    difference: 10,
  },
  {
    id: 5,
    type: 'B+',
    description: 'Type B Positive',
    quantity: 18,
    requests: 4,
    difference: 14,
  },
  {
    id: 6,
    type: 'B-',
    description: 'Type B Negative',
    quantity: 8,
    requests: 1,
    difference: 7,
  },
  {
    id: 7,
    type: 'AB+',
    description: 'Universal Recipient',
    quantity: 10,
    requests: 2,
    difference: 8,
  },
  {
    id: 8,
    type: 'AB-',
    description: 'Rare Type',
    quantity: 5,
    requests: 1,
    difference: 4,
  },
]

const mockDonators = [
  {
    id: 1,
    name: 'Ahmed Benali',
    phone: '+213 555 123 456',
    bloodType: 'O+',
    email: 'ahmed.benali@email.com',
    lastDonation: '15 Jan 2024',
    nextAvailable: '15 Feb 2024',
    isForever: true,
  },
  {
    id: 2,
    name: 'Fatima Zohra',
    phone: '+213 555 234 567',
    bloodType: 'A+',
    email: 'fatima.zohra@email.com',
    lastDonation: '20 Jan 2024',
    nextAvailable: '20 Feb 2024',
    isForever: true,
  },
  {
    id: 3,
    name: 'Mohamed Amine',
    phone: '+213 555 345 678',
    bloodType: 'B-',
    email: 'mohamed.amine@email.com',
    lastDonation: '10 Jan 2024',
    nextAvailable: '10 Feb 2024',
    isForever: true,
  },
  {
    id: 4,
    name: 'Sara Ali',
    phone: '+213 555 456 789',
    bloodType: 'O+',
    email: 'sara.ali@email.com',
    lastDonation: '25 Dec 2023',
    nextAvailable: '25 Jan 2024',
    isForever: false,
  },
  {
    id: 5,
    name: 'Youssef Kader',
    phone: '+213 555 567 890',
    bloodType: 'A-',
    email: 'youssef.kader@email.com',
    lastDonation: '18 Dec 2023',
    nextAvailable: '18 Jan 2024',
    isForever: false,
  },
]

interface Donator {
  id: number
  name: string
  phone: string
  bloodType: string
  email: string
  lastDonation: string
  nextAvailable: string
  isForever: boolean
}

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'donators' | 'forever-donators'>('stock')
  const [stock] = useState(mockStock)
  const [donators] = useState<Donator[]>(mockDonators)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDonator, setSelectedDonator] = useState<Donator | null>(null)

  const totalUnits = stock.reduce((sum, item) => sum + item.quantity, 0)
  const foreverDonators = donators.filter((d) => d.isForever)
  const regularDonators = donators.filter((d) => !d.isForever)

  const handleSchedule = (donator: Donator) => {
    setSelectedDonator(donator)
    setShowScheduleModal(true)
  }

  return (
    <HospitalLayout>
      <div className="page-header">
        <h1 className="page-title">CHU Mustapha</h1>
        <button className="btn btn-primary">Add New Unit</button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          Stock
        </button>
        <button
          className={`tab ${activeTab === 'donators' ? 'active' : ''}`}
          onClick={() => setActiveTab('donators')}
        >
          Donators
        </button>
        <button
          className={`tab ${activeTab === 'forever-donators' ? 'active' : ''}`}
          onClick={() => setActiveTab('forever-donators')}
        >
          Forever Donators
        </button>
      </div>

      {activeTab === 'stock' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Number of Requests</th>
                <th>Difference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 'bold', color: 'var(--primary-red)' }}>
                    {item.type}
                  </td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.requests}</td>
                  <td
                    style={{
                      color: item.difference >= 0 ? '#059669' : '#dc2626',
                      fontWeight: '600',
                    }}
                  >
                    {item.difference >= 0 ? '+' : ''}
                    {item.difference}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-small">Update</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary-text">Total = {totalUnits} Units</div>
        </div>
      )}

      {activeTab === 'donators' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Blood Type</th>
                <th>Last Donation</th>
                <th>Next Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {regularDonators.map((donator) => (
                <tr key={donator.id}>
                  <td>{donator.name}</td>
                  <td>{donator.email}</td>
                  <td>{donator.phone}</td>
                  <td>{donator.bloodType}</td>
                  <td>{donator.lastDonation}</td>
                  <td>{donator.nextAvailable}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => handleSchedule(donator)}
                      >
                        Schedule
                      </button>
                      <button className="btn btn-secondary btn-small">Contact</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="summary-text">Showing {regularDonators.length} regular donators</div>
        </div>
      )}

      {activeTab === 'forever-donators' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Blood Type</th>
                <th>Last Donation</th>
                <th>Next Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foreverDonators.map((donator) => (
                <tr key={donator.id}>
                  <td>{donator.name}</td>
                  <td>{donator.email}</td>
                  <td>{donator.phone}</td>
                  <td>{donator.bloodType}</td>
                  <td>{donator.lastDonation}</td>
                  <td>{donator.nextAvailable}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => handleSchedule(donator)}
                      >
                        Request Now
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

      {showScheduleModal && selectedDonator && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedDonator.isForever ? 'Request from Forever Donator' : 'Schedule Donation'}
              </h2>
              <button
                className="modal-close"
                onClick={() => {
                  setShowScheduleModal(false)
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
              {selectedDonator.isForever && (
                <div className="form-group">
                  <label className="form-label">Contact Method:</label>
                  <select className="form-select">
                    <option>Phone Call</option>
                    <option>SMS</option>
                    <option>Both</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Notes:</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Additional notes or instructions"
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowScheduleModal(false)
                    setSelectedDonator(null)
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary">
                  {selectedDonator.isForever ? 'Send Request' : 'Schedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}

