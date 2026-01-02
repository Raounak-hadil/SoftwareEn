import Image from 'next/image';
import Link from 'next/link';

export default function Donors(): JSX.Element {
  return (
    <section id='donors' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center'>
          <div className='flex justify-start order-2 md:order-1'>
            <div className='relative w-[340px] sm:w-[400px] h-[240px] sm:h-[280px]'>
              <div className='absolute top-0 left-0 w-full h-full bg-[#C50000]' />
              <Image
                src='/images/Donation.png'
                alt='Donation drive'
                width={450}
                height={320}
                className='absolute -bottom-4 -right-4 w-full h-full object-cover z-10 rounded-sm'
                priority
              />
            </div>
          </div>
          <div className='order-1 md:order-2'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-[#C50000] mb-6'>
              Our Donors
            </h2>
            <p className='text-base sm:text-lg text-gray-700 mb-8 leading-relaxed max-w-xl'>
              Our dedicated community of donors plays a vital role in supporting hospitals and saving lives. By providing essential blood supplies, they enable critical surgeries and emergency treatments, ensuring that quality healthcare is available to every patient in need.
            </p>
            <Link href="/form">
              <button className='bg-[#C50000] text-white px-8 py-3 rounded font-semibold w-full sm:w-auto hover:bg-[#A00000] transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-100'>
                Register now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
