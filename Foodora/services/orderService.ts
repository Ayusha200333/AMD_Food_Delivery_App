import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '@/types/order';

const auth = getAuth();
export const ordersCollection = collection(db, 'orders');  

export const addOrder = async (
  items: string[],
  total: number,
  isDelivered: boolean = false
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  await addDoc(ordersCollection, {
    items,
    total,
    isDelivered,
    userId: user.uid,
    placedAt: new Date().toISOString()
  });
};

export const getOrderById = async (id: string): Promise<Order> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'orders', id);
  const orderDoc = await getDoc(ref);

  if (!orderDoc.exists()) throw new Error('Order not found');

  const data = orderDoc.data();
  if (data.userId !== user.uid) throw new Error('Unauthorized');

  return {
    id: orderDoc.id,
    items: data.items || [],
    total: data.total || 0,
    isDelivered: data.isDelivered || false,
    placedAt: data.placedAt || '',
    userId: data.userId || ''
  };
};

export const updateOrder = async (
  id: string,
  items: string[],
  total: number,
  isDelivered?: boolean
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'orders', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Order not found');

  const data = snap.data();
  if (data.userId !== user.uid) throw new Error('Unauthorized');

  await updateDoc(ref, {
    items,
    total,
    isDelivered: isDelivered ?? data.isDelivered,
    updatedAt: new Date().toISOString()
  });
};

export const deleteOrder = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'orders', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Order not found');
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized');

  await deleteDoc(ref);
};

export const completeOrder = async (id: string, isDelivered: boolean = true): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'orders', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Order not found');
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized');

  await updateDoc(ref, { isDelivered });
};