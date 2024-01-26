import 'firebase/firestore';
import { sensors } from './sensors';

// Function to get all sensors id
const getAllSensorsId = () => {
    const sensorsId = sensors.map(sensor => sensor.id);
    return sensorsId;
};

// Export functions
export { getAllSensorsId };
