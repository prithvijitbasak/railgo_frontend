'use client';

import React, { useState } from 'react';
import { Train, Filter, ArrowRight, Clock, Sun, Moon, Sunrise, Sunset, ChevronDown } from 'lucide-react';

// Mock Data for Search Results
const mockTrains = [
  {
    id: '1',
    name: 'Rajdhani Express',
    number: '12951',
    departure: '16:30',
    arrival: '08:35',
    duration: '16h 05m',
    from: 'New Delhi (NDLS)',
    to: 'Mumbai Central (MMCT)',
    classes: [
      { type: '1A', price: 4250, status: 'Available - 04', statusColor: 'text-green-600', bg: 'bg-green-50' },
      { type: '2A', price: 2850, status: 'WL - 15', statusColor: 'text-orange-600', bg: 'bg-orange-50' },
      { type: '3A', price: 1950, status: 'RAC - 22', statusColor: 'text-orange-600', bg: 'bg-orange-50' },
    ],
  },
  {
    id: '2',
    name: 'Garib Rath Express',
    number: '12909',
    departure: '15:30',
    arrival: '08:10',
    duration: '16h 40m',
    from: 'New Delhi (NDLS)',
    to: 'Bandra Terminus (BDTS)',
    classes: [
      { type: '3A', price: 1050, status: 'Available - 120', statusColor: 'text-green-600', bg: 'bg-green-50' },
      { type: 'CC', price: 850, status: 'Available - 45', statusColor: 'text-green-600', bg: 'bg-green-50' },
    ],
  },
  {
    id: '3',
    name: 'Paschim Express',
    number: '12926',
    departure: '16:45',
    arrival: '14:55',
    duration: '22h 10m',
    from: 'New Delhi (NDLS)',
    to: 'Mumbai Central (MMCT)',
    classes: [
      { type: '2A', price: 2600, status: 'Available - 02', statusColor: 'text-green-600', bg: 'bg-green-50' },
      { type: '3A', price: 1750, status: 'WL - 40', statusColor: 'text-red-600', bg: 'bg-red-50' },
      { type: 'SL', price: 650, status: 'Regret', statusColor: 'text-red-600', bg: 'bg-red-50' },
    ],
  },
];

export default function SearchResults() {
  const [selectedDate, setSelectedDate] = useState('14 Sep, 2026');

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Simplified Navigation */}
      <nav className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Train className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">RailConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                JD
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modify Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-lg font-bold text-gray-800">
            <span>New Delhi</span>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <span>Mumbai</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            {['13 Sep', '14 Sep', '15 Sep', '16 Sep'].map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(`${date}, 2026`)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedDate.includes(date)
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
          <button className="text-blue-700 font-semibold border border-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm">
            Modify Search
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-6">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-600" /> Filters
              </h2>
              <button className="text-sm text-blue-600 font-medium">Reset</button>
            </div>

            {/* Journey Class Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Class</h3>
              <div className="space-y-2">
                {['1A (First AC)', '2A (Second AC)', '3A (Third AC)', 'SL (Sleeper)'].map((cls) => (
                  <label key={cls} className="flex items-center space-x-3 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" />
                    <span>{cls}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Departure Time Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Departure Time</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-gray-500">
                  <Sunrise className="h-5 w-5 mb-1 text-orange-400" />
                  <span className="text-xs">Morning</span>
                  <span className="text-[10px]">06:00 - 12:00</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-gray-500">
                  <Sun className="h-5 w-5 mb-1 text-yellow-500" />
                  <span className="text-xs">Afternoon</span>
                  <span className="text-[10px]">12:00 - 18:00</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-gray-500">
                  <Sunset className="h-5 w-5 mb-1 text-orange-500" />
                  <span className="text-xs">Evening</span>
                  <span className="text-[10px]">18:00 - 00:00</span>
                </button>
                <button className="flex flex-col items-center justify-center p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-gray-500">
                  <Moon className="h-5 w-5 mb-1 text-indigo-500" />
                  <span className="text-xs">Night</span>
                  <span className="text-[10px]">00:00 - 06:00</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Train Results */}
        <div className="w-full lg:w-3/4 space-y-4">
          <p className="text-gray-600 text-sm mb-2">{mockTrains.length} Results found for {selectedDate}</p>

          {mockTrains.map((train) => (
            <div key={train.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200">
              
              {/* Train Info Row */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 bg-gray-50">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{train.name} <span className="text-sm font-medium text-gray-500">({train.number})</span></h3>
                  <p className="text-xs text-gray-500 mt-1">Runs On: <span className="text-green-600 font-medium">M T W T F S S</span></p>
                </div>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{train.departure}</p>
                    <p className="text-xs text-gray-500">{train.from}</p>
                  </div>
                  <div className="flex flex-col items-center px-4">
                    <Clock className="h-4 w-4 text-gray-400 mb-1" />
                    <span className="text-xs font-semibold text-gray-600">{train.duration}</span>
                    <div className="w-full h-px bg-gray-300 mt-1"></div>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-800">{train.arrival}</p>
                    <p className="text-xs text-gray-500">{train.to}</p>
                  </div>
                </div>
              </div>

              {/* Class Availability Row */}
              <div className="p-5 overflow-x-auto">
                <div className="flex space-x-4 min-w-max">
                  {train.classes.map((cls, idx) => (
                    <div key={idx} className={`w-44 border rounded-lg p-3 cursor-pointer hover:border-blue-500 transition ${cls.bg}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700">{cls.type}</span>
                        <span className="text-sm font-bold text-gray-900">₹{cls.price}</span>
                      </div>
                      <p className={`text-sm font-semibold ${cls.statusColor}`}>{cls.status}</p>
                      <button className="mt-3 w-full bg-white border border-gray-300 text-gray-700 text-xs font-bold py-1.5 rounded hover:bg-gray-50">
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}