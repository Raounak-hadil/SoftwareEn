import Link from "next/link";

export function Hero(): JSX.Element {
  return (
    <section id="home" className="relative overflow-hidden pt-20 w-full bg-white">
      <div className="w-full py-16 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch min-h-[500px]">
          <div className="relative hidden md:block -mt-32">
            <svg
              className="h-[calc(100%+8rem)] w-full absolute top-0 left-0"
              viewBox="0 0 450 700"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 0 L 350 0 Q 420 100 400 250 Q 380 400 280 520 Q 180 640 120 700 L 0 700 Z"
                fill="#C50000"
              />
            </svg>
          </div>

          <div className="flex flex-col justify-center z-10 px-8 md:px-12 lg:px-16 py-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#C50000] mb-4 leading-tight italic">
              One Drop Can Save a Life
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#C50000] italic mb-4 sm:mb-6">
              Behind every donation is a heartbeat that keeps on living
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged.
            </p>
            <Link href="/admin-dashboard" className="w-full sm:w-fit">
              <span className="inline-flex w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-[#C50000] text-white px-6 sm:px-8 py-2 sm:py-3 rounded font-medium hover:bg-[#A00000] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Donate
                </button>
              </span>
            </Link>
          </div>
        </div>

        <div className="md:hidden -mx-4 -mt-8">
          <svg className="w-full h-64" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path
              d="M 0 0 L 300 0 Q 360 60 340 150 Q 320 240 200 280 Q 100 300 80 300 L 0 300 Z"
              fill="#C50000"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

export default Hero;