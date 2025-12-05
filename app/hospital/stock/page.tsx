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
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="text-[32px] font-bold text-[#111827] mb-[30px]">CHU Mustapha</h1>
        <button 
          className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover" 
          onClick={() => setShowAddModal(true)}
        >
          Add New Unit
        </button>
      </div>

      <div className="flex gap-2.5 mb-[30px]">
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'stock' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
          onClick={() => setActiveTab('stock')}
        >
          Stock
        </button>
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${
            activeTab === 'donators' 
              ? 'bg-[#dc2626] text-white' 
              : 'bg-white text-[#dc2626] border border-[#dc2626]'
          }`}
          onClick={() => setActiveTab('donators')}
        >
          Donators
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

      {activeTab === 'stock' && (
        <div className="bg-white rounded-lg overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
          <table className="w-full border-collapse">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Hospital ID</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Blood Type</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Quantity</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Date</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-5 font-semibold text-[#111827]">Total = {totalUnits} Units</div>
        </div>
      )}

      {activeTab === 'donators' && (
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
              </tr>
            </thead>
            <tbody>
              {regularDonators.map((donator) => (
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
                        onClick={() => handleSchedule(donator)}
                      >
                        Schedule
                      </button>
                      <button className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]">Contact</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-5 font-semibold text-[#111827]">Showing {regularDonators.length} regular donators</div>
        </div>
      )}

      {activeTab === 'forever-donators' && (
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
              </tr>
            </thead>
            <tbody>
              {foreverDonators.map((donator) => (
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
                        onClick={() => handleSchedule(donator)}
                      >
                        Request Now
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

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">Add New Unit</h2>
              <button className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]" onClick={() => setShowAddModal(false)}>
                ×
              </button>
            </div>
            <div>
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
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateModal && editStock && (
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
              </div>
            </div>
          </div>
        </div>
      )}

      {showScheduleModal && selectedDonator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => setShowScheduleModal(false)}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">
                {selectedDonator.isForever ? 'Request from Forever Donator' : 'Schedule Donation'}
              </h2>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]"
                onClick={() => {
                  setShowScheduleModal(false)
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
              {selectedDonator.isForever && (
                <div className="mb-5">
                  <label className="block mb-2 font-semibold text-[#111827] text-sm">Contact Method:</label>
                  <select className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white">
                    <option>Phone Call</option>
                    <option>SMS</option>
                    <option>Both</option>
                  </select>
                </div>
              )}
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Notes:</label>
                <textarea
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                  rows={3}
                  placeholder="Additional notes or instructions"
                ></textarea>
              </div>
              <div className="flex gap-2.5 justify-end">
                <button
                  className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                  onClick={() => {
                    setShowScheduleModal(false)
                    setSelectedDonator(null)
                  }}
                >
                  Cancel
                </button>
                <button className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover">
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
