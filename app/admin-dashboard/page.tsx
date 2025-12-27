'use client';

import type { JSX } from 'react';
import { useState, useEffect, type ChangeEvent } from 'react';

import AdminNavbar from '../../components/ui/AdminNavbar';

type StatCard = {
  title: string;
  value: string;
  change: string;
  changeText: string;
  icon: JSX.Element;
  bgColor: string;
  iconColor: string;
};

type ChartPoint = {
  month: string;
  value: number;
};

const AdminDashboard = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [totalBloodUnits, setTotalBloodUnits] = useState<string>('Loading...');
  const [connectedHospitals, setConnectedHospitals] = useState<string>('Loading...');
  const [totalPending, setTotalPending] = useState<string>('Loading...');
  const [chartData, setChartData] = useState<ChartPoint[]>([
    { month: 'A+', value: 0 },
    { month: 'A-', value: 0 },
    { month: 'B+', value: 0 },
    { month: 'B-', value: 0 },
    { month: 'AB+', value: 0 },
    { month: 'AB-', value: 0 },
    { month: 'O+', value: 0 },
    { month: 'O-', value: 0 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.stats) {
            setTotalBloodUnits(json.stats.total_blood_units?.toString() || '0');
            setConnectedHospitals(json.stats.connected_hospitals?.toString() || '0');
            setTotalPending(json.stats.total_pending?.toString() || '0');
            if (json.stats.blood_distribution && json.stats.blood_distribution.length > 0) {
              setChartData(json.stats.blood_distribution);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      }
    };
    fetchStats();
  }, []);

  const stats: StatCard[] = [
    {
      title: 'Total blood units',
      value: totalBloodUnits,
      change: '+8.5%',
      changeText: 'Up from past month',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
          />
        </svg>
      ),
      bgColor: 'bg-red-50',
      iconColor: 'text-[#C50000]',
    },
    {
      title: 'Connected hospitals',
      value: connectedHospitals,
      change: '+1.3%',
      changeText: 'Up from past month',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
          />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Total Pending',
      value: totalPending,
      change: '+1.8%',
      changeText: 'Up from past month',
      icon: (
        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
        </svg>
      ),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
  ];

  // Removed hardcoded chartData as it is now a state variable

  const maxValueRaw = Math.max(...chartData.map((d) => d.value));
  const maxValue = maxValueRaw === 0 ? 1 : maxValueRaw;

  const generatePath = (): string => {
    const width = 700;
    const height = 200;
    const padding = 50;

    let path = `M ${padding} ${height - (chartData[0].value / maxValue) * (height - 40)}`;

    for (let i = 1; i < chartData.length; i += 1) {
      const x = padding + (i / (chartData.length - 1)) * width;
      const y = height - (chartData[i].value / maxValue) * (height - 40);
      const prevX = padding + ((i - 1) / (chartData.length - 1)) * width;
      const prevY = height - (chartData[i - 1].value / maxValue) * (height - 40);

      const cpX1 = prevX + (x - prevX) / 3;
      const cpX2 = prevX + ((x - prevX) * 2) / 3;

      path += ` C ${cpX1} ${prevY} ${cpX2} ${y} ${x} ${y}`;
    }

    return path;
  };

  const generateAreaPath = (): string => {
    const width = 700;
    const height = 200;
    const padding = 50;

    let path = `M ${padding} ${height} L ${padding} ${height - (chartData[0].value / maxValue) * (height - 40)}`;

    for (let i = 1; i < chartData.length; i += 1) {
      const x = padding + (i / (chartData.length - 1)) * width;
      const y = height - (chartData[i].value / maxValue) * (height - 40);
      const prevX = padding + ((i - 1) / (chartData.length - 1)) * width;
      const prevY = height - (chartData[i - 1].value / maxValue) * (height - 40);

      const cpX1 = prevX + (x - prevX) / 3;
      const cpX2 = prevX + ((x - prevX) * 2) / 3;

      path += ` C ${cpX1} ${prevY} ${cpX2} ${y} ${x} ${y}`;
    }

    path += ` L ${padding + width} ${height} Z`;
    return path;
  };

  const peakPoint = maxValueRaw > 0 ? chartData.find(d => d.value === maxValueRaw) : null;

  return (
    <>
      <AdminNavbar />
      <main className='pt-16 lg:ml-64 transition-all duration-300'>
        <div className='p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen'>
          <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8'>Dashboard</h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8'>
            {stats.map((stat) => (
              <div key={stat.title} className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-500 mb-1'>{stat.title}</p>
                    <p className='text-3xl font-bold text-gray-900 mb-2'>{stat.value}</p>
                    <div className='flex items-center gap-1'>
                      <svg className='w-4 h-4 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 10l7-7m0 0l7 7m-7-7v18' />
                      </svg>
                      <span className='text-sm text-green-500 font-medium'>{stat.change}</span>
                      <span className='text-sm text-gray-400 ml-1'>{stat.changeText}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center ${stat.iconColor}`}>{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-1 h-6 bg-[#C50000] rounded-full' />
                <h2 className='text-lg sm:text-xl font-bold text-gray-900'>Blood Units by Type</h2>
              </div>
              <select
                value={selectedYear}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectedYear(event.target.value)}
                className='px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C50000] bg-white'
              >
                <option value='2025'>2025</option>
                <option value='2024'>2024</option>
                <option value='2023'>2023</option>
              </select>
            </div>

            <div className='h-64 sm:h-72 relative overflow-hidden'>
              <svg className='w-full h-full' viewBox='0 0 800 250' preserveAspectRatio='none'>
                <defs>
                  <linearGradient id='chartGradient' x1='0%' y1='0%' x2='0%' y2='100%'>
                    <stop offset='0%' stopColor='#C50000' stopOpacity='0.3' />
                    <stop offset='100%' stopColor='#C50000' stopOpacity='0.02' />
                  </linearGradient>
                </defs>

                {[0, 1, 2, 3, 4].map((index) => (
                  <line key={index} x1='50' y1={40 + index * 40} x2='750' y2={40 + index * 40} stroke='#f3f4f6' strokeWidth='1' />
                ))}

                <path d={generateAreaPath()} fill='url(#chartGradient)' />
                <path d={generatePath()} fill='none' stroke='#C50000' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' />

                {chartData.map((point, index) => {
                  const x = 50 + (index / (chartData.length - 1)) * 700;
                  const y = 200 - (point.value / maxValue) * 160;
                  const isPeak = maxValueRaw > 0 && point.value === maxValueRaw;

                  return (
                    <g key={`${point.month}-${index}`}>
                      {isPeak && (
                        <>
                          <line x1={x} y1={y} x2={x} y2={y - 30} stroke='#C50000' strokeWidth='1' strokeDasharray='3,3' />
                          <rect x={x - 2} y={y - 45} width='4' height='15' fill='#C50000' />
                          <polygon points={`${x + 2},${y - 45} ${x + 15},${y - 40} ${x + 2},${y - 35}`} fill='#C50000' />
                        </>
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isPeak ? 5 : 3}
                        fill={isPeak ? '#C50000' : 'white'}
                        stroke='#C50000'
                        strokeWidth='2'
                      />
                    </g>
                  );
                })}

                {chartData.map((point, index) => {
                  const x = 50 + (index / (chartData.length - 1)) * 700;
                  return (
                    <text key={`${point.month}-label-${index}`} x={x} y='235' className='text-xs fill-gray-400' textAnchor='middle'>
                      {point.month}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;

