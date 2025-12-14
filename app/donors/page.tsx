import Image from 'next/image';
import Link from 'next/link';

export function Donors(): JSX.Element {
  return (
    <section id='donors' className='bg-white py-16 md:py-24 w-full'>
      <div className='w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start'>
          <div className='flex justify-start order-2 md:order-1'>
            <div className='relative w-[320px] h-[220px]'>
              <div className='absolute top-0 left-0 w-full h-full bg-[#C50000]' />
              <Image
                src='/images/Donation.png'
                alt='Donation drive'
                width={400}
                height={300}
                className='absolute -bottom-4 -right-4 w-full h-full object-cover z-10'
                priority
              />
            </div>
          </div>

          <div className='order-1 md:order-2'>
            <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#C50000] mb-4 sm:mb-6'>
              Permanent Donors
            </h2>
            <p className='text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed'>
              Permanent donors play a vital role in supporting hospitals and ensuring the delivery of quality healthcare services.
              With each donation, our permanent donors help patients in need recover from surgeries and critical illnesses. As our
              permanent donor community grows, hospitals expand their facilities, purchase advanced medical equipment, and provide
              assistance to patients who otherwise couldn't afford treatment.
            </p>
            <p className='text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed'>
              Our recognition programs and charitable organizations celebrate the contributions of our permanent donors and provide
              direct feedback to the community health programs. Hospitals rely on the generosity of individuals,
              companies, and charities to fund research, improve patient care, and develop community health programs. To
              honor their impact, hospitals recognize and thank their permanent donors.
            </p>
            <Link href="/form">
              <button className='bg-[#C50000] text-white px-6 sm:px-8 py-2 sm:py-3 rounded font-medium w-full sm:w-auto hover:bg-[#A00000] transition-all duration-300 hover:scale-105 active:scale-95'>
                Register now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Donors;
