import type { JSX } from 'react';
import Link from 'next/link';

export function Header(): JSX.Element {
  return (
    <header className='bg-blood-red sticky top-0 z-50'>
      <nav className='max-w-[80rem] mx-auto px-4 sm:px-6 lg:px-8 py-4'>
        <div className='flex justify-between items-center'>
          <Link href='/' className='text-white font-bold text-xl'>
            HERO
          </Link>
          <div className='hidden md:flex items-center gap-8'>
            {['Home', 'Doctors', 'Hospitals', 'Statistics', 'FAQ'].map((item) => (
              <Link key={item} href='/' className='text-white hover:text-gray-100 font-medium text-sm'>
                {item}
              </Link>
            ))}
          </div>
          <Link
            href='/login'
            className='border border-white text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-blood-red transition-colors'
          >
            Log in
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
