import { useState, useCallback, useRef } from 'react'
import { Pencil, Archive, RotateCcw, X, Building2, MapPin } from 'lucide-react'
import { GoogleMap, Marker, Autocomplete, useLoadScript } from '@react-google-maps/api'
import { useAdmin } from '../../context/AdminContext'

const GOOGLE_MAPS_API_KEY = 'AIzaSyCLoX0fwViXdhHDjzq2cOoaawtfpAN_hy4'
const MAP_LIBRARIES = ['places']
const BANGKOK_CENTER = { lat: 13.7563, lng: 100.5018 }
const MAP_CONTAINER_STYLE = { width: '100%', height: '280px', borderRadius: '12px' }

const EMPTY_FORM = {
  id: '', name: '', address: '',
  lat: '', lng: '',
  morningPickup: '', morningDropoff: '',
  eveningPickup: '', eveningDropoff: '',
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 flex items-center justify-between text-sm">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 text-red-400 hover:text-red-600"><X size={16} /></button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 mt-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}

function MapPicker({ lat, lng, onPick }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  })

  const mapRef = useRef(null)
  const autocompleteRef = useRef(null)
  const [mapCenter, setMapCenter] = useState(null)

  const onMapLoad = useCallback(map => { mapRef.current = map }, [])

  const parsedLat = parseFloat(lat)
  const parsedLng = parseFloat(lng)
  const hasCoords = !isNaN(parsedLat) && !isNaN(parsedLng)
  const center = mapCenter ?? (hasCoords ? { lat: parsedLat, lng: parsedLng } : BANGKOK_CENTER)

  function handleClick(e) {
    onPick(e.latLng.lat().toFixed(6), e.latLng.lng().toFixed(6))
  }

  function handlePlaceChanged() {
    const place = autocompleteRef.current.getPlace()
    if (!place.geometry?.location) return
    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()
    setMapCenter({ lat, lng })
    mapRef.current?.panTo({ lat, lng })
    mapRef.current?.setZoom(16)
    onPick(lat.toFixed(6), lng.toFixed(6))
  }

  if (loadError) return (
    <div className="flex items-center justify-center h-[280px] bg-gray-50 rounded-xl text-sm text-red-500">
      Failed to load map
    </div>
  )
  if (!isLoaded) return (
    <div className="h-[280px] bg-gray-100 rounded-xl animate-pulse" />
  )

  return (
    <div className="space-y-2">
      <Autocomplete
        onLoad={ac => { autocompleteRef.current = ac }}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder="ค้นหาชื่อสถานที่..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]"
        />
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={hasCoords ? 15 : 11}
        onClick={handleClick}
        onLoad={onMapLoad}
        options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
      >
        {hasCoords && <Marker position={{ lat: parsedLat, lng: parsedLng }} />}
      </GoogleMap>
    </div>
  )
}

export default function SchoolsTab() {
  const { filteredSchools, loading, error, clearError, handleSaveSchool, handleArchiveSchool } = useAdmin()
  const [showArchived, setShowArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const visible = filteredSchools.filter(s => showArchived ? s.isArchived : !s.isArchived)

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditTarget(null)
    setShowMap(false)
    setModalOpen(true)
  }

  function openEdit(school) {
    setForm({ ...EMPTY_FORM, ...school })
    setEditTarget(school)
    setShowMap(false)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
    setShowMap(false)
  }

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  function handleMapPick(lat, lng) {
    setForm(f => ({ ...f, lat, lng }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await handleSaveSchool(form)
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchive(school) {
    await handleArchiveSchool(school.id, !school.isArchived)
  }

  return (
    <div className="p-6">
      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Building2 size={20} className="text-[#F98C1F]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222222]">Schools</h2>
            <p className="text-sm text-[#666666]">{visible.length} {showArchived ? 'archived' : 'active'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer">
            <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} className="rounded" />
            Show archived
          </label>
          <button
            onClick={openCreate}
            className="bg-[#F98C1F] hover:bg-[#F57C00] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            + Add School
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSkeleton /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {visible.length === 0 ? (
            <div className="text-center py-16 text-[#666666]">
              <Building2 size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No schools found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#F5EDE3]">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#222222]">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden md:table-cell">Address</th>
                  <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">Morning Pickup</th>
                  <th className="text-right px-4 py-3 font-semibold text-[#222222]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(school => (
                  <tr key={school.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#222222]">
                      {school.name}
                      {school.isArchived && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">archived</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{school.address}</td>
                    <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{school.morningPickup}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(school)}
                          className="p-1.5 hover:bg-orange-100 rounded-lg text-[#666666] hover:text-[#F98C1F] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleArchive(school)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#666666] hover:text-[#222222] transition-colors"
                          title={school.isArchived ? 'Restore' : 'Archive'}
                        >
                          {school.isArchived ? <RotateCcw size={15} /> : <Archive size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#222222]">
                {editTarget ? 'Edit School' : 'Add School'}
              </h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <Field label="School Name *" value={form.name} onChange={set('name')} required placeholder="e.g. Bangkok International School" />
              <Field label="Address" value={form.address} onChange={set('address')} placeholder="Full address" />

              {/* Lat/Lng + Map toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#666666]">Location</span>
                  <button
                    type="button"
                    onClick={() => setShowMap(v => !v)}
                    className="flex items-center gap-1 text-xs text-[#F98C1F] hover:text-[#F57C00] font-medium"
                  >
                    <MapPin size={13} />
                    {showMap ? 'Hide map' : 'Pick on map'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Latitude" value={form.lat} onChange={set('lat')} placeholder="13.7563" />
                  <Field label="Longitude" value={form.lng} onChange={set('lng')} placeholder="100.5018" />
                </div>
                {showMap && (
                  <div className="mt-3">
                    <MapPicker lat={form.lat} lng={form.lng} onPick={handleMapPick} />
                    <p className="text-xs text-[#666666] mt-1.5 text-center">คลิกบนแผนที่เพื่อเลือกตำแหน่ง</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Morning Pickup" value={form.morningPickup} onChange={set('morningPickup')} placeholder="07:00" />
                <Field label="Morning Dropoff" value={form.morningDropoff} onChange={set('morningDropoff')} placeholder="08:00" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Evening Pickup" value={form.eveningPickup} onChange={set('eveningPickup')} placeholder="15:00" />
                <Field label="Evening Dropoff" value={form.eveningDropoff} onChange={set('eveningDropoff')} placeholder="16:00" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[#666666] hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#F98C1F] hover:bg-[#F57C00] text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Add School'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, required, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#666666] mb-1">{label}</label>
      <input
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F] focus:border-transparent"
      />
    </div>
  )
}
