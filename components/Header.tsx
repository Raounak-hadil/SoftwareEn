'use client'

export default function Header() {
  return (
    <header className="bg-white py-[15px] px-[30px] border-b border-[#e5e7eb] flex items-center justify-between sticky top-0 z-[100]">
      <div className="flex-1 max-w-[500px] mx-[30px] relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] w-[18px] h-[18px]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full py-2.5 pl-10 pr-[15px] border border-[#e5e7eb] rounded-lg text-sm"
        />
      </div>
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-[#f9fafb] flex items-center justify-center overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-[#6b7280]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-sm text-[#111827]">Hospital Admin</div>
          <div className="text-xs text-[#6b7280]">CHU Mustapha</div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-[#6b7280]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </header>
  )
}

