import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from './firebase'

export const savePitch = async (userId, ideaData, pitchData) => {
  try {
    const docRef = await addDoc(collection(db, 'pitches'), {
      userId,
      ideaData,
      pitchData,
      createdAt: new Date().toISOString(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error saving pitch:', error)
    return { success: false, error: error.message }
  }
}

export const getUserPitches = async (userId) => {
  try {
    const q = query(
      collection(db, 'pitches'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const querySnapshot = await getDocs(q)
    const pitches = []
    querySnapshot.forEach((d) => {
      pitches.push({ id: d.id, ...d.data() })
    })
    return pitches
  } catch (error) {
    console.error('Error getting pitches:', error)
    return []
  }
}

export const deletePitch = async (pitchId) => {
  try {
    await deleteDoc(doc(db, 'pitches', pitchId))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
