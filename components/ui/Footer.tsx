'use client';

import Link from 'next/link';

export const Footer = (): JSX.Element => {
  return (
    <footer className='bg-[#C50000] text-white w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 border-b border-white/20'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <Link href="/home" className='flex items-center gap-2 hover:opacity-90 transition'>
            <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>🩸</span>
            </div>
            <div className='text-2xl font-bold font-[cursive]'>
              be a <span className='text-white'>HERO</span>
            </div>
          </Link>

          <div className='flex items-center gap-4'>
            <span className='text-sm'>Ready to get started?</span>
            <Link href="/login">
              <button className='bg-white text-[#C50000] px-6 py-2 rounded font-medium hover:bg-gray-100 transition text-sm'>
                Log in
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex gap-4 text-xs text-white/80'>
            {['Terms & Conditions', 'Privacy Policy'].map((item) => (
              <Link key={item} href='#' className='hover:text-white'>
                {item}
              </Link>
            ))}
          </div>
          <div className='flex gap-4 text-white'>
            <Link href='https://www.linkedin.com/in/raounak-hadil-student-kaoua-a25505345?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' target='_blank' rel='noopener noreferrer' className='hover:opacity-80 transition' aria-label='LinkedIn'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 8H6v12h3zm.34-3a1.75 1.75 0 10-.02 3.5 1.75 1.75 0 00.02-3.5zM21 14.5v5.5h-3v-5c0-1.2-.43-2-1.52-2-0.83 0-1.32.56-1.54 1.1-.08.2-.1.48-.1.76v5.14h-3s.04-8.35 0-9.22h3v1.31c.4-.62 1.12-1.51 2.72-1.51 1.99 0 3.48 1.3 3.48 4.09z' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
