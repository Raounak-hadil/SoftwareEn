'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import AdminNavbar from '@/components/ui/AdminNavbar';

type Hospital = {
  id: string;
  name: string;
  address: string;
  type: 'Public' | 'Private';
};

type StockUnit = {
  type: string;
  description: string;
  quantity: number;
  requests: number;
  difference: number;
};

type Doctor = {
  id: number;
  name: string;
  email: string;
  image?: string | null;
};

const INITIAL_HOSPITALS: Hospital[] = [
  { id: '00001', name: 'CHU Mustapha', address: '089 Kutch Green Apt. 448', type: 'Public' },
  { id: '00002', name: 'CHU Mustapha', address: '979 Immanuel Perry Suite 526', type: 'Private' },
  { id: '00003', name: 'CHU Mustapha', address: '123 Main Street', type: 'Public' },
  { id: '00004', name: 'CHU Mustapha', address: '456 Oak Avenue', type: 'Private' },
];

const INITIAL_STOCK: StockUnit[] = [
  { type: 'O+', description: 'Children Toy', quantity: 2, requests: 5, difference: -3 },
  { type: 'O-', description: 'Makeup', quantity: 0, requests: 2, difference: -2 },
  { type: 'A+', description: 'Asus Laptop', quantity: 5, requests: 4, difference: 1 },
  { type: 'B-', description: 'Iphone X', quantity: 4, requests: 4, difference: 0 },
];

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Jason Price',
    email: 'jason.price@cityhospital.com',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Rosie Glover',
    email: 'rosie.glover@cityhospital.com',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80',
  },
];

const AdminHospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [activeTab, setActiveTab] = useState<'stock' | 'doctors'>('stock');
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [showAddHospitalForm, setShowAddHospitalForm] = useState(false);
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', image: '' });
  const [newHospital, setNewHospital] = useState({ name: '', address: '', type: 'Public' as Hospital['type'] });
  const [newUnit, setNewUnit] = useState({ type: '', description: '', quantity: '', requests: '' });

  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [stockData, setStockData] = useState<StockUnit[]>(INITIAL_STOCK);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);

  useEffect(() => {
    const handler = (event: Event): void => {
      const customEvent = event as CustomEvent<string>;
      setSearchQuery(customEvent.detail ?? '');
    };

    window.addEventListener('adminSearch', handler as EventListener);

    if (typeof window !== 'undefined') {
      const savedQuery = sessionStorage.getItem('adminSearchQuery');
      if (savedQuery) setSearchQuery(savedQuery);
    }

    return () => window.removeEventListener('adminSearch', handler as EventListener);
  }, []);

  const filteredHospitals = useMemo(() => {
    if (!searchQuery.trim()) return hospitals;
    const query = searchQuery.toLowerCase();
    return hospitals.filter((hospital) =>
      [hospital.name, hospital.address, hospital.type, hospital.id].some((field) => field.toLowerCase().includes(query)),
    );
  }, [hospitals, searchQuery]);

  const filteredDoctors = useMemo(() => {
    if (!doctorSearchQuery.trim()) return doctors;
    const query = doctorSearchQuery.toLowerCase();
    return doctors.filter((doctor) => doctor.name.toLowerCase().includes(query) || doctor.email.toLowerCase().includes(query));
  }, [doctorSearchQuery, doctors]);

  const handleAddDoctor = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!newDoctor.name || !newDoctor.email) return;
    setDoctors((prev) => [
      ...prev,
      { id: prev.length + 1, name: newDoctor.name, email: newDoctor.email, image: newDoctor.image || undefined },
    ]);
    setNewDoctor({ name: '', email: '', image: '' });
    setShowAddDoctorForm(false);
  };

  const handleAddHospital = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!newHospital.name || !newHospital.address) return;
    setHospitals((prev) => [
      ...prev,
      { id: String(prev.length + 1).padStart(5, '0'), name: newHospital.name, address: newHospital.address, type: newHospital.type },
    ]);
    setNewHospital({ name: '', address: '', type: 'Public' });
    setShowAddHospitalForm(false);
  };

  const handleAddUnit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!newUnit.type || !newUnit.quantity) return;
    const quantity = Number(newUnit.quantity) || 0;
    const requests = Number(newUnit.requests) || 0;
    setStockData((prev) => [
      ...prev,
      { type: newUnit.type, description: newUnit.description, quantity, requests, difference: quantity - requests },
    ]);
    setNewUnit({ type: '', description: '', quantity: '', requests: '' });
    setShowAddUnitForm(false);
  };

  const handleDoctorImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewDoctor((prev) => ({ ...prev, image: reader.result?.toString() ?? '' }));
    reader.readAsDataURL(file);
  };

  const renderHospitalsTable = () => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
      {/* Mobile Card View */}
      <div className='block md:hidden divide-y divide-gray-200'>
        {filteredHospitals.map((hospital) => (
          <div key={hospital.id} className='p-4 bg-white hover:bg-gray-50'>
            <div className='flex justify-between items-start mb-2'>
              <div className='flex-1'>
                <p className='text-sm font-semibold text-gray-900'>{hospital.name}</p>
                <p className='text-xs text-gray-500 mt-1'>ID: {hospital.id}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  hospital.type === 'Public' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                }`}
              >
                {hospital.type}
              </span>
            </div>
            <p className='text-xs text-gray-600 mb-3'>{hospital.address}</p>
            <div className='flex gap-2 flex-wrap'>
              <button
                type='button'
                onClick={() => setSelectedHospital(hospital)}
                className='flex-1 px-3 py-2 bg-[#C50000] text-white text-xs rounded hover:bg-[#A00000] transition-colors'
              >
                Modify
              </button>
              <button type='button' className='flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors'>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className='hidden md:block overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              {['ID', 'Name', 'Address', 'Type', 'Actions'].map((header) => (
                <th key={header} className='px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {filteredHospitals.map((hospital) => (
              <tr key={hospital.id} className='hover:bg-gray-50'>
                <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{hospital.id}</td>
                <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{hospital.name}</td>
                <td className='px-4 lg:px-6 py-4 text-sm text-gray-500'>{hospital.address}</td>
                <td className='px-4 lg:px-6 py-4 text-sm'>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      hospital.type === 'Public' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {hospital.type}
                  </span>
                </td>
                <td className='px-4 lg:px-6 py-4 text-sm'>
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => setSelectedHospital(hospital)}
                      className='px-3 py-1 bg-[#C50000] text-white text-xs rounded hover:bg-[#A00000] transition-colors'
                    >
                      Modify ?
                    </button>
                    <button type='button' className='px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors'>
                      Delete ?
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStockTab = () => (
    <>
      <div className='flex justify-end mb-4'>
        <button type='button' onClick={() => setShowAddUnitForm(true)} className='px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#C50000] text-white rounded-lg font-medium hover:bg-[#A00000] transition-colors'>
          Add New Unit
        </button>
      </div>
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        {/* Mobile Card View */}
        <div className='block md:hidden divide-y divide-gray-200'>
          {stockData.map((unit, index) => (
            <div key={`${unit.type}-${index}`} className='p-4 bg-white hover:bg-gray-50'>
              <div className='flex justify-between items-start mb-2'>
                <span className='text-sm font-semibold text-gray-900'>{unit.type}</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    unit.difference < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}
                >
                  {unit.difference >= 0 ? '+' : ''}
                  {unit.difference}
                </span>
              </div>
              <p className='text-xs text-gray-500 mb-2'>{unit.description}</p>
              <div className='flex justify-between text-xs text-gray-600'>
                <span>Quantity: <span className='text-gray-900 font-medium'>{unit.quantity}</span></span>
                <span>Requests: <span className='text-gray-900 font-medium'>{unit.requests}</span></span>
              </div>
            </div>
          ))}
          <div className='px-4 py-3 bg-gray-50 text-center text-sm font-medium text-gray-900'>
            Total = {stockData.reduce((sum, unit) => sum + unit.quantity, 0)} Units
          </div>
        </div>

        {/* Desktop Table View */}
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 text-xs font-semibold text-gray-500 uppercase'>
              <tr>
                {['Type', 'Description', 'Quantity', 'Requests', 'Difference'].map((header) => (
                  <th key={header} className='px-4 lg:px-6 py-3 text-left'>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {stockData.map((unit, index) => (
                <tr key={`${unit.type}-${index}`} className='hover:bg-gray-50'>
                  <td className='px-4 lg:px-6 py-4 text-sm font-medium text-gray-900'>{unit.type}</td>
                  <td className='px-4 lg:px-6 py-4 text-sm text-gray-500'>{unit.description}</td>
                  <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{unit.quantity}</td>
                  <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{unit.requests}</td>
                  <td
                    className={`px-4 lg:px-6 py-4 text-sm font-semibold ${
                      unit.difference < 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                  >
                    {unit.difference >= 0 ? '+' : ''}
                    {unit.difference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='hidden md:block px-4 lg:px-6 py-3 bg-gray-50 border-t border-gray-200 text-right text-sm font-medium text-gray-900'>
          Total = {stockData.reduce((sum, unit) => sum + unit.quantity, 0)} Units
        </div>
      </div>
    </>
  );

  const renderDoctorsTab = () => (
    <>
      <div className='flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex items-center gap-3 w-full md:w-2/3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm'>
          <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input
            type='text'
            value={doctorSearchQuery}
            onChange={(event) => setDoctorSearchQuery(event.target.value)}
            placeholder='Search doctors...'
            className='flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none'
          />
        </div>
        <button type='button' onClick={() => setShowAddDoctorForm(true)} className='px-4 py-2 bg-[#C50000] text-white rounded-lg font-medium hover:bg-[#A00000] transition-colors w-full md:w-auto'>
          Add New Hospital Doctor
        </button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
            <div className='h-48 w-full bg-gray-100'>
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.name} className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center'>
                  <svg className='w-14 h-14 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                </div>
              )}
            </div>
            <div className='p-6 text-center'>
              <h3 className='text-lg font-bold text-gray-900 mb-1'>{doctor.name}</h3>
              <p className='text-sm text-gray-600 mb-4'>{doctor.email}</p>
              <button className='w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredDoctors.length === 0 && <p className='text-center py-12 text-gray-500'>No doctors found. Try a different search term.</p>}
    </>
  );

  return (
    <>
      <AdminNavbar />
      <main className='pt-16 lg:ml-64 transition-all duration-300'>
        {selectedHospital ? (
          <div className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
              <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900'>{selectedHospital.name}</h1>
              <button type='button' onClick={() => setSelectedHospital(null)} className='text-sm sm:text-base text-[#C50000] hover:underline w-fit'>
                ← Back to Hospitals
              </button>
            </div>

              <div className='flex gap-2 sm:gap-4 mb-6 overflow-x-auto'>
              {(
                [
                  { id: 'stock', label: 'Stock' },
                  { id: 'doctors', label: 'Hospital Doctors' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-[#C50000] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'stock' ? renderStockTab() : renderDoctorsTab()}

            {/* Modals */}
            {showAddUnitForm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto'>
                <div className='bg-white rounded-lg max-w-md w-full my-4 max-h-[90vh] overflow-y-auto'>
                  <div className='p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>Add New Unit</h2>
                    <button type='button' onClick={() => setShowAddUnitForm(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                      <svg className='w-5 h-5 sm:w-6 sm:h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleAddUnit} className='p-4 sm:p-6 space-y-4'>
                    <input type='text' value={newUnit.type} onChange={(e) => setNewUnit((prev) => ({ ...prev, type: e.target.value }))} placeholder='Blood type' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' required />
                    <input type='text' value={newUnit.description} onChange={(e) => setNewUnit((prev) => ({ ...prev, description: e.target.value }))} placeholder='Description' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' />
                    <input type='number' value={newUnit.quantity} onChange={(e) => setNewUnit((prev) => ({ ...prev, quantity: e.target.value }))} placeholder='Quantity' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' required />
                    <input type='number' value={newUnit.requests} onChange={(e) => setNewUnit((prev) => ({ ...prev, requests: e.target.value }))} placeholder='Number of requests' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' />
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4'>
                      <button type='submit' className='flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#C50000] text-white rounded-lg font-medium hover:bg-[#A00000] transition-colors'>
                        Add Unit
                      </button>
                      <button type='button' onClick={() => setShowAddUnitForm(false)} className='flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {showAddDoctorForm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto'>
                <div className='bg-white rounded-lg max-w-md w-full my-4 max-h-[90vh] overflow-y-auto'>
                  <div className='p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white'>
                    <h2 className='text-lg sm:text-2xl font-bold text-gray-900'>Add New Hospital Doctor</h2>
                    <button type='button' onClick={() => setShowAddDoctorForm(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                      <svg className='w-5 h-5 sm:w-6 sm:h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleAddDoctor} className='p-4 sm:p-6 space-y-4'>
                    <input type='text' value={newDoctor.name} onChange={(e) => setNewDoctor((prev) => ({ ...prev, name: e.target.value }))} placeholder='Doctor name' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' required />
                    <input type='email' value={newDoctor.email} onChange={(e) => setNewDoctor((prev) => ({ ...prev, email: e.target.value }))} placeholder='Email address' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' required />
                    <input type='file' accept='image/*' onChange={handleDoctorImageChange} className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' />
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4'>
                      <button type='submit' className='flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#C50000] text-white rounded-lg font-medium hover:bg-[#A00000] transition-colors'>
                        Add Hospital Doctor
                      </button>
                      <button type='button' onClick={() => setShowAddDoctorForm(false)} className='flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8'>
              <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>Hospitals</h1>
              <button type='button' onClick={() => setShowAddHospitalForm(true)} className='w-full sm:w-auto px-4 py-2 bg-[#C50000] text-white rounded-lg font-medium hover:bg-[#A00000] transition-colors text-sm sm:text-base'>
                Add New Hospital
              </button>
            </div>

            {renderHospitalsTable()}

            {showAddHospitalForm && (
              <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto'>
                <div className='bg-white rounded-lg max-w-md w-full my-4 max-h-[90vh] overflow-y-auto'>
                  <div className='p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white'>
                    <h2 className='text-xl sm:text-2xl font-bold text-gray-900'>Add New Hospital</h2>
                    <button type='button' onClick={() => setShowAddHospitalForm(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                      <svg className='w-5 h-5 sm:w-6 sm:h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleAddHospital} className='p-4 sm:p-6 space-y-4'>
                    <input type='text' value={newHospital.name} onChange={(e) => setNewHospital((prev) => ({ ...prev, name: e.target.value }))} placeholder='Hospital name' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' required />
                    <input type='text' value={newHospital.address} onChange={(e) => setNewHospital((prev) => ({ ...prev, address: e.target.value }))} placeholder='Address' className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]' required />
                    <select value={newHospital.type} onChange={(e) => setNewHospital((prev) => ({ ...prev, type: e.target.value as Hospital['type'] }))} className='w-full px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]'>
                      <option value='Public'>Public</option>
                      <option value='Private'>Private</option>
                    </select>
                    <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4'>
                      <button type='submit' className='flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-[#C50000] text-white rounded-lg font-medium hover:bg-[#A00000] transition-colors'>
                        Add Hospital
                      </button>
                      <button type='button' onClick={() => setShowAddHospitalForm(false)} className='flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default AdminHospitals;

