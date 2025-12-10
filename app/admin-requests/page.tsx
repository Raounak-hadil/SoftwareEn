'use client';

import { useEffect, useMemo, useState } from 'react';

import AdminNavbar from '@/components/ui/AdminNavbar';

type RequestRow = {
  from: string;
  forHospital: string;
  requestedBy: string;
  date: string;
  type: string;
  status: string;
};

const REQUESTS: RequestRow[] = [
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '04 Sep 2019', type: 'O-', status: 'Completed' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '28 May 2019', type: 'O-', status: 'Processing' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '23 Nov 2019', type: 'O-', status: 'Rejected' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '06 Feb 2019', type: 'O-', status: 'On Hold' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '29 Jul 2019', type: 'O-', status: 'In Transit' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '03 Jul 2019', type: 'O-', status: 'In Transit' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '15 Jun 2019', type: 'O-', status: 'Completed' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '02 Jun 2019', type: 'O-', status: 'Completed' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '15 May 2019', type: 'O-', status: 'Completed' },
  { from: 'CHU Mustapha', forHospital: 'CHU Mustapha', requestedBy: 'Riwane Messad', date: '07 May 2019', type: 'O-', status: 'Completed' },
];

const ITEMS_PER_PAGE = 10;

const AdminRequests = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
    if (!searchQuery.trim()) return REQUESTS;
    const query = searchQuery.toLowerCase();
    return REQUESTS.filter((request) =>
      [request.from, request.forHospital, request.requestedBy, request.status].some((field) => field.toLowerCase().includes(query)),
    );
  }, [searchQuery]);

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
                      <p className='text-sm font-medium text-gray-900'>{request.from}</p>
                      <p className='text-xs text-gray-500 mt-1'>{request.requestedBy}</p>
                    </div>
                    <span className='px-2 py-1 text-xs font-semibold text-[#C50000] bg-red-50 rounded-full'>{request.status}</span>
                  </div>
                  <div className='mt-3 space-y-1 text-xs text-gray-600'>
                    <div className='flex justify-between'>
                      <span className='text-gray-500'>For:</span>
                      <span className='text-gray-900'>{request.forHospital}</span>
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
                    {['From', 'For', 'Requested by', 'Date', 'Type', 'Status'].map((header) => (
                      <th key={header} className='px-4 lg:px-6 py-3'>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {pageItems.map((request, index) => (
                    <tr key={`${request.requestedBy}-${index}`} className='hover:bg-gray-50'>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{request.from}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{request.forHospital}</td>
                      <td className='px-4 lg:px-6 py-4 text-sm text-gray-900'>{request.requestedBy}</td>
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

