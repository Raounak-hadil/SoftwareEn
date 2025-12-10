import Link from 'next/link';

export function Footer(): JSX.Element {
  return (
    <footer className='bg-[#C50000] text-white w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 border-b border-white/20'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='w-12 h-12 bg-white/20 rounded-full flex items-center justify-center'>
              <span className='text-2xl'>🩸</span>
            </div>
            <div className='text-2xl font-bold font-[cursive]'>
              be a <span className='text-white'>HERO</span>
            </div>
          </div>

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

      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8'>
        <div className='grid grid-cols-2 md:grid-cols-5 gap-8'>
          <div className='col-span-2 md:col-span-1'>
            <h4 className='font-semibold mb-4 text-sm'>Subscribe to our newsletter</h4>
            <input
              type='email'
              placeholder='Email address'
              className='w-full px-3 py-2 rounded bg-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/50'
            />
          </div>

          <div>
            <h4 className='font-semibold mb-4 text-sm'>Savy</h4>
            <ul className='space-y-2 text-xs text-white/80'>
              {['Email', 'Marketing', 'Campaigns', 'Branding', 'Offline'].map((item) => (
                <li key={item}>
                  <Link href='#' className='hover:text-white'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4 text-sm'>About</h4>
            <ul className='space-y-2 text-xs text-white/80'>
              {['Our Story', 'Benefits', 'Team', 'Care'].map((item) => (
                <li key={item}>
                  <Link href='#' className='hover:text-white'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='font-semibold mb-4 text-sm'>Help</h4>
            <ul className='space-y-2 text-xs text-white/80'>
              {['FAQs', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href='#' className='hover:text-white'>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 border-t border-white/20'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex gap-4 text-xs text-white/80'>
            {['Terms & Conditions', 'Privacy Policy'].map((item) => (
              <Link key={item} href='#' className='hover:text-white'>
                {item}
              </Link>
            ))}
          </div>
          <div className='flex gap-4 text-white'>
            <Link href='#' className='hover:opacity-80 transition' aria-label='Facebook'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' />
              </svg>
            </Link>
            <Link href='#' className='hover:opacity-80 transition' aria-label='Instagram'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
            </Link>
            <Link href='#' className='hover:opacity-80 transition' aria-label='LinkedIn'>
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M9 8H6v12h3zm.34-3a1.75 1.75 0 10-.02 3.5 1.75 1.75 0 00.02-3.5zM21 14.5v5.5h-3v-5c0-1.2-.43-2-1.52-2-0.83 0-1.32.56-1.54 1.1-.08.2-.1.48-.1.76v5.14h-3s.04-8.35 0-9.22h3v1.31c.4-.62 1.12-1.51 2.72-1.51 1.99 0 3.48 1.3 3.48 4.09z' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
