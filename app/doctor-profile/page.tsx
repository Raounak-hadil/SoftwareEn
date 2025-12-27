'use client';

import { useMemo, useState, useEffect, type ChangeEvent, type FormEvent, type JSX, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import DoctorNavbar from '@/components/ui/DoctorNavbar';
import { Footer } from '@/components/ui/Footer';

type RequestHistory = {
  id: string;
  date: string;
  status: 'READY' | 'PROCESSING' | 'COMPLETED' | 'APPROVED';
};

type RequestRow = {
  requestNo: string;
  bloodGroup: string;
  quantity: string;
  status: 'READY' | 'PROCESSING' | 'COMPLETED' | string;
  schedule: string;
};

type RequestForm = {
  email: string;
  urgency: string;
  bloodGroup: string;
  quantity: string;
  dateOfDelivery: string;
  doctorId?: string;
};

const DoctorProfilePage = (): JSX.Element => {
  const router = useRouter();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditBio, setShowEditBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [bioMessage, setBioMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);
  const [requests, setRequests] = useState<RequestRow[]>([]);

  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    phone_num: '',
    speciality: ''
  });
  const [profileMessage, setProfileMessage] = useState('');

  const [formState, setFormState] = useState<RequestForm>({
    email: '',
    urgency: '',
    bloodGroup: '',
    quantity: '',
    dateOfDelivery: '',
  });
  const [requestMessage, setRequestMessage] = useState('');

  const [historyItems, setHistoryItems] = useState<RequestHistory[]>([]);

  const visibleHistory = useMemo(() => (showAllHistory ? historyItems : historyItems.slice(0, 9)), [showAllHistory, historyItems]);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // 1. Fetch Doctor Profile
      const profileResponse = await fetch('/api/ProfileDoc', { headers });

      if (profileResponse.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      const profileData = await profileResponse.json();
      console.log("API doctor response:", profileData);

      if (profileData.success && profileData.doctor) {
        setDoctorData(profileData.doctor);
        setFormState(prev => ({
          ...prev,
          email: profileData.doctor.email || prev.email
        }));
      } else {
        console.error('Failed to fetch profile:', profileData.error);
      }

      // 2. Fetch Requests from DoctorReq endpoint
      const requestsResponse = await fetch('/api/DoctorReq', { headers });
      const requestsData = await requestsResponse.json();
      console.log("API DoctorReq response:", requestsData);

      if (requestsData.data) {
        // Map all requests for the table
        const mappedRequests: RequestRow[] = requestsData.data.map((n: any): RequestRow => ({
          requestNo: n.id?.toString() || 'N/A',
          bloodGroup: n.blood_type || 'N/A',
          quantity: n.quantity ? `${n.quantity} ML` : '', // Append ML if not present
          status: n.status || 'PENDING',
          schedule: n.request_date ? new Date(n.request_date).toLocaleDateString() : 'N/A'
        }));
        setRequests(mappedRequests);

        // Filter requests for history - Now using 'Approved' as per user request
        const completedRequests: RequestHistory[] = requestsData.data
          .filter((n: any) => n.status === 'Approved')
          .map((n: any): RequestHistory => ({
            id: n.id?.toString() || 'N/A',
            date: n.request_date ? new Date(n.request_date).toLocaleDateString() : 'N/A',
            status: 'APPROVED'
          }));
        setHistoryItems(completedRequests);
      } else {
        setRequests([]);
        setHistoryItems([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (field: keyof RequestForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const payload = {
        email: formState.email,
        quantity: formState.quantity,
        urgency: formState.urgency,
        blood_type: formState.bloodGroup,
        status: 'Waiting',
        seen: false,
        Hospital_id: doctorData?.Hospital_id
      };

      const response = await fetch('/api/DoctorSendReq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setRequestMessage('Request submitted successfully.');
        setFormState(prev => ({
          ...prev,
          urgency: '',
          bloodGroup: '',
          quantity: '',
          dateOfDelivery: ''
        }));
        await fetchData();
        setTimeout(() => setRequestMessage(''), 3000);
      } else {
        setRequestMessage(`Error: ${result.error || 'Failed to submit'}`);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      setRequestMessage('An unexpected error occurred.');
    }
  };

  const handleBioEdit = () => {
    setEditedBio(doctorData?.Description || '');
    setShowEditBio(true);
    setBioMessage('');
  };

  const handleBioSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/EditDesc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description: editedBio })
      });

      const result = await response.json();

      if (response.ok) {
        setBioMessage('Biography updated successfully!');
        setDoctorData({ ...doctorData, Description: editedBio });
        setTimeout(() => {
          setShowEditBio(false);
          setBioMessage('');
        }, 2000);
      } else {
        setBioMessage(`Error: ${result.error || 'Failed to update'}`);
      }
    } catch (error) {
      console.error('Error updating biography:', error);
      setBioMessage('An unexpected error occurred.');
    }
  };

  const handleProfileEdit = () => {
    setProfileForm({
      first_name: doctorData?.first_name || '',
      last_name: doctorData?.last_name || '',
      phone_num: doctorData?.phone_num || '',
      speciality: doctorData?.speciality || ''
    });
    setShowEditProfile(true);
    setProfileMessage('');
  };

  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/EditDocInfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...profileForm,
          email: doctorData?.email
        })
      });

      const result = await response.json();

      if (response.ok) {
        setProfileMessage('Profile updated successfully!');
        // Update local state with new data
        setDoctorData({ ...doctorData, ...profileForm });
        setTimeout(() => {
          setShowEditProfile(false);
          setProfileMessage('');
        }, 2000);
      } else {
        setProfileMessage(`Error: ${result.error || 'Failed to update'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileMessage('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#C50000]">Loading profile...</div>;
  }

  const displayName = doctorData
    ? `${doctorData.first_name || ''} ${doctorData.last_name || ''}`.trim()
    : 'Doctor Name';
  const displaySpecialty = doctorData?.speciality || 'General Practitioner';
  const displayEmail = doctorData?.email || 'email@example.com';
  const displayPhone = doctorData?.phone_num || '+213 ...';

  return (
    <>
      <DoctorNavbar />
      <main className='pt-16 w-full bg-white'>
        <div className='w-full px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16 py-10 space-y-8 max-w-screen-2xl mx-auto'>
          {/* Profile pill */}
          <section className='border border-gray-300 rounded-[28px] shadow-sm overflow-hidden' id='profile'>
            <div className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 py-4 bg-white relative'>
              <div className='relative'>
                <img
                  src='/images/doctor_profile.png'
                  alt='Doctor'
                  className='w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-white shadow-md'
                />
              </div>
              <div className='flex-1 text-center sm:text-left'>
                <p className='text-base sm:text-lg font-semibold text-gray-900'>{displayName}</p>
                <p className='text-sm text-gray-600'>{displaySpecialty}</p>
                <p className='text-xs text-gray-600'>{displayEmail}</p>
                <p className='text-xs text-gray-600'>{displayPhone}</p>
              </div>
              <button
                type='button'
                className='absolute top-4 right-4 text-gray-600 hover:text-gray-900'
                aria-label='Edit profile card'
                onClick={handleProfileEdit}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                </svg>
              </button>
            </div>
          </section>

          {/* Main grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Left column */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Biography */}
              <section className='bg-white border border-gray-200 rounded-xl shadow-sm p-5' id='biography'>
                <div className='flex items-center justify-between mb-3'>
                  <h2 className='text-lg font-bold text-gray-900'>My biography</h2>
                  <button type='button' className='text-gray-600 hover:text-gray-900' aria-label='Edit biography' onClick={handleBioEdit}>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                    </svg>
                  </button>
                </div>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  {doctorData?.Description || "No biography available."}
                </p>
              </section>

              {/* Request form */}
              <section className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4' id='requests'>
                <h3 className='text-base font-semibold text-gray-900'>Request Details</h3>
                <form onSubmit={handleSubmit} className='space-y-3'>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Hospital</label>
                    <input
                      type='text'
                      value={doctorData?.hospitals?.hosname || 'Not Assigned'}
                      readOnly
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none bg-gray-100 text-gray-500 cursor-not-allowed'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Email</label>
                    <input
                      type='text'
                      value={formState.email}
                      readOnly
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none bg-gray-100 text-gray-500 cursor-not-allowed'
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Urgency</label>
                    <select
                      value={formState.urgency}
                      onChange={handleInputChange('urgency')}
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    >
                      <option value=''>Select urgency level</option>
                      <option value='low'>Low</option>
                      <option value='medium'>Medium</option>
                      <option value='important'>Important</option>
                      <option value='critical'>Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Blood Group</label>
                    <select
                      value={formState.bloodGroup}
                      onChange={handleInputChange('bloodGroup')}
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    >
                      <option value=''>Select blood type</option>
                      <option value='A+'>A+</option>
                      <option value='A-'>A-</option>
                      <option value='B+'>B+</option>
                      <option value='B-'>B-</option>
                      <option value='AB+'>AB+</option>
                      <option value='AB-'>AB-</option>
                      <option value='O+'>O+</option>
                      <option value='O-'>O-</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Quantity (ML)</label>
                    <input
                      type='number'
                      value={formState.quantity}
                      onChange={handleInputChange('quantity')}
                      min='1'
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Date of Delivery</label>
                    <input
                      type='date'
                      value={formState.dateOfDelivery}
                      onChange={handleInputChange('dateOfDelivery')}
                      min={new Date().toISOString().split('T')[0]}
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    />
                  </div>
                  <div className='pt-2 flex flex-col items-center gap-2'>
                    <button
                      type='submit'
                      className='px-10 py-2 bg-[#C50000] text-white rounded-sm text-sm font-semibold shadow-sm hover:bg-[#a40000] transition'
                    >
                      Request
                    </button>
                    {requestMessage && (
                      <p className={`text-xs ${requestMessage.startsWith('Error') ? 'text-red-700' : 'text-green-700'}`}>
                        {requestMessage}
                      </p>
                    )}
                  </div>
                </form>
              </section>
            </div>

            {/* Right column */}
            <div className='space-y-4'>
              <section className='bg-white border border-gray-200 rounded-xl shadow-sm p-4'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-base font-semibold text-gray-900'>Request history</h3>
                  <button
                    type='button'
                    className='text-xs text-gray-600 hover:text-gray-900'
                    onClick={() => setShowAllHistory((prev) => !prev)}
                  >
                    {showAllHistory ? 'see less' : 'see more >'}
                  </button>
                </div>
                <div className='space-y-2'>
                  {historyItems.length > 0 ? (
                    visibleHistory.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className='flex items-center justify-between text-xs py-1'>
                        <div className='text-gray-800'>{item.id}</div>
                        <div className='text-gray-600'>{item.date}</div>
                        <div className='text-gray-900 font-semibold'>{item.status}</div>
                      </div>
                    ))
                  ) : (
                    <p className='text-xs text-gray-500 text-center py-2'>No completed requests yet.</p>
                  )}
                </div>
              </section>

              <section className='bg-white border border-gray-200 rounded-xl shadow-sm p-4 space-y-3 text-xs text-gray-700'>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-600'>📍</span>
                  <span>{doctorData?.address || "City Hospital, Algiers, Algeria"}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-600'>in</span>
                  <span>{doctorData?.linkedin || "Linkedin.Com/Dr-Raounak"}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-blue-600'>f</span>
                  <span>{doctorData?.facebook || "Facebook.Com/Dr.Raounak"}</span>
                </div>
                <div className='pt-2'>
                  <button
                    type='button'
                    className='text-[#C50000] font-semibold text-xs hover:underline'
                    onClick={handleProfileEdit}
                  >
                    Edit Profile +
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* All Request table */}
          <section className='bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden' id='notifications'>
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200'>
              <h2 className='text-base sm:text-lg font-semibold text-gray-900'>All Request</h2>
              <button
                type='button'
                className='text-gray-600 hover:text-gray-900 text-xl leading-none'
                aria-label='Collapse'
              >
                ˄
              </button>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-xs sm:text-sm border-collapse'>
                <thead className='bg-[#C50000] text-white'>
                  <tr>
                    {['Request No.', 'Blood group', 'Quantity', 'Status', 'Schedule'].map((header) => (
                      <th key={header} className='px-3 py-3 text-left font-semibold'>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.length > 0 ? (
                    requests.map((row, idx) => (
                      <tr key={`${row.requestNo}-${idx}`} className='border-b border-gray-200'>
                        <td className='px-3 py-2 text-gray-800'>{row.requestNo}</td>
                        <td className='px-3 py-2 text-gray-800'>{row.bloodGroup}</td>
                        <td className='px-3 py-2 text-gray-800'>{row.quantity}</td>
                        <td className='px-3 py-2'>
                          <span
                            className={`font-semibold ${row.status === 'READY' || row.status === 'Approved'
                              ? 'text-green-600'
                              : row.status === 'PROCESSING'
                                ? 'text-blue-600'
                                : row.status === 'COMPLETED'
                                  ? 'text-gray-900'
                                  : 'text-amber-600'
                              }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className='px-3 py-2 text-gray-800'>{row.schedule}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                        No requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Profile modal */}
      {showEditProfile && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>Edit Profile</h3>
              <button
                type='button'
                onClick={() => setShowEditProfile(false)}
                className='p-2 text-gray-600 hover:text-gray-900'
                aria-label='Close edit profile'
              >
                ×
              </button>
            </div>
            <div className='space-y-3 text-sm'>
              <div>
                <label className='block text-xs text-gray-600 mb-1'>First Name</label>
                <input
                  type='text'
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  placeholder="First Name"
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
                />
              </div>
              <div>
                <label className='block text-xs text-gray-600 mb-1'>Last Name</label>
                <input
                  type='text'
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  placeholder="Last Name"
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
                />
              </div>
              <div>
                <label className='block text-xs text-gray-600 mb-1'>Specialty</label>
                <input
                  type='text'
                  value={profileForm.speciality}
                  onChange={(e) => setProfileForm({ ...profileForm, speciality: e.target.value })}
                  placeholder="Specialty"
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
                />
              </div>
              <div>
                <label className='block text-xs text-gray-600 mb-1'>Phone Number</label>
                <input
                  type='tel'
                  value={profileForm.phone_num}
                  onChange={(e) => setProfileForm({ ...profileForm, phone_num: e.target.value })}
                  placeholder="Phone"
                  className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
                />
              </div>
            </div>
            {profileMessage && (
              <p className={`text-sm ${profileMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {profileMessage}
              </p>
            )}
            <div className='flex justify-end gap-3 pt-2'>
              <button
                type='button'
                onClick={() => setShowEditProfile(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleProfileSave}
                className='px-4 py-2 bg-[#C50000] text-white rounded-lg hover:bg-[#a40000]'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Biography modal */}
      {showEditBio && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>Edit Biography</h3>
              <button
                type='button'
                onClick={() => setShowEditBio(false)}
                className='p-2 text-gray-600 hover:text-gray-900'
                aria-label='Close edit biography'
              >
                ×
              </button>
            </div>
            <div>
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Write your biography here..."
                rows={8}
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000] text-sm resize-none'
              />
            </div>
            {bioMessage && (
              <p className={`text-sm ${bioMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {bioMessage}
              </p>
            )}
            <div className='flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => setShowEditBio(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleBioSave}
                className='px-4 py-2 bg-[#C50000] text-white rounded-lg hover:bg-[#a40000]'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DoctorProfilePage;
