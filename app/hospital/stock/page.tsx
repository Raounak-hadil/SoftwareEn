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
<<<<<<< HEAD
      <div className="page-header">
        <h1 className="page-title">CHU Mustapha</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
=======
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="text-[32px] font-bold text-[#111827] mb-[30px]">CHU Mustapha</h1>
        <button 
          className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" 
          onClick={() => setShowAddModal(true)}
        >
>>>>>>> hospitalprofilelast
          Add New Unit
        </button>
      </div>

<<<<<<< HEAD
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'stock' ? 'active' : ''}`}
=======
      <div className="flex gap-2.5 mb-[30px]">
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'stock' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
>>>>>>> hospitalprofilelast
          onClick={() => setActiveTab('stock')}
        >
          Stock
        </button>
        <button
<<<<<<< HEAD
          className={`tab ${activeTab === 'donators' ? 'active' : ''}`}
=======
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'donators' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
>>>>>>> hospitalprofilelast
          onClick={() => setActiveTab('donators')}
        >
          Donators
        </button>
        <button
<<<<<<< HEAD
          className={`tab ${activeTab === 'forever-donators' ? 'active' : ''}`}
=======
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'forever-donators' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
>>>>>>> hospitalprofilelast
          onClick={() => setActiveTab('forever-donators')}
        >
          Forever Donators
        </button>
      </div>

      {activeTab === 'stock' && (
<<<<<<< HEAD
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Hospital ID</th>
                <th>Blood Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Actions</th>
=======
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Hospital ID</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Quantity</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Date</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
>>>>>>> hospitalprofilelast
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
<<<<<<< HEAD
                <tr key={item.id}>
                  <td>{item.hospital_id}</td>
                  <td>{item.blood_type}</td>
                  <td>{item.quantity}</td>
                  <td>{item.date}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-primary btn-small" onClick={() => handleUpdateClick(item)}>Update</button>
=======
                <tr key={item.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{item.hospital_id}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{item.blood_type}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{item.quantity}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{item.date}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button 
                        className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" 
                        onClick={() => handleUpdateClick(item)}
                      >
                        Update
                      </button>
>>>>>>> hospitalprofilelast
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<<<<<<< HEAD
          <div className="summary-text">Total = {totalUnits} Units</div>
=======
          <div className="text-right mt-5 font-semibold text-[#111827]">Total = {totalUnits} Units</div>
>>>>>>> hospitalprofilelast
        </div>
      )}

      {activeTab === 'donators' && (
<<<<<<< HEAD
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
=======
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Name</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Email</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Phone</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Last Donation</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Next Available</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
>>>>>>> hospitalprofilelast
              </tr>
            </thead>
            <tbody>
              {regularDonators.map((donator) => (
<<<<<<< HEAD
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
=======
                <tr key={donator.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.name}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.email}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.phone}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.bloodType}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.lastDonation}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.nextAvailable}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button
                        className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover"
>>>>>>> hospitalprofilelast
                        onClick={() => handleSchedule(donator)}
                      >
                        Schedule
                      </button>
<<<<<<< HEAD
                      <button className="btn btn-secondary btn-small">Contact</button>
=======
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]">Contact</button>
>>>>>>> hospitalprofilelast
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<<<<<<< HEAD
          <div className="summary-text">Showing {regularDonators.length} regular donators</div>
=======
          <div className="text-right mt-5 font-semibold text-[#111827]">Showing {regularDonators.length} regular donators</div>
>>>>>>> hospitalprofilelast
        </div>
      )}

      {activeTab === 'forever-donators' && (
<<<<<<< HEAD
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
=======
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Name</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Email</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Phone</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Last Donation</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Next Available</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
>>>>>>> hospitalprofilelast
              </tr>
            </thead>
            <tbody>
              {foreverDonators.map((donator) => (
<<<<<<< HEAD
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
=======
                <tr key={donator.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.name}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.email}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.phone}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.bloodType}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.lastDonation}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{donator.nextAvailable}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      <button
                        className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover"
>>>>>>> hospitalprofilelast
                        onClick={() => handleSchedule(donator)}
                      >
                        Request Now
                      </button>
<<<<<<< HEAD
                      <button className="btn btn-secondary btn-small">Call</button>
                      <button className="btn btn-secondary btn-small">SMS</button>
=======
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]">Call</button>
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]">SMS</button>
>>>>>>> hospitalprofilelast
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
<<<<<<< HEAD
          <div className="summary-text">Showing {foreverDonators.length} forever donators</div>
=======
          <div className="text-right mt-5 font-semibold text-[#111827]">Showing {foreverDonators.length} forever donators</div>
>>>>>>> hospitalprofilelast
        </div>
      )}

      {showAddModal && (
<<<<<<< HEAD
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Unit</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
=======
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Add New Unit</h2>
              <button className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]" onClick={() => setShowAddModal(false)}>
>>>>>>> hospitalprofilelast
                ×
              </button>
            </div>
            <div>
<<<<<<< HEAD
              <div className="form-group">
                <label className="form-label">Hospital ID:</label>
                <input type="number" className="form-input" value={newStock.hospital_id} onChange={e => setNewStock(ns => ({ ...ns, hospital_id: parseInt(e.target.value, 10) }))} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Type:</label>
                <select className="form-select" value={newStock.blood_type} onChange={e => setNewStock(ns => ({ ...ns, blood_type: e.target.value }))}>
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Hospital ID:</label>
                <input 
                  type="number" 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" 
                  value={newStock.hospital_id} 
                  onChange={e => setNewStock(ns => ({ ...ns, hospital_id: parseInt(e.target.value, 10) }))} 
                  min="1" 
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                <select 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white" 
                  value={newStock.blood_type} 
                  onChange={e => setNewStock(ns => ({ ...ns, blood_type: e.target.value }))}
                >
>>>>>>> hospitalprofilelast
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
<<<<<<< HEAD
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
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Quantity:</label>
                <input 
                  type="number" 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" 
                  value={newStock.quantity} 
                  onChange={e => setNewStock(ns => ({ ...ns, quantity: parseInt(e.target.value, 10) }))} 
                  min="1" 
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Date:</label>
                <input 
                  type="date" 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" 
                  value={newStock.date} 
                  onChange={e => setNewStock(ns => ({ ...ns, date: e.target.value }))} 
                />
              </div>
              <div className="flex gap-2.5 justify-end">
                <button 
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" 
                  onClick={handleAddUnit}
                >
                  Add Unit
                </button>
>>>>>>> hospitalprofilelast
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && editStock && (
<<<<<<< HEAD
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
=======
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowUpdateModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Update Unit</h2>
              <button className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>
            <div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Hospital ID:</label>
                <input 
                  type="number" 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" 
                  value={editStock.hospital_id} 
                  onChange={e => setEditStock({...editStock, hospital_id: parseInt(e.target.value, 10)})} 
                  min="1" 
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                <select 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white" 
                  value={editStock.blood_type} 
                  onChange={e => setEditStock({...editStock, blood_type: e.target.value})}
                >
>>>>>>> hospitalprofilelast
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
<<<<<<< HEAD
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
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Quantity:</label>
                <input 
                  type="number" 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" 
                  value={editStock.quantity} 
                  onChange={e => setEditStock({...editStock, quantity: parseInt(e.target.value, 10)})} 
                  min="1" 
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Date:</label>
                <input 
                  type="date" 
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" 
                  value={editStock.date} 
                  onChange={e => setEditStock({...editStock, date: e.target.value})} 
                />
              </div>
              <div className="flex gap-2.5 justify-end">
                <button 
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]" 
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" 
                  onClick={handleSaveUpdate}
                >
                  Save Update
                </button>
>>>>>>> hospitalprofilelast
              </div>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && selectedDonator && (
<<<<<<< HEAD
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {selectedDonator.isForever ? 'Request from Forever Donator' : 'Schedule Donation'}
              </h2>
              <button
                className="modal-close"
=======
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">
                {selectedDonator.isForever ? 'Request from Forever Donator' : 'Schedule Donation'}
              </h2>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]"
>>>>>>> hospitalprofilelast
                onClick={() => {
                  setShowScheduleModal(false)
                  setSelectedDonator(null)
                }}
              >
                ×
              </button>
            </div>
            <div>
<<<<<<< HEAD
              <div className="form-group">
                <label className="form-label">Donator:</label>
                <input
                  type="text"
                  className="form-input"
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Donator:</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
>>>>>>> hospitalprofilelast
                  value={selectedDonator.name}
                  readOnly
                />
              </div>
<<<<<<< HEAD
              <div className="form-group">
                <label className="form-label">Blood Type:</label>
                <input
                  type="text"
                  className="form-input"
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                <input
                  type="text"
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
>>>>>>> hospitalprofilelast
                  value={selectedDonator.bloodType}
                  readOnly
                />
              </div>
<<<<<<< HEAD
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
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Preferred Date:</label>
                <input type="date" className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Preferred Time:</label>
                <input type="time" className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]" />
              </div>
              {selectedDonator.isForever && (
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-[#111827] text-sm">Contact Method:</label>
                  <select className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white">
>>>>>>> hospitalprofilelast
                    <option>Phone Call</option>
                    <option>SMS</option>
                    <option>Both</option>
                  </select>
                </div>
              )}
<<<<<<< HEAD
              <div className="form-group">
                <label className="form-label">Notes:</label>
                <textarea
                  className="form-input"
=======
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Notes:</label>
                <textarea
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
>>>>>>> hospitalprofilelast
                  rows={3}
                  placeholder="Additional notes or instructions"
                ></textarea>
              </div>
<<<<<<< HEAD
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
=======
              <div className="flex gap-2.5 justify-end">
                <button
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
>>>>>>> hospitalprofilelast
                  onClick={() => {
                    setShowScheduleModal(false)
                    setSelectedDonator(null)
                  }}
                >
                  Cancel
                </button>
<<<<<<< HEAD
                <button className="btn btn-primary">
=======
                <button className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover">
>>>>>>> hospitalprofilelast
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
<<<<<<< HEAD

=======
>>>>>>> hospitalprofilelast
