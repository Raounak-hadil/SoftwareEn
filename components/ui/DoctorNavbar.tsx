'use client';

import type { JSX } from 'react';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type NavLink = {
  id: string;
  label: string;
};

const NAV_LINKS: NavLink[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'biography', label: 'Biography' },
  { id: 'requests', label: 'Requests' },
  { id: 'notifications', label: 'Notifications' },
];

const DoctorNavbar = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('profile');

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
      const current = NAV_LINKS.find((link) => {
        const element = document.getElementById(link.id);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current) {
        setActiveLink(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string): void => {
    const element = document.getElementById(id);
    if (!element) return;
    const offset = 80;
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setOpen(false);
  };

const renderNavButton = (link: NavLink, isMobile = false): JSX.Element => (
    <button
      key={link.id}
      type='button'
      onClick={() => handleNavClick(link.id)}
      className={`text-sm font-medium transition-all duration-300 py-1 ${
        activeLink === link.id ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-[#C50000]'
      } ${isMobile ? 'w-full text-left' : ''}`}
    >
      {link.label}
    </button>
  );

  return (
    <>
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className='flex items-center justify-end px-8 h-16 max-w-7xl mx-auto'>
          <nav className='flex items-center gap-8'>
            {NAV_LINKS.map((link) => renderNavButton(link))}
            <Link
              href='/'
              className='px-6 py-2 bg-[#C50000] text-white rounded font-medium hover:bg-[#A00000] transition-all duration-300'
            >
              Log out
            </Link>
          </nav>
        </div>
      </header>

      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className='flex items-center justify-between px-4 h-16'>
          <span className='text-lg font-bold text-[#C50000]'>BloodManagement</span>
          <button
            type='button'
            className='p-2 transition-transform duration-300 hover:scale-110 active:scale-95'
            onClick={() => setOpen((value) => !value)}
            aria-label='Toggle menu'
          >
            <div className='relative w-6 h-6'>
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                  open ? 'rotate-45 top-2.5' : ''
                }`}
              />
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                  open ? '-rotate-45 top-2.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
            open ? 'max-h-[400px]' : 'max-h-0'
          }`}
        >
          <div className='px-6 py-4 space-y-3'>
            {NAV_LINKS.map((link) => renderNavButton(link, true))}
            <Link
              href='/'
              className='block w-full text-center bg-[#C50000] text-white py-2 rounded-lg font-medium hover:bg-[#A00000] transition-all duration-300'
              onClick={() => setOpen(false)}
            >
              Log out
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default DoctorNavbar;
