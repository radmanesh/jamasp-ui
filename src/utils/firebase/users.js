import { db } from '../../firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";



const fetchAllFitBitUsers = async () => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("fitbitData", "!=", null));
  const querySnapshot = await getDocs(q);
  return Promise.all(querySnapshot.docs.map(doc => doc.data()));
};

const getFitBitUserByUid = async (uid) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  return Promise.all(querySnapshot.docs.map(doc => doc.data()));
};

const getAllFitbitUsersId = async () => {
    try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("fitbitData", "!=", null));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => doc.data().fitbitData.user_id);
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

const updateUserFitBitProfile = async (uid, profile) => {
  
}

export { fetchAllFitBitUsers as fetchFitBitUsers, getFitBitUserByUid as fettchFitBitUser, getAllFitbitUsersId };// 
