'use client';

import { useEffect, useMemo, useState } from 'react';

import AdminNavbar from '@/components/ui/AdminNavbar';

type RequestRow = {
  fromId: string;
  fromName: string;
  forId: string;
  forName: string;
  requestedBy: string;
  date: string;
  type: string;
  status: string;
};

const REQUESTS: RequestRow[] = [

];

const ITEMS_PER_PAGE = 10;

const AdminRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState<RequestRow[]>(REQUESTS);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  useEffect(() => {
    const handler = (event: Event): void => {
      const customEvent = event as CustomEvent<string>;
      setSearchQuery(customEvent.detail ?? '');
      setCurrentPage(1);
    };

    window.addEventListener('adminSearch', handler as EventListener);
    return () => window.removeEventListener('adminSearch', handler as EventListener);
  }, []);

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const query = searchQuery.toLowerCase();
    return requests.filter((request) =>
      [request.fromId, request.fromName, request.forId, request.forName, request.requestedBy, request.status].some((field) => field.toLowerCase().includes(query)),
    );
  }, [searchQuery, requests]);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      try {
        const res = await fetch('/api/HospitalReq');
        if (!res.ok) {
          console.warn('Failed to fetch hospital requests:', res.status);
          setRequests(REQUESTS);
          return;
        }
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        const mapped: RequestRow[] = data.map((r: any) => ({
          fromId: String(r.hospital_from_id ?? ''),
          fromName: r.hospital_from?.hosname || '—',
          forId: String(r.hospital_to_id ?? ''),
          forName: r.hospital_to?.hosname || '—',
          requestedBy: String(r.requested_by ?? r.requestedBy ?? r.created_by ?? '—'),
          date: r.date ? new Date(r.date).toLocaleDateString() : (r.created_at ? new Date(r.created_at).toLocaleDateString() : ''),
          type: String(r.blood_type ?? r.type ?? ''),
          status: String(r.status ?? 'Pending'),
        }));
        setRequests(mapped.length ? mapped : REQUESTS);
      } catch (err) {
        console.error('Error fetching HospitalReq:', err);
        setRequests(REQUESTS);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filteredRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <>
      <AdminNavbar />
      <main className='pt-16 lg:ml-64 transition-all duration-300'>
        <section className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-100'>
              <h1 className='text-2xl font-bold text-gray-900'>All Requests</h1>
              <input
                type='text'
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder='Search request'
                className='w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C50000]'
              />
            </div>
            {/* Mobile Card View */}
            <div className='block md:hidden divide-y divide-gray-200'>
              {pageItems.map((request, index) => (
                <div key={`${request.requestedBy}-${index}`} className='p-4 bg-white hover:bg-gray-50'>
                  <div className='flex justify-between items-start mb-2'>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900'>{request.fromName} (ID: {request.fromId})</p>
                      <p className='text-xs text-gray-500 mt-1'>{request.requestedBy}</p>
                    </div>
                    <span className='px-2 py-1 text-xs font-semibold text-[#C50000] bg-red-50 rounded-full'>{request.status}</span>
                  </div>
                  <div className='mt-3 space-y-1 text-xs text-gray-600'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>For:</span>
                      <span className='text-gray-900'>{request.forName} (ID: {request.forId})</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Date:</span>
                      <span className='text-gray-900'>{request.date}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>Type:</span>
                      <span className='text-gray-900'>{request.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='w-full min-w-[720px]'>
                <thead>
                  <tr className='bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                    {['ID From', 'Hospital From', 'ID To', 'Hospital To', 'Date', 'Type', 'Status'].map((header) => (
                      <th key={header} className='px-4 lg:px-6 py-3'>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {pageItems.map((request, index) => (
                    <tr key={`${request.requestedBy}-${index}`} className='hover:bg-gray-50'>
                      <td className='px-4 lg:px-6 py-4 text-sm'>
                        <div className='text-gray-900 font-medium'>{request.fromId}</div>
                        <div className='text-xs text-gray-500 mt-1'>{request.requestedBy}</div>
                      </td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{request.fromName}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{request.forId}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{request.forName}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-600'>{request.date}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-600'>{request.type}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm font-semibold text-[#C50000]'>{request.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-100'>
              <p className='text-xs sm:text-sm text-gray-500'>
                <span className='hidden sm:inline'>Showing {Math.min(filteredRequests.length, startIndex + 1)} to {Math.min(filteredRequests.length, startIndex + pageItems.length)} of {filteredRequests.length} requests (Doctors, Donors, Hospitals)</span>
                <span className='sm:hidden'>{startIndex + 1}-{Math.min(filteredRequests.length, startIndex + pageItems.length)} of {filteredRequests.length}</span>
              </p>
              <div className='flex items-center justify-between sm:justify-start gap-2'>
                <button
                  type='button'
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className='px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors'
                >
                  Previous
                </button>
                <span className='text-xs sm:text-sm text-gray-600 px-2'>{currentPage} / {totalPages}</span>
                <button
                  type='button'
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className='px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors'
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AdminRequests;

