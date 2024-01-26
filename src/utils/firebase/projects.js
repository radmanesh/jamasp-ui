import { projectID } from 'firebase-functions/params';
import { app, db, auth } from '/firebase';
import { serverTimestamp } from 'firebase/firestore';

const updateRateLimit = (uid, rateLimit) => {
  console.log("updateRateLimit: ", uid, rateLimit);
  // db.collection('users').doc(uid).update({
  //   rateLimit: rateLimit
  // })
}
const createAPIEndpoinLogPendingEndtry = async (project, device, endpoint , sensor, sensorDownloadSettong ,axioConfig, uuid, uid) => {
  // const apiRequestLogDBI =  {
  //   projectId: project.id,
  //   projectOwnerId: project.userId,
  //   userId: auth.currentUser.uid,
  //   date: Date.now(),
  //   endpoint: endpoint,
  //   projectName: project.name,
  //   downloadSettings: project.downloadSettings,
  //   devices: project.devices,
  //   requests: [], //requests.
  //   responses: [] //results.
  // };
  const apiEndopintLog = {
    projectId: project.id,
    //projectOwnerId: project.userId,
    userId: uuid,
    divice: device,
    endpoint: endpoint,
    sensor: sensor,
    sensorDownloadSettong: sensorDownloadSettong,
    status: 'pending',
    timestamp: serverTimestamp(),
    axioConfig: axioConfig 
  }
  let apiLogRef = db.commection('apiLogs').doc();
  await apiLogRef.set(apiEndopintLog);
  return apiLogRef;
}

export { updateRateLimit };
