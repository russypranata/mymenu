'use client'

import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react'
import { createLocation, updateLocation, deleteLocation } from '@/lib/actions/locations'
import type { Tables } from '@/types/database.types'

type StoreLocation = Tables<'store_locations'>

interface StoreLocationsManagerProps {
  storeId: string
  initialLocations: StoreLocation[]
}

export function StoreLocationsManager({ storeId, initialLocations }: StoreLocationsManagerProps) {
  const [locations, setLocations] = useState<StoreLocation[]>(initialLocations)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, locationId?: string) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const result = locationId
        ? await updateLocation(locationId, formData)
        : await createLocation(storeId, formData)

      if (result.error) {
        setError(result.error)
      } else {
        setIsAdding(false)
        setEditingId(null)
        window.location.reload()
      }
    } catch (err) {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (locationId: string) => {
    if (!confirm('Yakin ingin menghapus lokasi ini?')) return

    setLoading(true)
    setError(null)

    try {
      const result = await deleteLocation(locationId)
      if (result.error) {
        setError(result.error)
      } else {
        window.location.reload()
      }
    } catch (err) {
      setError('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Lokasi Toko</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola alamat, jam buka, dan kontak per lokasi. Tambahkan lebih dari 1 lokasi jika memiliki cabang.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Lokasi
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <LocationForm
          onSubmit={handleSubmit}
          onCancel={() => setIsAdding(false)}
          loading={loading}
        />
      )}

      {/* Locations List */}
      <div className="space-y-3">
        {locations.map((location) => (
          <div key={location.id}>
            {editingId === location.id ? (
              <LocationForm
                location={location}
                onSubmit={(e) => handleSubmit(e, location.id)}
                onCancel={() => setEditingId(null)}
                loading={loading}
              />
            ) : (
              <LocationCard
                location={location}
                onEdit={() => setEditingId(location.id)}
                onDelete={() => handleDelete(location.id)}
                disabled={loading}
              />
            )}
          </div>
        ))}
      </div>

      {locations.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-400">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Belum ada lokasi</p>
        </div>
      )}
    </div>
  )
}

interface LocationFormProps {
  location?: StoreLocation
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  loading: boolean
}

function LocationForm({ location, onSubmit, onCancel, loading }: LocationFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div>
        <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
          Nama Lokasi <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={location?.name}
          placeholder="Contoh: Cabang Sudirman"
          required
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
          Alamat <span className="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          name="address"
          defaultValue={location?.address}
          placeholder="Alamat lengkap lokasi"
          required
          rows={2}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label htmlFor="opening_hours" className="block text-xs font-medium text-gray-700 mb-1">
          Jam Buka
        </label>
        <input
          type="text"
          id="opening_hours"
          name="opening_hours"
          defaultValue={location?.opening_hours || ''}
          placeholder="Contoh: Senin - Jumat, 08:00 - 22:00"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="whatsapp" className="block text-xs font-medium text-gray-700 mb-1">
          WhatsApp
        </label>
        <input
          type="text"
          id="whatsapp"
          name="whatsapp"
          defaultValue={location?.whatsapp || ''}
          placeholder="Contoh: 628123456789"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_primary"
          name="is_primary"
          value="true"
          defaultChecked={location?.is_primary}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
        <label htmlFor="is_primary" className="text-xs font-medium text-gray-700 flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500" />
          Jadikan lokasi utama
        </label>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : location ? 'Simpan Perubahan' : 'Tambah Lokasi'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Batal
        </button>
      </div>
    </form>
  )
}

interface LocationCardProps {
  location: StoreLocation
  onEdit: () => void
  onDelete: () => void
  disabled: boolean
}

function LocationCard({ location, onEdit, onDelete, disabled }: LocationCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{location.name}</h4>
            {location.is_primary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                Utama
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
              <span>{location.address}</span>
            </div>
            {location.opening_hours && (
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{location.opening_hours}</span>
              </div>
            )}
            {location.whatsapp && (
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{location.whatsapp}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onEdit}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={disabled}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
