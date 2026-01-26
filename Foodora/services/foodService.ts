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
import { Food } from '@/types/food';

const auth = getAuth();
export const foodsCollection = collection(db, 'foods');

const CLOUD_NAME = 'db7bryjma';
const UPLOAD_PRESET = 'food_upload';

export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const formData = new FormData();

    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `food-${Date.now()}.jpg`,
    } as any);

    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      console.log('Cloudinary success:', data.secure_url);
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error('Cloudinary error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const addFood = async (
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl?: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  await addDoc(foodsCollection, {
    name,
    description,
    price,
    category,
    imageUrl,
    userId: user.uid,
    createdAt: new Date().toISOString(),
  });
};

export const getFoodById = async (id: string): Promise<Food> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'foods', id);
  const foodDoc = await getDoc(ref);

  if (!foodDoc.exists()) throw new Error('Food not found');

  const data = foodDoc.data();

  return {
    id: foodDoc.id,
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    category: data.category || '',
    imageUrl: data.imageUrl,
    createdAt: data.createdAt || '',
    userId: data.userId || '',
  };
};

export const updateFood = async (
  id: string,
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl?: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'foods', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Food not found');

  const data = snap.data();
  if (data.userId !== user.uid) throw new Error('Unauthorized');

  await updateDoc(ref, {
    name,
    description,
    price,
    category,
    imageUrl,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteFood = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated.');

  const ref = doc(db, 'foods', id);
  const snap = await getDoc(ref);

  if (!snap.exists()) throw new Error('Food not found');
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized');

  await deleteDoc(ref);
};