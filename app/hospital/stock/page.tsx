'use client'

import React, { useState, useEffect } from 'react'
import HospitalLayout from '@/components/HospitalLayout'

// Correct Stock schema
interface StockUnit {
  id: number;
  hospital_id: number;
  blood_type: string;
  quantity: number;
  date: string;
}

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

// Shape coming from /api/hospital/Donnations/myDonors (permanent_donors table)
interface DBDonator {
  id: number
  first_name: string
  last_name: string
  phone_num: string
  email?: string
  blood_type: string
  last_donation_date?: string | null
}

// Shape coming from /api/hospital/Donnations/donationRequests/get (donors_requests table)
interface DonationRequest {
  id: number
  hospital_id: number
  first_name: string
  last_name: string
  phone_num: string
  email?: string
  blood_type: string
  status: string
  preferred_date?: string | null
  actual_date?: string | null
  forever?: string
  notes?: string
}

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'donators' | 'forever-donators'>('stock')
  const [hospitalName, setHospitalName] = useState<string>('Loading...')
  const [stock, setStock] = useState<StockUnit[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [donators, setDonators] = useState<Donator[]>([])
  const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStock, setNewStock] = useState<Omit<StockUnit, 'id' | 'hospital_id'>>({ blood_type: '', quantity: 0, date: '' })
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedDonator, setSelectedDonator] = useState<Donator | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null)
  const [scheduleDate, setScheduleDate] = useState('')
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [editStock, setEditStock] = useState<StockUnit | null>(null)

  const totalUnits = stock.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
  const foreverDonators = donators.filter((d) => d.isForever)

  const handleSchedule = (donator: Donator) => {
    setSelectedDonator(donator)
    setShowScheduleModal(true)
  }

  const handleScheduleRequest = (request: DonationRequest) => {
    setSelectedRequest(request)
    setScheduleDate('')
    setShowScheduleModal(true)
  }

  const handleSaveSchedule = async () => {
    if (!selectedRequest || !scheduleDate) {
      alert('Please select a date')
      return
    }

    try {
      const res = await fetch('/api/hospital/Donnations/donationRequests/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedRequest.id,
          actual_date: scheduleDate
        })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to schedule donation')
        return
      }

      // Refresh donation requests
      await fetchDonationRequests()
      setShowScheduleModal(false)
      setSelectedRequest(null)
      setScheduleDate('')
    } catch (err) {
      console.error('Error scheduling donation:', err)
      alert('Something went wrong while scheduling')
    }
  }

  const handleUpdateRequestStatus = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/hospital/Donnations/donationRequests/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to update status')
        return
      }

      // Refresh donation requests
      await fetchDonationRequests()
    } catch (err) {
      console.error('Error updating request status:', err)
      alert('Something went wrong')
    }
  }

  // Add New Unit handler (linked to /app/api/hospital/stock/addBlood/route.ts)
  const handleAddUnit = async () => {
    if (!newStock.blood_type || !newStock.quantity || newStock.quantity <= 0) {
      alert('Please select blood type and enter a valid quantity (greater than 0)')
      return
    }

    try {
      const res = await fetch('/api/hospital/stock/addBlood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blood_type: newStock.blood_type,
          quantity: newStock.quantity,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to add blood unit')
        return
      }

      // Refresh stock from backend after successful update
      await fetchStock()

      setShowAddModal(false)
      setNewStock({ blood_type: '', quantity: 0, date: '' })
    } catch (err) {
      console.error('Error adding blood unit:', err)
      alert('Something went wrong while adding the unit')
    }
  }

  const handleUpdateClick = (unit: StockUnit) => {
    setEditStock(unit)
    setShowUpdateModal(true)
  }
  const handleSaveUpdate = async () => {
    if (!editStock) return

    // Validate inputs
    if (!editStock.blood_type || editStock.blood_type.trim() === '') {
      alert('Please select a blood type')
      return
    }

    const quantityNum = Number(editStock.quantity)
    if (isNaN(quantityNum) || quantityNum < 0) {
      alert('Please enter a valid quantity (0 or greater)')
      return
    }

    if (!editStock.id && editStock.id !== 0) {
      alert('Invalid stock item ID')
      return
    }

    const requestBody = {
      id: editStock.id,
      blood_type: editStock.blood_type.trim(),
      quantity: quantityNum
    }

    console.log('Updating stock with:', requestBody)

    try {
      const res = await fetch('/api/hospital/stock/updateStock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await res.json()
      console.log('Update response:', data)

      if (!res.ok || !data.success) {
        alert(data.error || 'Failed to update stock')
        return
      }

      // Refresh stock from backend
      await fetchStock()
      setShowUpdateModal(false)
      setEditStock(null)
      alert('Stock updated successfully!')
    } catch (err) {
      console.error('Error updating stock:', err)
      alert('Something went wrong while updating')
    }
  }

  // Fetch actual stock for the authenticated hospital and replace mock data
  const fetchStock = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/hospital/stock/myStock', { credentials: 'include' });
      const json = await res.json();

      console.log('Stock API Response:', json); // Debug log

      if (!res.ok) {
        console.error('Stock API Error:', json.error || `HTTP ${res.status}`);
        setStock([]);
        setHospitalName('Error loading hospital');
        return;
      }

      if (json.hospital_name) {
        setHospitalName(json.hospital_name);
      }

      // API returns { success: true, stock: [...] }
      if (json?.success !== false && json?.stock !== undefined) {
        const stockArray = Array.isArray(json.stock) ? json.stock : [];
        console.log('Stock array length:', stockArray.length); // Debug log

        const mappedStock = stockArray
          .filter((s: any) => s && (s.blood_type || s.bloodType)) // Filter out invalid entries
          .map((s: any) => ({
            id: s.id || 0,
            hospital_id: s.hospital_id || s.hospitalId || 0,
            blood_type: s.blood_type || s.bloodType || '',
            quantity: Number(s.quantity) || 0,
            date: s.created_at ? new Date(s.created_at).toLocaleDateString() : (s.date || '')
          }));

        console.log('Mapped stock:', mappedStock); // Debug log
        setStock(mappedStock);
      } else {
        console.warn('Unexpected API response format:', json);
        setStock([]);
      }
    } catch (err) {
      console.error('Error fetching hospital stock:', err);
      setStock([]);
    }
    finally {
      setLoading(false)
    }
  };

  // Fetch donators from backend (permanent_donors via /api/hospital/Donnations/myDonors)
  const fetchDonators = async () => {
    try {
      const res = await fetch('/api/hospital/Donnations/myDonors', { credentials: 'include' })
      if (!res.ok) {
        console.warn('Could not fetch hospital donators:', res.status)
        return
      }
      const json = await res.json()
      if (json?.donators && Array.isArray(json.donators)) {
        setDonators(
          (json.donators as DBDonator[]).map((d) => ({
            id: d.id,
            name: `${d.first_name} ${d.last_name}`,
            phone: d.phone_num,
            bloodType: d.blood_type,
            email: d.email ?? '',
            lastDonation: d.last_donation_date
              ? new Date(d.last_donation_date).toLocaleDateString()
              : 'N/A',
            nextAvailable: '',
            // All entries from permanent_donors are "forever" donors
            isForever: true,
          }))
        )
      }
    } catch (err) {
      console.error('Error fetching hospital donators:', err)
    }
  }

  // Fetch donation requests from backend (donors_requests via /api/hospital/Donnations/donationRequests/get)
  const fetchDonationRequests = async () => {
    try {
      const res = await fetch('/api/hospital/Donnations/donationRequests/get', { credentials: 'include' })
      if (!res.ok) {
        console.warn('Could not fetch donation requests:', res.status)
        return
      }
      const json = await res.json()
      if (json?.requests && Array.isArray(json.requests)) {
        setDonationRequests(json.requests as DonationRequest[])
      }
    } catch (err) {
      console.error('Error fetching donation requests:', err)
    }
  }

  useEffect(() => {
    fetchStock();
    fetchDonators();
    fetchDonationRequests();
  }, []);

  return (
    <HospitalLayout>
      <div className="flex justify-between items-center mb-[30px]">
        <h1 className="text-[32px] font-bold text-[#111827] mb-[30px]">{hospitalName}</h1>
        <button
          className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#dc2626]-hover"
          onClick={() => setShowAddModal(true)}
        >
          Add New Unit
        </button>
      </div>

      <div className="flex gap-2.5 mb-[30px]">
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${activeTab === 'stock'
            ? 'bg-[#dc2626] text-white'
            : 'bg-white text-[#dc2626] border border-[#dc2626]'
            }`}
          onClick={() => setActiveTab('stock')}
        >
          Stock
        </button>
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${activeTab === 'donators'
            ? 'bg-[#dc2626] text-white'
            : 'bg-white text-[#dc2626] border border-[#dc2626]'
            }`}
          onClick={() => setActiveTab('donators')}
        >
          Donators
        </button>
        <button
          className={`py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 ${activeTab === 'forever-donators'
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
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading stock…</div>
          ) : (
            <>
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
                  {stock.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">No stock units found. Add a new unit to get started.</td>
                    </tr>
                  ) : (
                    stock.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f9fafb]">
                        <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{item.hospital_id}</td>
                        <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-bold">{item.blood_type}</td>
                        <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-semibold">{item.quantity}</td>
                        <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{item.date}</td>
                        <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                          <div className="flex gap-2">
                            <button
                              className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                              onClick={() => handleUpdateClick(item)}
                            >
                              Update
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="text-right mt-5 font-semibold text-[#111827]">Total = {totalUnits} Units</div>
            </>
          )}
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
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Status</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Preferred Date</th>
                <th className="p-[15px] text-left font-semibold text-[#111827] text-sm uppercase border-b-2 border-[#e5e7eb]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {donationRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-500">No donation requests</td>
                </tr>
              )}
              {donationRequests.map((request) => (
                <tr key={request.id} className="hover:bg-[#f9fafb]">
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.first_name} {request.last_name}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.email || '-'}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">{request.phone_num}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm font-bold">{request.blood_type}</td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${request.status === 'Completed' ? 'bg-green-100 text-green-600' :
                      request.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' :
                        request.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-[15px] border-b border-[#e5e7eb] text-[#111827] text-sm">
                    <div className="flex gap-2">
                      {request.status === 'Pending' && (
                        <button
                          className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                          onClick={() => handleScheduleRequest(request)}
                        >
                          Schedule
                        </button>
                      )}
                      {request.status === 'Scheduled' && (
                        <button
                          className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                          onClick={() => handleUpdateRequestStatus(request.id, 'Completed')}
                        >
                          Complete
                        </button>
                      )}
                      {request.status !== 'Completed' && (
                        <button
                          className="py-1.5 px-3 border-none rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                          onClick={() => handleUpdateRequestStatus(request.id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-5 font-semibold text-[#111827]">Showing {donationRequests.length} donation requests</div>
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
                  value={newStock.quantity || ''}
                  onChange={e => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0
                    setNewStock(ns => ({ ...ns, quantity: val }))
                  }}
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
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                <select
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm bg-white"
                  value={editStock.blood_type}
                  onChange={e => setEditStock({ ...editStock, blood_type: e.target.value })}
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
                  value={editStock.quantity || ''}
                  onChange={e => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0
                    setEditStock({ ...editStock, quantity: val })
                  }}
                  min="1"
                />
              </div>
              <div className="mb-5">
                <label className="block mb-2 font-semibold text-[#111827] text-sm">Date:</label>
                <input
                  type="date"
                  className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                  value={editStock.date}
                  onChange={e => setEditStock({ ...editStock, date: e.target.value })}
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

      {showScheduleModal && (selectedRequest || selectedDonator) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" onClick={() => {
          setShowScheduleModal(false)
          setSelectedRequest(null)
          setSelectedDonator(null)
        }}>
          <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-[#111827]">
                {selectedRequest ? 'Schedule Donation Request' : selectedDonator?.isForever ? 'Request from Forever Donator' : 'Schedule Donation'}
              </h2>
              <button
                className="bg-none border-none text-2xl cursor-pointer text-[#6b7280]"
                onClick={() => {
                  setShowScheduleModal(false)
                  setSelectedRequest(null)
                  setSelectedDonator(null)
                }}
              >
                ×
              </button>
            </div>
            <div>
              {selectedRequest ? (
                <>
                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#111827] text-sm">Donator:</label>
                    <input
                      type="text"
                      className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626] bg-gray-50"
                      value={`${selectedRequest.first_name} ${selectedRequest.last_name}`}
                      readOnly
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                    <input
                      type="text"
                      className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626] bg-gray-50"
                      value={selectedRequest.blood_type}
                      readOnly
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#111827] text-sm">Schedule Date:</label>
                    <input
                      type="date"
                      className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626]"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2.5 justify-end">
                    <button
                      className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-white text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb]"
                      onClick={() => {
                        setShowScheduleModal(false)
                        setSelectedRequest(null)
                        setScheduleDate('')
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                      onClick={handleSaveSchedule}
                    >
                      Schedule
                    </button>
                  </div>
                </>
              ) : selectedDonator ? (
                <>
                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#111827] text-sm">Donator:</label>
                    <input
                      type="text"
                      className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626] bg-gray-50"
                      value={selectedDonator.name}
                      readOnly
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block mb-2 font-semibold text-[#111827] text-sm">Blood Type:</label>
                    <input
                      type="text"
                      className="w-full py-2.5 px-[15px] border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#dc2626] bg-gray-50"
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
                    <button className="py-2.5 px-5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 bg-[#dc2626] text-white hover:bg-[#b91c1c]">
                      {selectedDonator.isForever ? 'Send Request' : 'Schedule'}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}

