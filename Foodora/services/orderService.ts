import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { db } from './firebase'

const auth = getAuth()
const ordersCollection = collection(db, 'orders')

export const addOrder = async (
  items: string[],
  total: number,
  isDelivered: boolean = false
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  await addDoc(ordersCollection, {
    items,
    total,
    isDelivered,
    userId: user.uid,
    placedAt: new Date().toISOString()
  })
}

export const getAllOrders = async () => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    ordersCollection,
    where('userId', '==', user.uid),
    orderBy('placedAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(dataSet => {
    const data = dataSet.data()
    return {
      id: dataSet.id,
      items: data.items as string[],
      total: data.total as number,
      isDelivered: (data.isDelivered as boolean) || false,
      placedAt: data.placedAt as string
    }
  })
}

export const getOrderById = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'orders', id)
  const orderDoc = await getDoc(ref)

  if (!orderDoc.exists()) throw new Error('Order not found')

  const data = orderDoc.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')

  return {
    id: orderDoc.id,
    items: data.items || [],
    total: data.total || 0,
    isDelivered: data.isDelivered || false,
    placedAt: data.placedAt || ''
  }
}

export const updateOrder = async (
  id: string,
  items: string[],
  total: number,
  isDelivered?: boolean
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'orders', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Order not found')

  const data = snap.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, {
    items,
    total,
    isDelivered: isDelivered ?? data.isDelivered
  })
}

export const deleteOrder = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'orders', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Order not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await deleteDoc(ref)
}

export const completeOrder = async (id: string, isDelivered: boolean = true) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'orders', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Order not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, { isDelivered })
}

export const getAllOrdersByStatus = async (isDelivered: boolean) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    ordersCollection,
    where('userId', '==', user.uid),
    where('isDelivered', '==', isDelivered),
    orderBy('placedAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      items: data.items as string[],
      total: data.total as number,
      isDelivered: (data.isDelivered as boolean) || false,
      placedAt: data.placedAt as string
    }
  })
}