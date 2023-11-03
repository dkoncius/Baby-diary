import { 
  doc, getDocs, collection, query, 
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { 
  setUser, 
  setLoading, 
  setHasKids,
  setKidsList, 
  setMemoryList 
} from './userActions';

// Async action to check if user has kids
const checkIfUserHasKids = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const kidsCollection = collection(userDocRef, 'kids');
    const q = query(kidsCollection);
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user has kids:', error);
    return false;
  }
};

// Utility function to fetch kids data
export const fetchKidsData = async (userId) => {
  const kidsData = [];
  try {
    const userDocRef = doc(db, 'users', userId);
    const kidsCollection = collection(userDocRef, 'kids');
    const querySnapshot = await getDocs(kidsCollection);
    querySnapshot.forEach((doc) => {
      kidsData.push({
        kidId: doc.id,   // Adding kid's id here
        ...doc.data()
      });
    });
  } catch (error) {
    console.error('Error fetching kids data:', error);
  }
  return kidsData;
};


// Utility function to fetch memories for a specific kid
export const fetchMemoriesForKid = async (userId, kidId) => {
  const memories = [];
  if (!kidId) {
    console.error('Kid ID is not defined.');
    return memories;
  }
  try {
    const userDocRef = doc(db, 'users', userId);
    console.log("userDocRef:", userDocRef);

    const kidsDocRef = doc(userDocRef, 'kids', kidId);
    console.log("kidId:", kidId);

    const memoriesCollection = collection(kidsDocRef, 'memories');
    const querySnapshot = await getDocs(memoriesCollection);
    querySnapshot.forEach((doc) => {
      memories.push(doc.data());
    });
  } catch (error) {
    console.error('Error fetching memories:', error);
  }
  return memories;
};


// Async action to fetch user data, kids and their memories
export const fetchUser = () => async (dispatch) => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
      dispatch(setUser(userData));
      
      const hasKidsStatus = await checkIfUserHasKids(user.uid);
      dispatch(setHasKids(hasKidsStatus));

      if (hasKidsStatus) {
        const kidsData = await fetchKidsData(user.uid);
        dispatch(setKidsList(kidsData));
        
        for (const kid of kidsData) {
          const memories = await fetchMemoriesForKid(user.uid, kid.kidId);
          dispatch(setMemoryList(kid.kidId, memories));
        }
      }
      
    } else {
      dispatch(setUser(null));
    }
    dispatch(setLoading(false));
  });

  return unsubscribe;
};
