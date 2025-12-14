'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type SearchBarProps = {
  onSearch?: (value: string) => void;
};

const SearchBar = ({ onSearch }: SearchBarProps): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState('');

  const dispatchQuery = (value: string): void => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('adminSearchQuery', value);
      window.dispatchEvent(new CustomEvent('adminSearch', { detail: value }));
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setSearchQuery(value);
    dispatchQuery(value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    dispatchQuery(searchQuery);
    onSearch?.(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className='flex items-center'>
      <input
        type='text'
        placeholder='Search'
        value={searchQuery}
        onChange={handleChange}
        className='outline-none text-sm w-32 sm:w-48 bg-transparent'
      />
    </form>
  );
};

type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin-dashboard',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h6v6H4zM14 6h6v6h-6zM4 16h6v6H4zM14 16h6v6h-6z' />
      </svg>
    ),
  },
  {
    id: 'requests',
    label: 'All Requests',
    path: '/admin-requests',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
      </svg>
    ),
  },
  {
    id: 'hospitals',
    label: 'Hospitals',
    path: '/admin-hospitals',
    icon: (
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
      </svg>
    ),
  },
];

const AdminNavbar = (): JSX.Element => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    if (path.includes('requests')) setActiveSection('requests');
    else if (path.includes('hospitals')) setActiveSection('hospitals');
    else setActiveSection('dashboard');
  }, []);

  return (
    <>
      <header className='fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center gap-4'>
          <button type='button' onClick={() => setSidebarOpen((open) => !open)} className='p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
          <Link href='/admin-dashboard' className='flex items-center gap-2'>
            <span className='text-xl sm:text-2xl font-bold text-[#C50000]'>Blood</span>
            <span className='text-xl sm:text-2xl font-bold text-gray-900'>Management</span>
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          <div className='hidden sm:flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-gray-50'>
            <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            <SearchBar />
          </div>

          <div className='relative'>
            <button
              type='button'
              onClick={() => setShowProfileMenu((open) => !open)}
              className='flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 transition-colors'
            >
              <div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-200'>
                <Image src='/images/admin_profile.png' alt='Admin profile' width={40} height={40} className='w-full h-full object-cover' priority />
              </div>
              <div className='hidden sm:block text-left'>
                <p className='text-sm font-medium text-gray-900'>Riwane</p>
                <p className='text-xs text-gray-500'>Admin</p>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showProfileMenu ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
              </svg>
            </button>

            {showProfileMenu && (
              <div className='absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-4 z-50 max-w-[calc(100vw-2rem)]'>
                <div className='px-4 pb-4 border-b border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-[#C50000] flex-shrink-0'>
                      <Image src='/images/admin_profile.png' alt='Admin profile' width={56} height={56} className='w-full h-full object-cover' />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='font-semibold text-sm sm:text-base text-gray-900 truncate'>Riwane</p>
                      <p className='text-xs sm:text-sm text-gray-500 truncate'>riwane@admin.com</p>
                      <p className='text-xs text-[#C50000] font-medium'>Administrator</p>
                    </div>
                  </div>
                </div>

                <div className='px-4 py-3 space-y-1 text-xs sm:text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Phone:</span>
                    <span className='text-gray-900 truncate ml-2'>+213 555 123 456</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Joined:</span>
                    <span className='text-gray-900'>Jan 2024</span>
                  </div>
                </div>

                <div className='px-4 pt-3 border-t border-gray-200 space-y-2'>
                  <button type='button' className='w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'>
                    <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
                    </svg>
                    Edit Profile
                  </button>
                  <Link
                    href='/'
                    className='w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                  >
                    <svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                    </svg>
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 text-gray-900 transition-all duration-300 z-40 overflow-hidden lg:overflow-visible ${
          sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 lg:translate-x-0 lg:w-64'
        }`}
      >
        <div className='p-4 h-full flex flex-col'>
          <div className='mb-6'>
            <Link href='/admin-dashboard' className='flex items-center gap-2'>
              <span className='text-xl font-bold text-[#C50000]'>Blood</span>
              <span className='text-xl font-bold text-gray-900'>Management</span>
            </Link>
          </div>

          <nav className='space-y-1 flex-1'>
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => {
                  setActiveSection(item.id);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-[#C50000] text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className='font-medium'>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className='border-t border-gray-200 pt-4 space-y-1'>
            <button type='button' className='flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 w-full transition-colors'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
              <span className='font-medium'>Settings</span>
            </button>
            <Link href='/' className='flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 w-full transition-colors'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
              </svg>
              <span className='font-medium'>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {showProfileMenu && <div className='fixed inset-0 z-40' onClick={() => setShowProfileMenu(false)} />}
    </>
  );
};

export default AdminNavbar;
