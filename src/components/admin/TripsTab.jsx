import { useState } from 'react'
import { Pencil, Archive, RotateCcw, X, Route } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const EMPTY = {
  id: '', schoolId: '', busId: '',
  serviceDate: '', round: 'toSchool',
  scheduledStartAt: '', childIds: [],
}

const STATUS_CFG = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-orange-100 text-[#F98C1F]',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 flex items-center justify-between text-sm">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 text-red-400 hover:text-red-600"><X size={16} /></button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#666666] mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]"

export default function TripsTab() {
  const {
    filteredTrips, schools, buses, children: allChildren,
    error, clearError, handleSaveTrip, handleArchiveTrip,
  } = useAdmin()

  const [showArchived, setShowArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  // Sort trips by serviceDate descending
  const sorted = [...filteredTrips].sort((a, b) => {
    const da = a.serviceDate || ''
    const db2 = b.serviceDate || ''
    return da < db2 ? 1 : -1
  })
  const visible = sorted.filter(t => showArchived ? t.isArchived : !t.isArchived)

  const activeSchools = schools.filter(s => !s.isArchived)
  const activeBuses = buses.filter(b => !b.isArchived)

  // Children eligible for the selected school
  const eligibleChildren = allChildren.filter(
    c => !c.isArchived && c.schoolId === form.schoolId
  )

  function openCreate() {
    setForm(EMPTY)
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(trip) {
    setForm({ ...EMPTY, ...trip, childIds: trip.childIds || [] })
    setEditTarget(trip)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
  }

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  function toggleChild(childId) {
    setForm(f => ({
      ...f,
      childIds: f.childIds.includes(childId)
        ? f.childIds.filter(id => id !== childId)
        : [...f.childIds, childId],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await handleSaveTrip(form)
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchive(trip) {
    await handleArchiveTrip(trip, !trip.isArchived)
  }

  const schoolName = id => activeSchools.find(s => s.id === id)?.name || '—'
  const busNumber = id => activeBuses.find(b => b.id === id)?.busNumber

  return (
    <div className="p-6">
      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Route size={20} className="text-[#F98C1F]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222222]">Trips</h2>
            <p className="text-sm text-[#666666]">{visible.length} {showArchived ? 'archived' : 'active'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[#666666] cursor-pointer">
            <input type="checkbox" checked={showArchived} onChange={e => setShowArchived(e.target.checked)} className="rounded" />
            Show archived
          </label>
          <button onClick={openCreate}
            className="bg-[#F98C1F] hover:bg-[#F57C00] text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors">
            + Add Trip
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-[#666666]">
            <Route size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No trips found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5EDE3]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#222222]">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden md:table-cell">School</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden md:table-cell">Bus</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">Round</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[#222222]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(trip => (
                <tr key={trip.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#222222]">
                    {trip.serviceDate || trip.serviceDateKey || '—'}
                    {trip.isArchived && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">archived</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{schoolName(trip.schoolId)}</td>
                  <td className="px-4 py-3 text-[#666666] hidden md:table-cell">
                    {busNumber(trip.busId) ? `Bus #${busNumber(trip.busId)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">
                    {trip.round === 'toSchool' ? '🏫 To School' : '🏠 To Home'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CFG[trip.status] || STATUS_CFG.draft}`}>
                      {trip.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(trip)}
                        className="p-1.5 hover:bg-orange-100 rounded-lg text-[#666666] hover:text-[#F98C1F] transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => toggleArchive(trip)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-[#666666] hover:text-[#222222] transition-colors"
                        title={trip.isArchived ? 'Restore' : 'Archive'}>
                        {trip.isArchived ? <RotateCcw size={15} /> : <Archive size={15} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-[#222222]">
                {editTarget ? 'Edit Trip' : 'Add Trip'}
              </h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

              <Field label="School *">
                <select value={form.schoolId} onChange={set('schoolId')} required className={inputCls}>
                  <option value="">Select school</option>
                  {activeSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>

              <Field label="Bus *">
                <select value={form.busId} onChange={set('busId')} required className={inputCls}>
                  <option value="">Select bus</option>
                  {activeBuses.map(b => <option key={b.id} value={b.id}>Bus #{b.busNumber} — {b.licensePlate}</option>)}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Service Date *">
                  <input type="date" value={form.serviceDate} onChange={set('serviceDate')} required className={inputCls} />
                </Field>
                <Field label="Round *">
                  <select value={form.round} onChange={set('round')} required className={inputCls}>
                    <option value="toSchool">🏫 To School</option>
                    <option value="toHome">🏠 To Home</option>
                  </select>
                </Field>
              </div>

              <Field label="Scheduled Start">
                <input type="datetime-local" value={form.scheduledStartAt} onChange={set('scheduledStartAt')} className={inputCls} />
              </Field>

              {/* Children selector */}
              {form.schoolId && (
                <Field label={`Students (${form.childIds.length} selected)`}>
                  <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {eligibleChildren.length === 0 ? (
                      <p className="text-xs text-[#666666] px-3 py-3">No active students for this school.</p>
                    ) : (
                      eligibleChildren.map(child => (
                        <label key={child.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-orange-50/30 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.childIds.includes(child.id)}
                            onChange={() => toggleChild(child.id)}
                            className="rounded accent-[#F98C1F]"
                          />
                          <span className="text-sm text-[#222222]">{child.name}</span>
                          <span className="text-xs text-[#666666] ml-auto">{child.assignmentStatus}</span>
                        </label>
                      ))
                    )}
                  </div>
                </Field>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[#666666] hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#F98C1F] hover:bg-[#F57C00] text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Add Trip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
