import { useState } from 'react'
import { Pencil, Archive, RotateCcw, X, GraduationCap } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'

const EMPTY = {
  id: '', name: '', parentId: '', schoolId: '',
  homeAddress: '', pickupLabel: '', pickupLat: '', pickupLng: '',
  gradeLevel: '', emergencyContactName: '', emergencyContactPhone: '',
  photoUrl: '',
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

function AssignmentBadge({ status }) {
  const cfg = {
    assigned: 'bg-green-100 text-green-700',
    pending: 'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg[status] || cfg.pending}`}>
      {status || 'pending'}
    </span>
  )
}

export default function StudentsTab() {
  const {
    filteredChildren, parents, schools, error, clearError,
    handleSaveChild, handleArchiveChild,
  } = useAdmin()

  const [showArchived, setShowArchived] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const visible = filteredChildren.filter(c => showArchived ? c.isArchived : !c.isArchived)

  const activeParents = parents.filter(p => !p.isArchived)
  const activeSchools = schools.filter(s => !s.isArchived)

  function openCreate() {
    setForm(EMPTY)
    setEditTarget(null)
    setModalOpen(true)
  }

  function openEdit(child) {
    setForm({ ...EMPTY, ...child, _prevParentId: child.parentId })
    setEditTarget(child)
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
      await handleSaveChild(form)
      closeModal()
    } finally {
      setSaving(false)
    }
  }

  async function toggleArchive(child) {
    await handleArchiveChild(child, !child.isArchived)
  }

  const parentName = id => activeParents.find(p => p.id === id)?.name || '—'
  const schoolName = id => activeSchools.find(s => s.id === id)?.name || '—'

  return (
    <div className="p-6">
      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-[#F98C1F]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222222]">Students</h2>
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
            + Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {visible.length === 0 ? (
          <div className="text-center py-16 text-[#666666]">
            <GraduationCap size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No students found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F5EDE3]">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-[#222222]">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden md:table-cell">Parent</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">School</th>
                <th className="text-left px-4 py-3 font-semibold text-[#222222] hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-[#222222]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map(child => (
                <tr key={child.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#222222]">
                    {child.name}
                    {child.isArchived && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">archived</span>
                    )}
                    {child.gradeLevel && (
                      <span className="ml-2 text-xs text-[#666666]">Gr.{child.gradeLevel}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#666666] hidden md:table-cell">{parentName(child.parentId)}</td>
                  <td className="px-4 py-3 text-[#666666] hidden lg:table-cell">{schoolName(child.schoolId)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <AssignmentBadge status={child.assignmentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(child)}
                        className="p-1.5 hover:bg-orange-100 rounded-lg text-[#666666] hover:text-[#F98C1F] transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => toggleArchive(child)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-[#666666] hover:text-[#222222] transition-colors"
                        title={child.isArchived ? 'Restore' : 'Archive'}>
                        {child.isArchived ? <RotateCcw size={15} /> : <Archive size={15} />}
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
                {editTarget ? 'Edit Student' : 'Add Student'}
              </h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <Field label="Student Name *" value={form.name} onChange={set('name')} required placeholder="Full name" />
              <Field label="Grade Level" value={form.gradeLevel} onChange={set('gradeLevel')} placeholder="e.g. 3" />

              <Field label="Parent *">
                <select value={form.parentId} onChange={set('parentId')} required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]">
                  <option value="">Select parent</option>
                  {activeParents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>

              <Field label="School *">
                <select value={form.schoolId} onChange={set('schoolId')} required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98C1F]">
                  <option value="">Select school</option>
                  {activeSchools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>

              <Field label="Home Address" value={form.homeAddress} onChange={set('homeAddress')} placeholder="Full address" />
              <Field label="Pickup Label" value={form.pickupLabel} onChange={set('pickupLabel')} placeholder="e.g. Gate 3 – Sukhumvit Soi 22" />

              <div className="grid grid-cols-2 gap-3">
                <Field label="Pickup Lat" value={form.pickupLat} onChange={set('pickupLat')} placeholder="13.7563" />
                <Field label="Pickup Lng" value={form.pickupLng} onChange={set('pickupLng')} placeholder="100.5018" />
              </div>

              <Field label="Emergency Contact Name" value={form.emergencyContactName} onChange={set('emergencyContactName')} placeholder="Guardian name" />
              <Field label="Emergency Contact Phone" value={form.emergencyContactPhone} onChange={set('emergencyContactPhone')} placeholder="+66 8X XXX XXXX" />
              <Field label="Photo URL" value={form.photoUrl} onChange={set('photoUrl')} placeholder="https://..." />

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[#666666] hover:bg-gray-50 text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#F98C1F] hover:bg-[#F57C00] text-white rounded-xl py-2.5 font-semibold text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
