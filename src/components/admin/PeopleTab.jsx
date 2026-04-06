import { useState } from 'react'
import { Pencil, Archive, RotateCcw, X, Users } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const SUBTABS = ['Parents', 'Teachers', 'Drivers']

const EMPTY = {
  uid: '', referenceId: '',
  name: '', email: '', password: '',
  phone: '', licenseNumber: '',
  busId: '', schoolId: '',
}

function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 flex items-center justify-between text-sm">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 text-red-400 hover:text-red-600"><X size={16} /></button>
    </div>
  )
}

function Field({ label, value, onChange, required, placeholder, type = 'text', children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#666666] mb-1">{label}</label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]"
        />
      )}
    </div>
  )
}

function Badge({ archived }) {
  if (!archived) return null
  return <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">archived</span>
}

export default function PeopleTab() {
  const {
    filteredParents, filteredTeachers, filteredDrivers,
    schools, buses, error, clearError, handleManageUser,
  } = useAdmin()

  const [subtab, setSubtab] = useState('Parents')
  const [showArchived, setShowArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const role = subtab.toLowerCase().slice(0, -1) // 'parent' | 'teacher' | 'driver'

  const dataMap = {
    Parents: filteredParents,
    Teachers: filteredTeachers,
    Drivers: filteredDrivers,
  }

  const people = dataMap[subtab] || []
  const visible = people.filter(p => showArchived ? p.isArchived : !p.isArchived)

  function openCreate() {
    setForm(EMPTY)
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(person) {
    setForm({ ...EMPTY, ...person, password: '' })
    setEditTarget(person)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditTarget(null)
  }

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        action: editTarget ? 'update' : 'create',
        role,
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        schoolId: form.schoolId || undefined,
        busId: form.busId || undefined,
        licenseNumber: form.licenseNumber || undefined,
      }
      if (!editTarget) {
        payload.password = form.password
      }
      if (editTarget) {
        payload.uid = editTarget.uid || editTarget.id
        payload.referenceId = editTarget.referenceId || editTarget.id
      }
      await handleManageUser(payload)
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchive(person) {
    const action = person.isArchived ? 'restore' : 'archive'
    await handleManageUser({
      action,
      role,
      uid: person.uid || person.id,
      referenceId: person.referenceId || person.id,
    })
  }

  const activeSchools = schools.filter(s => !s.isArchived)
  const activeBuses = buses.filter(b => !b.isArchived)

  return (
    <div className="p-6">
      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Users size={20} className="text-[#F98C1F]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222222]">People</h2>
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
            + Add {subtab.slice(0, -1)}
          </button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {SUBTABS.map(tab => (
          <button
            key={tab}
            onClick={() => setSubtab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              subtab === tab ? 'bg-white text-[#F98C1F] shadow-sm' : 'text-[#666666] hover:text-[#222222]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-[#666666]">
            <Users size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No {subtab.toLowerCase()} found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5EDE3]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#222222]">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden md:table-cell">Email</th>
                {subtab === 'Teachers' && (
                  <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">School</th>
                )}
                {subtab === 'Drivers' && (
                  <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">Bus</th>
                )}
                <th className="text-right px-4 py-3 font-semibold text-[#222222]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(person => {
                const schoolName = activeSchools.find(s => s.id === person.schoolId)?.name
                const busNumber = activeBuses.find(b => b.id === person.busId)?.busNumber
                return (
                  <tr key={person.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#222222]">
                      {person.name}
                      <Badge archived={person.isArchived} />
                    </td>
                    <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{person.email}</td>
                    {subtab === 'Teachers' && (
                      <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{schoolName || '—'}</td>
                    )}
                    {subtab === 'Drivers' && (
                      <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">
                        {busNumber ? `Bus #${busNumber}` : '—'}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(person)}
                          className="p-1.5 hover:bg-orange-100 rounded-lg text-[#666666] hover:text-[#F98C1F] transition-colors" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => toggleArchive(person)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-[#666666] hover:text-[#222222] transition-colors"
                          title={person.isArchived ? 'Restore' : 'Archive'}>
                          {person.isArchived ? <RotateCcw size={15} /> : <Archive size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
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
                {editTarget ? `Edit ${subtab.slice(0, -1)}` : `Add ${subtab.slice(0, -1)}`}
              </h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <Field label="Full Name *" value={form.name} onChange={set('name')} required placeholder="Full name" />
              <Field label="Email *" value={form.email} onChange={set('email')} required placeholder="email@example.com" type="email" />
              {!editTarget && (
                <Field label="Password *" value={form.password} onChange={set('password')} required placeholder="Min 6 characters" type="password" />
              )}
              {(subtab === 'Parents' || subtab === 'Drivers') && (
                <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+66 8X XXX XXXX" />
              )}
              {subtab === 'Drivers' && (
                <Field label="License Number" value={form.licenseNumber} onChange={set('licenseNumber')} placeholder="License number" />
              )}
              {subtab === 'Teachers' && (
                <Field label="School *">
                  <select
                    value={form.schoolId}
                    onChange={set('schoolId')}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]"
                  >
                    <option value="">Select school</option>
                    {activeSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
              )}
              {subtab === 'Drivers' && (
                <Field label="Assign Bus">
                  <select
                    value={form.busId}
                    onChange={set('busId')}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]"
                  >
                    <option value="">No bus assigned</option>
                    {activeBuses.map(b => <option key={b.id} value={b.id}>Bus #{b.busNumber} — {b.licensePlate}</option>)}
                  </select>
                </Field>
              )}
              {subtab === 'Drivers' && (
                <Field label="School *">
                  <select
                    value={form.schoolId}
                    onChange={set('schoolId')}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]"
                  >
                    <option value="">Select school</option>
                    {activeSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[#666666] hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#F98C1F] hover:bg-[#F57C00] text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : `Add ${subtab.slice(0, -1)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
