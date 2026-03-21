import { httpsCallable } from 'firebase/functions'
import { functions } from '../config'

const manageUserFn = httpsCallable(functions, 'manageUser')

/**
 * Call the manageUser Cloud Function.
 * @param {{ action: 'create'|'update'|'archive'|'restore', role: string, uid?: string, referenceId?: string, name?: string, email?: string, phone?: string, licenseNumber?: string, password?: string, busId?: string, schoolId?: string }} payload
 * @returns {Promise<{ uid?: string, referenceId?: string, ok?: boolean }>}
 */
export async function manageUser(payload) {
  const result = await manageUserFn(payload)
  return result.data
}
