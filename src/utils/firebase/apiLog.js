import { addDoc, collection } from 'firebase/firestore';
import {db} from '../../firebase';

export default async function addApiLog(log){
  console.log(log);
  const apiLogDocRef = await addDoc(collection(db,"api_logs"),log);
  return apiLogDocRef.id;
}