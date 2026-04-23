'use client'

import { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'
import type { Tables } from '@/types/database.types'

type StoreLocation = Tables<'store_locations'>

interface LocationSelectorProps {
  locations: StoreLocation[]
  primaryColor: string
  isDark: boolean
  onLocationChange: (location: StoreLocation) => void
}

export function LocationSelector({ locations, primaryColor, isDark, onLocationChange }: LocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation>(
    locations.find(loc => loc.is_primary) || locations[0]
  )
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (location: StoreLocation) => {
    setSelectedLocation(location)
    onLocationChange(location)
    setIsOpen(false)
  }

  // If only one location, don't show dropdown
  if (locations.length <= 1) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
          isDark
            ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white'
            : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
        }`}
      >
        <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: primaryColor }} />
        <span className="text-sm font-medium">{selectedLocation.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute top-full left-0 right-0 mt-2 py-2 rounded-lg border shadow-lg z-50 ${
              isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-white border-gray-200'
            }`}
          >
            {locations.map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelect(location)}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  selectedLocation.id === location.id
                    ? isDark
                      ? 'bg-slate-700 text-white'
                      : 'bg-gray-50 text-gray-900'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
                  <span className="font-medium">{location.name}</span>
                  {location.is_primary && (
                    <span className="text-xs text-gray-500">(Utama)</span>
                  )}
                </div>
                <div className={`text-xs mt-1 ml-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                  {location.address}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
