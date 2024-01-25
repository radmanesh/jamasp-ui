import 'firebase/firestore';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { sensors } from './sensors';

// Function to get all users from Firestore
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

// Function to get all sensors id
const getAllSensorsId = () => {
    const sensorsId = sensors.map(sensor => sensor.id);
    return sensorsId;
};

// Export functions
export default getAllFitbitUsersId;
export { getAllSensorsId };
