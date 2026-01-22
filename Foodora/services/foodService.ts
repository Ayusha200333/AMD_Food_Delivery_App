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
const foodsCollection = collection(db, 'foods')

export const addFood = async (
  name: string,
  description: string,
  price: number,
  category: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  await addDoc(foodsCollection, {
    name,
    description,
    price,
    category,
    userId: user.uid,
    createdAt: new Date().toISOString()
  })
}

export const getAllFoods = async () => {
  const q = query(
    foodsCollection,
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(dataSet => {
    const data = dataSet.data()
    return {
      id: dataSet.id,
      name: data.name as string,
      description: data.description as string,
      price: data.price as number,
      category: data.category as string,
      createdAt: data.createdAt as string
    }
  })
}

export const getFoodById = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'foods', id)
  const foodDoc = await getDoc(ref)

  if (!foodDoc.exists()) throw new Error('Food not found')

  const data = foodDoc.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')

  return {
    id: foodDoc.id,
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || '',
    createdAt: data.createdAt || ''
  }
}

export const updateFood = async (
  id: string,
  name: string,
  description: string,
  price: number,
  category: string
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'foods', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Food not found')

  const data = snap.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')

  await updateDoc(ref, {
    name,
    description,
    price,
    category
  })
}

export const deleteFood = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'foods', id)
  const snap = await getDoc(ref)

  if (!snap.exists()) throw new Error('Food not found')
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')

  await deleteDoc(ref)
}

export const getAllFoodsByCategory = async (category: string) => {
  const q = query(
    foodsCollection,
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      name: data.name as string,
      description: data.description as string,
      price: data.price as number,
      category: data.category as string,
      createdAt: data.createdAt as string
    }
  })
}