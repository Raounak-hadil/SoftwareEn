'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import AdminNavbar from '@/components/ui/AdminNavbar';

type Hospital = {
  id: string;
  name: string;
  address: string;
  type: 'Public' | 'Private';
  apiId?: string | number;
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

const INITIAL_HOSPITALS: Hospital[] = [];

const INITIAL_STOCK: StockUnit[] = [

];

const INITIAL_DOCTORS: Doctor[] = [];

const AdminHospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  console.log('selectedHospital:', selectedHospital);
  const [activeTab, setActiveTab] = useState<'stock' | 'doctors'>('stock');
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [showAddHospitalForm, setShowAddHospitalForm] = useState(false);
  const [showAddUnitForm, setShowAddUnitForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', image: '' });
  const [newHospital, setNewHospital] = useState({ name: '', address: '', type: 'Public' as Hospital['type'] });
  const [newUnit, setNewUnit] = useState({ type: '', description: '', quantity: '', requests: '' });

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState<boolean>(true);
  const [loadingStockData, setLoadingStockData] = useState<boolean>(false);
  const [stockData, setStockData] = useState<StockUnit[]>(INITIAL_STOCK);
  const [rawApiStock, setRawApiStock] = useState<any[] | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [loadingDoctors, setLoadingDoctors] = useState<boolean>(false);
  const [confirmDeleteHospital, setConfirmDeleteHospital] = useState<Hospital | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchHospitals = async () => {
      setLoadingHospitals(true);
      try {
        const res = await fetch('/api/hospitals_list');
        if (!res.ok) {
          console.warn('Failed to fetch hospitals:', res.status);
          setHospitals(INITIAL_HOSPITALS);
          return;
        }
        const json = await res.json();
        const data = Array.isArray(json?.hospitals) ? json.hospitals : [];
        const mapped: Hospital[] = data.map((h: any) => ({
          id: String(h.id || ''),
          name: h.hosname || h.name || 'Unknown Hospital',
          address: h.address || '',
          type: (h.type === 'Private' || h.type === 'private') ? 'Private' : 'Public',
          apiId: h.id
        }));
        setHospitals(mapped.length ? mapped : INITIAL_HOSPITALS);
      } catch (err) {
        console.error('Error fetching hospitals:', err);
        setHospitals(INITIAL_HOSPITALS);
      } finally {
        setLoadingHospitals(false);
      }
    };

    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchStockForHospital = async () => {
      setLoadingStockData(true);
      try {
        const hospitalIdentifier = selectedHospital.apiId ?? selectedHospital.id;
        console.debug('fetching byHospital for', { selectedHospitalId: selectedHospital.id, hospitalIdentifier });
        const res = await fetch(`/api/hospital/stock/byHospital?hospital_id=${encodeURIComponent(String(hospitalIdentifier))}`);
        if (!res.ok) {
          console.warn('Failed to fetch hospital stock for', selectedHospital.id, res.status);
          setStockData(INITIAL_STOCK);
          return;
        }
        const json = await res.json();
        if (json?.success === false) {
          console.warn('API returned error for hospital stock:', json.error);
          setStockData(INITIAL_STOCK);
          return;
        }
        const apiStock = Array.isArray(json?.stock) ? json.stock : [];
        console.debug('byHospital apiStock length', apiStock.length, apiStock);
        const mapped = apiStock.map((s: any) => {
          const quantity = Number(s.quantity ?? 0);
          const requests = Number(s.requests ?? 0);
          // Only show 'difference' if requests data is actually available, otherwise just quantity
          const difference = quantity - requests;

          return {
            type: String(s.blood_type ?? s.type ?? 'OB'),
            description: s.description || '',
            quantity,
            requests,
            difference,
          };
        });
        setStockData(mapped.length ? mapped : []); // Clear if empty
        setRawApiStock(null); // No debug needed
      } catch (err) {
        console.error('Error fetching hospital stock by id:', err);
        setStockData(INITIAL_STOCK);
      } finally {
        setLoadingStockData(false);
      }
    };

    fetchStockForHospital();
  }, [selectedHospital]);

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchDoctorsForHospital = async () => {
      setLoadingDoctors(true);
      try {
        const hospitalIdentifier = selectedHospital.apiId ?? selectedHospital.id;
        const res = await fetch(`/api/hospital/doctors/myDoctors?hospital_id=${encodeURIComponent(String(hospitalIdentifier))}`);
        if (!res.ok) {
          console.warn('Failed to fetch hospital doctors for', selectedHospital.id, res.status);
          setDoctors(INITIAL_DOCTORS);
          return;
        }
        const json = await res.json();
        if (json?.success === false) {
          console.warn('API returned error for hospital doctors:', json.error);
          setDoctors(INITIAL_DOCTORS);
          return;
        }
        const apiDoctors = Array.isArray(json?.doctors) ? json.doctors : [];
        const mapped: Doctor[] = apiDoctors.map((d: any) => ({
          id: d.id,
          name: `${d.first_name} ${d.last_name}`,
          email: d.email,
          image: null // API doesn't return image currently
        }));
        setDoctors(mapped);
      } catch (err) {
        console.error('Error fetching hospital doctors by id:', err);
        setDoctors(INITIAL_DOCTORS);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctorsForHospital();
  }, [selectedHospital]);

  useEffect(() => {
    console.debug('stockData state changed', stockData);
  }, [stockData]);


  const handleConfirmDelete = async () => {
    if (!confirmDeleteHospital) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/DeleteHosp', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmDeleteHospital.id }),
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('DeleteHosp failed', json);
        alert('Failed to delete hospital');
        return;
      }
      // remove from local state
      setHospitals((prev) => prev.filter((h) => h.id !== confirmDeleteHospital.id));
      setConfirmDeleteHospital(null);
    } catch (err) {
      console.error('Error deleting hospital:', err);
      alert('Error deleting hospital');
    } finally {
      setDeleting(false);
    }
  };

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
                className={`px-2 py-1 text-xs font-semibold rounded-full ${hospital.type === 'Public' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
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
                Discover
              </button>
              <button
                type='button'
                onClick={() => setConfirmDeleteHospital(hospital)}
                className='flex-1 px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors'
              >
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
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${hospital.type === 'Public' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
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
                      Discover
                    </button>
                    <button
                      type='button'
                      onClick={() => setConfirmDeleteHospital(hospital)}
                      className='px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors'
                    >
                      Delete
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
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        {/* Mobile Card View */}
        <div className='block md:hidden divide-y divide-gray-200'>
          {stockData.length === 0 && !loadingStockData ? (
            <div className='p-8 text-center text-gray-500'>No stock found for this hospital.</div>
          ) : stockData.map((unit, index) => (
            <div key={`${unit.type}-${index}`} className='p-4 bg-white hover:bg-gray-50'>
              <div className='flex justify-between items-start mb-2'>
                <span className='text-sm font-semibold text-gray-900'>{unit.type}</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${unit.difference < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
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
                    className={`px-4 lg:px-6 py-4 text-sm font-semibold ${unit.difference < 0 ? 'text-red-600' : 'text-green-600'
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
        {loadingDoctors ? (
          <div className='col-span-full py-12 text-center text-gray-500'>Loading doctors...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className='col-span-full py-12 text-center text-gray-500'>No doctors found. Try a different search term.</div>
        ) : (
          filteredDoctors.map((doctor) => (
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
          ))
        )}
      </div>

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
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-[#C50000] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'stock' ? renderStockTab() : renderDoctorsTab()}

            {/* Modals */}
            {/* Add New Unit form removed per request */}

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
            </div>

            {loadingHospitals ? (
              <div className='p-6 text-center text-gray-500'>Loading hospitals…</div>
            ) : (
              renderHospitalsTable()
            )}

            {confirmDeleteHospital && (
              <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]' onClick={() => setConfirmDeleteHospital(null)}>
                <div className='bg-white rounded-lg p-6 w-full max-w-md' onClick={(e) => e.stopPropagation()}>
                  <h3 className='text-lg font-semibold mb-4'>Confirm Delete</h3>
                  <p className='text-sm text-gray-600 mb-4'>Are you sure you want to delete <strong>{confirmDeleteHospital.name}</strong>? This action cannot be undone.</p>
                  <div className='flex gap-2 justify-end'>
                    <button className='px-4 py-2 border rounded text-sm' onClick={() => setConfirmDeleteHospital(null)} disabled={deleting}>Cancel</button>
                    <button className='px-4 py-2 bg-red-600 text-white rounded text-sm' onClick={handleConfirmDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Hospital feature removed per request */}
          </div>
        )}
      </main>
    </>
  );
};

export default AdminHospitals;

