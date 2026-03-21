import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { db } from '../config'

// ─── Helpers ────────────────────────────────────────────────────────────────

function snapToDocs(snap) {
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

function genId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

// ─── Watch functions (realtime) ──────────────────────────────────────────────

export function watchSchools(callback) {
  return onSnapshot(collection(db, 'schools'), snap => callback(snapToDocs(snap)))
}

export function watchParents(callback) {
  return onSnapshot(collection(db, 'parents'), snap => callback(snapToDocs(snap)))
}

export function watchTeachers(callback) {
  return onSnapshot(collection(db, 'teachers'), snap => callback(snapToDocs(snap)))
}

export function watchDrivers(callback) {
  return onSnapshot(collection(db, 'drivers'), snap => callback(snapToDocs(snap)))
}

export function watchAdmins(callback) {
  return onSnapshot(collection(db, 'admins'), snap => callback(snapToDocs(snap)))
}

export function watchChildren(callback) {
  return onSnapshot(collection(db, 'children'), snap => callback(snapToDocs(snap)))
}

export function watchBuses(callback) {
  return onSnapshot(collection(db, 'buses'), snap => callback(snapToDocs(snap)))
}

export function watchTrips(callback) {
  return onSnapshot(collection(db, 'trips'), snap => callback(snapToDocs(snap)))
}

// ─── Schools ─────────────────────────────────────────────────────────────────

export async function saveSchool(data) {
  const id = data.id || genId('school')
  await setDoc(
    doc(db, 'schools', id),
    { ...data, id, updatedAt: serverTimestamp() },
    { merge: true }
  )
  return id
}

export async function setSchoolArchived(id, archived) {
  await updateDoc(doc(db, 'schools', id), {
    isArchived: archived,
    archivedAt: archived ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })
}

// ─── Children ────────────────────────────────────────────────────────────────

export async function saveChild(data) {
  const childId = data.id || genId('child')
  const prevParentId = data._prevParentId  // pass from UI if editing
  const newParentId = data.parentId
  const schoolId = data.schoolId

  await runTransaction(db, async (tx) => {
    const childRef = doc(db, 'children', childId)
    const newParentRef = doc(db, 'parents', newParentId)

    // Build child payload
    const childPayload = {
      ...data,
      id: childId,
      qrCodeValue: data.qrCodeValue || `SKS-CHILD-${childId}`,
      assignmentStatus: data.assignmentStatus || 'pending',
      updatedAt: serverTimestamp(),
    }
    delete childPayload._prevParentId

    tx.set(childRef, childPayload, { merge: true })

    // If parent changed, update old parent's childIds
    if (prevParentId && prevParentId !== newParentId) {
      const oldParentRef = doc(db, 'parents', prevParentId)
      tx.update(oldParentRef, {
        childIds: arrayRemove(childId),
        updatedAt: serverTimestamp(),
      })
    }

    // Update new parent's childIds and schoolIds
    tx.update(newParentRef, {
      childIds: arrayUnion(childId),
      schoolIds: arrayUnion(schoolId),
      updatedAt: serverTimestamp(),
    })
  })

  return childId
}

export async function setChildArchived(childId, archived, { tripId, busId } = {}) {
  await runTransaction(db, async (tx) => {
    const childRef = doc(db, 'children', childId)

    const childUpdate = {
      isArchived: archived,
      archivedAt: archived ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    }

    if (archived) {
      // Reset assignment state
      childUpdate.tripId = null
      childUpdate.busId = null
      childUpdate.assignmentStatus = 'pending'
      childUpdate.hasBoarded = false
      childUpdate.hasArrived = false

      // Remove from trip
      if (tripId) {
        const tripRef = doc(db, 'trips', tripId)
        tx.update(tripRef, {
          childIds: arrayRemove(childId),
          updatedAt: serverTimestamp(),
        })
      }

      // Remove from bus
      if (busId) {
        const busRef = doc(db, 'buses', busId)
        tx.update(busRef, {
          childIds: arrayRemove(childId),
          updatedAt: serverTimestamp(),
        })
      }

      // Sync parent.schoolIds if no more children at this school
      // (simplified: we just leave schoolIds — full sync would require reading all children)
    }

    tx.update(childRef, childUpdate)
  })
}

export async function removeChildFromTrip(childId, { tripId, busId } = {}) {
  await runTransaction(db, async (tx) => {
    const childRef = doc(db, 'children', childId)

    tx.update(childRef, {
      tripId: null,
      busId: null,
      assignmentStatus: 'pending',
      hasBoarded: false,
      hasArrived: false,
      updatedAt: serverTimestamp(),
    })

    if (tripId) {
      tx.update(doc(db, 'trips', tripId), {
        childIds: arrayRemove(childId),
        updatedAt: serverTimestamp(),
      })
    }

    if (busId) {
      tx.update(doc(db, 'buses', busId), {
        childIds: arrayRemove(childId),
        updatedAt: serverTimestamp(),
      })
    }
  })
}

// ─── Buses ───────────────────────────────────────────────────────────────────

export async function saveBus(data, prevDriverId) {
  const busId = data.id || genId('bus')
  const newDriverId = data.driverId || null

  await runTransaction(db, async (tx) => {
    const busRef = doc(db, 'buses', busId)

    const busPayload = {
      ...data,
      id: busId,
      status: data.status || 'waiting',
      childIds: data.childIds || [],
      updatedAt: serverTimestamp(),
    }

    tx.set(busRef, busPayload, { merge: true })

    // Clear old driver's busId
    if (prevDriverId && prevDriverId !== newDriverId) {
      tx.update(doc(db, 'drivers', prevDriverId), {
        busId: null,
        updatedAt: serverTimestamp(),
      })
    }

    // Set new driver's busId
    if (newDriverId) {
      tx.update(doc(db, 'drivers', newDriverId), {
        busId: busId,
        updatedAt: serverTimestamp(),
      })
    }
  })

  return busId
}

export async function setBusArchived(busId, archived) {
  await updateDoc(doc(db, 'buses', busId), {
    isArchived: archived,
    archivedAt: archived ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })
}

// ─── Trips ───────────────────────────────────────────────────────────────────

export async function saveTrip(data) {
  const tripId = data.id || genId('trip')
  const serviceDateKey = data.serviceDate
    ? new Date(data.serviceDate).toISOString().substring(0, 10)
    : null

  await runTransaction(db, async (tx) => {
    const tripRef = doc(db, 'trips', tripId)

    const tripPayload = {
      ...data,
      id: tripId,
      serviceDateKey,
      status: data.status || 'draft',
      childIds: data.childIds || [],
      stops: data.stops || [],
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt || serverTimestamp(),
    }

    tx.set(tripRef, tripPayload, { merge: true })

    // Sync assignment status for added children
    for (const childId of (data.childIds || [])) {
      const childRef = doc(db, 'children', childId)
      tx.update(childRef, {
        tripId: tripId,
        busId: data.busId || null,
        assignmentStatus: 'assigned',
        updatedAt: serverTimestamp(),
      })
    }
  })

  return tripId
}

export async function setTripArchived(tripId, archived, childIds = []) {
  await runTransaction(db, async (tx) => {
    const tripRef = doc(db, 'trips', tripId)

    tx.update(tripRef, {
      isArchived: archived,
      archivedAt: archived ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    })

    if (archived) {
      // Unassign all children
      for (const childId of childIds) {
        const childRef = doc(db, 'children', childId)
        tx.update(childRef, {
          tripId: null,
          busId: null,
          assignmentStatus: 'pending',
          hasBoarded: false,
          hasArrived: false,
          updatedAt: serverTimestamp(),
        })
      }
    }
  })
}
