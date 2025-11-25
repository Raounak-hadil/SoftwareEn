'use client'

import React, { useState } from 'react'
import HospitalLayout from '@/components/HospitalLayout'

// Correct Stock schema and mockStock
interface StockUnit {
  id: number;
  hospital_id: number;
  blood_type: string;
  quantity: number;
  date: string;
}
const mockStock: StockUnit[] = [
  { id: 1, hospital_id: 1, blood_type: 'O+', quantity: 25, date: '2024-09-15' },
  { id: 2, hospital_id: 1, blood_type: 'O-', quantity: 15, date: '2024-09-16' },
  { id: 3, hospital_id: 1, blood_type: 'A+', quantity: 30, date: '2024-09-17' },
  { id: 4, hospital_id: 1, blood_type: 'A-', quantity: 12, date: '2024-09-18' },
  { id: 5, hospital_id: 1, blood_type: 'B+', quantity: 18, date: '2024-09-19' },
  { id: 6, hospital_id: 1, blood_type: 'B-', quantity: 8, date: '2024-09-20' },
  { id: 7, hospital_id: 1, blood_type: 'AB+', quantity: 10, date: '2024-09-21' },
  { id: 8, hospital_id: 1, blood_type: 'AB-', quantity: 5, date: '2024-09-22' },
];

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
  const [stock, setStock] = useState<StockUnit[]>(mockStock)
  const [donators] = useState<Donator[]>(mockDonators)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStock, setNewStock] = useState<Omit<StockUnit, 'id'> >({ hospital_id: 1, blood_type: '', quantity: 0, date: '' })
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDonator, setSelectedDonator] = useState<Donator | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [editStock, setEditStock] = useState<StockUnit | null>(null)

  const totalUnits = stock.reduce((sum, item) => sum + item.quantity, 0)
  const foreverDonators = donators.filter((d) => d.isForever)
  const regularDonators = donators.filter((d) => !d.isForever)

  const handleSchedule = (donator: Donator) => {
    setSelectedDonator(donator)
    setShowScheduleModal(true)
  }

  // Add New Unit handler
  const handleAddUnit = () => {
    setStock([{ ...newStock, id: stock.length + 1 }, ...stock])
    setShowAddModal(false)
    setNewStock({ hospital_id: 1, blood_type: '', quantity: 0, date: '' })
  }

  const handleUpdateClick = (unit: StockUnit) => {
    setEditStock(unit)
    setShowUpdateModal(true)
  }
  const handleSaveUpdate = () => {
    if (editStock) {
      setStock(stock.map(u => u.id === editStock.id ? editStock : u))
      setShowUpdateModal(false)
      setEditStock(null)
    }
  }

  return (
    <HospitalLayout>
      <div className="page-header">
        <h1 className="page-title">CHU Mustapha</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          Add New Unit
        </button>
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
                <th>Hospital ID</th>
                <th>Blood Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item.id}>
                  <td>{item.hospital_id}</td>
                  <td>{item.blood_type}</td>
                  <td>{item.quantity}</td>
                  <td>{item.date}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-small" onClick={() => handleUpdateClick(item)}>Update</button>
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

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Unit</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Hospital ID:</label>
                <input type="number" className="form-input" value={newStock.hospital_id} onChange={e => setNewStock(ns => ({ ...ns, hospital_id: parseInt(e.target.value, 10) }))} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type:</label>
                <select className="form-select" value={newStock.blood_type} onChange={e => setNewStock(ns => ({ ...ns, blood_type: e.target.value }))}>
                  <option value="">Select Blood Type</option>
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
                <input type="number" className="form-input" value={newStock.quantity} onChange={e => setNewStock(ns => ({ ...ns, quantity: parseInt(e.target.value, 10) }))} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Date:</label>
                <input type="date" className="form-input" value={newStock.date} onChange={e => setNewStock(ns => ({ ...ns, date: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddUnit}>Add Unit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && editStock && (
        <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Update Unit</h2>
              <button className="modal-close" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Hospital ID:</label>
                <input type="number" className="form-input" value={editStock.hospital_id} onChange={e => setEditStock({...editStock, hospital_id: parseInt(e.target.value, 10)})} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type:</label>
                <select className="form-select" value={editStock.blood_type} onChange={e => setEditStock({...editStock, blood_type: e.target.value})}>
                  <option value="">Select Blood Type</option>
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
                <input type="number" className="form-input" value={editStock.quantity} onChange={e => setEditStock({...editStock, quantity: parseInt(e.target.value, 10)})} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Date:</label>
                <input type="date" className="form-input" value={editStock.date} onChange={e => setEditStock({...editStock, date: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveUpdate}>Save Update</button>
              </div>
            </div>
          </div>
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

