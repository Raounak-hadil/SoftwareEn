'use client';

import { useMemo, useState, useEffect, type ChangeEvent, type FormEvent, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import DoctorNavbar from '@/components/ui/DoctorNavbar';
import { Footer } from '@/components/ui/Footer';
import { date } from 'zod';

type RequestHistory = {
  id: string;
  date: string;
  status: 'READY' | 'PROCESSING' | 'COMPLETED';
};

type RequestRow = {
  requestNo: string;
  bloodGroup: string;
  quantity: string;
  status: 'READY' | 'PENDING' | 'PREPARING' | 'RECEIVED';
  schedule: string;
};

type RequestForm = {
  doctorName: string;
  urgency: string;
  bloodGroup: string;
  quantity: string;
  dateOfDelivery: string;
  // Hidden fields we might need
  doctorId?: string;
};

const REQUEST_TABLE: RequestRow[] = [
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'READY', schedule: '01/10/2025' },
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'PENDING', schedule: '02/10/2025' },
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'PREPARING', schedule: '02/10/2025' },
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'RECEIVED', schedule: '30/09/2025' },
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'RECEIVED', schedule: '30/09/2025' },
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'RECEIVED', schedule: '30/09/2025' },
  { requestNo: '798445441/32', bloodGroup: 'B+', quantity: '150 ML', status: 'RECEIVED', schedule: '30/09/2025' },
];

const DoctorProfilePage = (): JSX.Element => {
  const router = useRouter();
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState<any>(null);

  const [formState, setFormState] = useState<RequestForm>({
    doctorName: '',
    urgency: '',
    bloodGroup: '',
    quantity: '',
    dateOfDelivery: '',
  });
  const [requestMessage, setRequestMessage] = useState('');

  // Use dummy history for now if API doesn't provide history in the same format
  const [historyItems, setHistoryItems] = useState<RequestHistory[]>([
    { id: '798445441/32', date: '01/10/2025', status: 'READY' },
    { id: '798445441/32', date: '28/09/2025', status: 'READY' },
    { id: '798445441/32', date: '15/09/2025', status: 'READY' },
    { id: '798445441/32', date: '01/09/2025', status: 'READY' },
    { id: '798445441/32', date: '20/08/2025', status: 'READY' },
    { id: '798445441/32', date: '10/08/2025', status: 'READY' },
    { id: '798445441/32', date: '01/08/2025', status: 'READY' },
    { id: '798445441/32', date: '25/07/2025', status: 'READY' },
    { id: '798445441/32', date: '15/07/2025', status: 'READY' },
    { id: '798445441/32', date: '01/07/2025', status: 'READY' },
  ]);

  const visibleHistory = useMemo(() => (showAllHistory ? historyItems : historyItems.slice(0, 9)), [showAllHistory, historyItems]);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        const response = await fetch('/api/ProfileDoc', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        const data = await response.json();
        console.log("API doctor response:", data);

        if (data.success && data.doctor) {
          setDoctorData(data.doctor);
          // Pre-fill doctor name in form if available
          setFormState(prev => ({
            ...prev,
            doctorName: data.doctor.name || data.doctor.full_name || prev.doctorName
          }));
        } else {
          console.error('Failed to fetch profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [router]);

  const handleInputChange = (field: keyof RequestForm) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setRequestMessage('Request submitted.');
    setTimeout(() => setRequestMessage(''), 2000);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#C50000]">Loading profile...</div>;
  }

  // Fallback values if API data is missing certain fields
  const displayName = doctorData 
  ? `${doctorData.first_name || ''} ${doctorData.last_name || ''}`.trim()
  : 'Doctor Name';
  const displaySpecialty = doctorData?.speciality || 'General Practitioner';
  const displayEmail = doctorData?.email || 'email@example.com';
  const displayPhone = doctorData?.phone_num || '+213 ...';


  console.log("doctorData:", doctorData);
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
                onClick={() => setShowEditProfile(true)}
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
                  <button type='button' className='text-gray-600 hover:text-gray-900' aria-label='Edit biography'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                    </svg>
                  </button>
                </div>
                <p className='text-sm text-gray-700 leading-relaxed'>
                  {doctorData?.bio || "My expertise lies in Transfusion Medicine, where for two decades I've dedicated myself to securing a safe and robust blood supply. I focus on perfecting donor screening and operational practices to ensure patients always receive the life-saving blood they need."}
                </p>
              </section>

              {/* Request details form */}
              <section className='bg-white border border-gray-200 rounded-xl shadow-sm p-5 space-y-4' id='requests'>
                <h3 className='text-base font-semibold text-gray-900'>Request Details</h3>
                <form onSubmit={handleSubmit} className='space-y-3'>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Doctor Name</label>
                    <input
                      type='text'
                      value={formState.doctorName}
                      onChange={handleInputChange('doctorName')}
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Urgency</label>
                    <input
                      type='text'
                      value={formState.urgency}
                      onChange={handleInputChange('urgency')}
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Blood Group</label>
                    <input
                      type='text'
                      value={formState.bloodGroup}
                      onChange={handleInputChange('bloodGroup')}
                      className='w-full h-9 border border-gray-300 rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C50000]'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-xs text-gray-600 mb-1'>Quantity</label>
                    <input
                      type='text'
                      value={formState.quantity}
                      onChange={handleInputChange('quantity')}
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
                    {requestMessage && <p className='text-xs text-green-700'>{requestMessage}</p>}
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
                  {visibleHistory.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className='flex items-center justify-between text-xs py-1'>
                      <div className='text-gray-800'>{item.id}</div>
                      <div className='text-gray-600'>{item.date}</div>
                      <div className='text-[#00a84f] font-semibold'>{item.status}</div>
                    </div>
                  ))}
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
                    onClick={() => setShowEditProfile(true)}
                  >
                    Edit Profile +
                  </button>
                </div>
              </section>
            </div>
          </div>

          {/* All Request table (notifications view) at end */}
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
                  {REQUEST_TABLE.map((row, idx) => (
                    <tr key={`${row.requestNo}-${idx}`} className='border-b border-gray-200'>
                      <td className='px-3 py-2 text-gray-800'>{row.requestNo}</td>
                      <td className='px-3 py-2 text-gray-800'>{row.bloodGroup}</td>
                      <td className='px-3 py-2 text-gray-800'>{row.quantity}</td>
                      <td className='px-3 py-2'>
                        <span
                          className={`font-semibold ${row.status === 'READY'
                              ? 'text-green-600'
                              : row.status === 'PENDING'
                                ? 'text-amber-600'
                                : row.status === 'PREPARING'
                                  ? 'text-blue-600'
                                  : 'text-gray-900'
                            }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className='px-3 py-2 text-gray-800'>{row.schedule}</td>
                    </tr>
                  ))}
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
              <input
                type='text'
                defaultValue={displayName}
                placeholder="Name"
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
              />
              <input
                type='text'
                defaultValue={displaySpecialty}
                placeholder="Specialty"
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
              />
              <input
                type='email'
                defaultValue={displayEmail}
                placeholder="Email"
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
              />
              <input
                type='tel'
                defaultValue={displayPhone}
                placeholder="Phone"
                className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C50000]'
              />
            </div>
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
                onClick={() => setShowEditProfile(false)}
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

