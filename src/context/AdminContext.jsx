import { createContext, useContext, useEffect, useState } from 'react'
import {
  watchSchools, watchParents, watchTeachers, watchDrivers,
  watchAdmins, watchChildren, watchBuses, watchTrips,
  saveSchool, setSchoolArchived,
  saveChild, setChildArchived, removeChildFromTrip,
  saveBus, setBusArchived,
  saveTrip, setTripArchived,
} from '../firebase/services/firestore'
import { manageUser } from '../firebase/services/functions'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [schools, setSchools] = useState([])
  const [parents, setParents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [admins, setAdmins] = useState([])
  const [childrenData, setChildrenData] = useState([])
  const [buses, setBuses] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSchoolId, setSelectedSchoolId] = useState('all')

  useEffect(() => {
    let loaded = 0
    const total = 8
    const onLoad = () => { loaded++; if (loaded >= total) setLoading(false) }

    const unsubs = [
      watchSchools(d => { setSchools(d); onLoad() }),
      watchParents(d => { setParents(d); onLoad() }),
      watchTeachers(d => { setTeachers(d); onLoad() }),
      watchDrivers(d => { setDrivers(d); onLoad() }),
      watchAdmins(d => { setAdmins(d); onLoad() }),
      watchChildren(d => { setChildrenData(d); onLoad() }),
      watchBuses(d => { setBuses(d); onLoad() }),
      watchTrips(d => { setTrips(d); onLoad() }),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [])

  // ── Filtered views (client-side, per selectedSchoolId) ─────────────────────

  function filterBySchool(records, schoolIdField = 'schoolId') {
    if (selectedSchoolId === 'all') return records
    return records.filter(r => r[schoolIdField] === selectedSchoolId)
  }

  const filteredSchools = selectedSchoolId === 'all'
    ? schools
    : schools.filter(s => s.id === selectedSchoolId)

  const filteredParents = selectedSchoolId === 'all'
    ? parents
    : parents.filter(p => Array.isArray(p.schoolIds) && p.schoolIds.includes(selectedSchoolId))

  const filteredTeachers = filterBySchool(teachers)
  const filteredDrivers = filterBySchool(drivers)
  const filteredChildren = filterBySchool(childrenData)
  const filteredBuses = filterBySchool(buses)
  const filteredTrips = filterBySchool(trips)

  // ── Error helpers ───────────────────────────────────────────────────────────

  function clearError() { setError(null) }

  async function withError(fn) {
    setError(null)
    try {
      return await fn()
    } catch (err) {
      setError(err.message || 'An error occurred.')
      throw err
    }
  }

  // ── Schools ─────────────────────────────────────────────────────────────────

  async function handleSaveSchool(data) {
    return withError(() => saveSchool(data))
  }

  async function handleArchiveSchool(id, archived) {
    if (archived) {
      if (teachers.some(t => t.schoolId === id && !t.isArchived)) {
        setError('Cannot archive: school has active teachers.')
        return
      }
      if (childrenData.some(c => c.schoolId === id && !c.isArchived)) {
        setError('Cannot archive: school has active students.')
        return
      }
      const openTrips = trips.filter(
        t => t.schoolId === id && !t.isArchived &&
        !['completed', 'cancelled'].includes(t.status)
      )
      if (openTrips.length > 0) {
        setError('Cannot archive: school has open trips.')
        return
      }
    }
    return withError(() => setSchoolArchived(id, archived))
  }

  // ── People (via manageUser callable) ────────────────────────────────────────

  async function handleManageUser(payload) {
    if (payload.action === 'archive') {
      if (payload.role === 'parent') {
        const hasActiveChildren = childrenData.some(
          c => c.parentId === payload.referenceId && !c.isArchived
        )
        if (hasActiveChildren) {
          setError('Cannot archive: parent has active children.')
          return
        }
      }
      if (payload.role === 'driver') {
        const isBusActive = buses.some(b => b.driverId === payload.referenceId && !b.isArchived)
        if (isBusActive) {
          setError('Cannot archive: driver is assigned to an active bus.')
          return
        }
      }
    }
    return withError(() => manageUser(payload))
  }

  // ── Children ────────────────────────────────────────────────────────────────

  async function handleSaveChild(data) {
    return withError(() => saveChild(data))
  }

  async function handleArchiveChild(child, archived) {
    return withError(() =>
      setChildArchived(child.id, archived, {
        tripId: child.tripId,
        busId: child.busId,
        parentId: child.parentId,
        schoolId: child.schoolId,
      })
    )
  }

  async function handleRemoveChildFromTrip(child) {
    return withError(() =>
      removeChildFromTrip(child.id, { tripId: child.tripId, busId: child.busId })
    )
  }

  // ── Buses ───────────────────────────────────────────────────────────────────

  async function handleSaveBus(data, prevDriverId) {
    return withError(() => saveBus(data, prevDriverId))
  }

  async function handleArchiveBus(id, archived) {
    if (archived) {
      const hasActiveChildren = childrenData.some(c => c.busId === id && !c.isArchived)
      if (hasActiveChildren) {
        setError('Cannot archive: bus has active assigned children.')
        return
      }
      const hasOpenTrips = trips.some(
        t => t.busId === id && !t.isArchived &&
        !['completed', 'cancelled'].includes(t.status)
      )
      if (hasOpenTrips) {
        setError('Cannot archive: bus has open trips.')
        return
      }
    }
    return withError(() => setBusArchived(id, archived))
  }

  // ── Trips ───────────────────────────────────────────────────────────────────

  async function handleSaveTrip(data) {
    return withError(() => saveTrip(data))
  }

  async function handleArchiveTrip(trip, archived) {
    return withError(() => setTripArchived(trip.id, archived, trip.childIds || []))
  }

  return (
    <AdminContext.Provider value={{
      // Raw data
      schools, parents, teachers, drivers, admins,
      children: childrenData, buses, trips,
      // Filtered views
      filteredSchools, filteredParents, filteredTeachers,
      filteredDrivers, filteredChildren, filteredBuses, filteredTrips,
      // State
      loading, error, clearError,
      selectedSchoolId, setSelectedSchoolId,
      // CRUD handlers
      handleSaveSchool, handleArchiveSchool,
      handleManageUser,
      handleSaveChild, handleArchiveChild, handleRemoveChildFromTrip,
      handleSaveBus, handleArchiveBus,
      handleSaveTrip, handleArchiveTrip,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdmin() {
  return useContext(AdminContext)
}
