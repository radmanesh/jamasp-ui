/**
 * This file contains the implementation of Fitbit authentication functionality.
 * It includes functions for generating the Fitbit login URL, retrieving the Fitbit authentication state for a user,
 * and exchanging the authorization code for tokens.
 * 
 * @module FitbitAuth
 * @filepath /Users/armanrad/Documents/Projects/Work/Cut/cutsocial/jamasp-ui/src/auth/FitbitAuth.js
 */
import { Timestamp, collection, deleteField, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import {  storeFitbitToken } from './FitbitAuthUtils';
import { getOrRenewAccessToken } from "./api";

export const authorizationEndpoint = 'https://www.fitbit.com/oauth2/authorize';
/**
 * Removes a device for a specific user.
 * @param {string} userId - google user.id.
 * @param {string} deviceId - fitibit user_id. The ID of the device to be removed.
 * @returns {Promise<Object|void>} - A promise that resolves to the token object if it exists and is valid, or void if there is an error or no token.
 */
async function removeDevice(userId) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    var docRef;
    if (querySnapshot.size === 0) {
      // the user has nev
      console.log("No such document!");
      return null;
    } else {
      docRef = querySnapshot.docs[0];
    }
    const usr = docRef.data();
    console.log("usr", usr);
    if (!usr) {
      console.error("userObj is null");
      return null;
    } else {
      // const { fitbitData, ...newUser } = usr;
      // console.log("new", newUser);

      const userRef = doc(db, 'users', docRef.id);
      const updaredUesr = await updateDoc(userRef, {fitbitData:deleteField()});
      console.log("new", updaredUesr);

    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

/**
 * Retrieves the Fitbit authentication state for a given user. first checks database has the fitbit token. if no token is available it should redirect to the fitbit login page. and if it needs refresh it should (better to do it in another module) refresh the token and store it in the database.
 * @param {string} userId - The ID of the google user.
 * @returns {Promise<Object|null>} - A promise that resolves to the Fitbit access token if the user has logged in with Fitbit, or null if the user has never logged in with Fitbit.
 */
const getFitbitAuthState = async function (userId) {
  //console.log(userId);
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    var docRef;
    if (querySnapshot.size === 0) {
      // the user has nev
      console.log("No such document!");
      return;
    } else {
      docRef = querySnapshot.docs[0];
    }
    const token = docRef.data().fitbitData;
    console.log("getFitbitAuthState, token: ", token);
    // check if user has logged in with fitbit
    if (!token) {
      // user has never logged in with fitbit, maybe? we should redirect to the fitbit login page. 
      console.log("No fitbit token");
      return;
    } else if (token.user_id) {
      //we should check here if there is a token and it is valid and not expired. if it is expired we should refresh it.
      if(checkTokenExpiration(token)){
        console.log("token is expired");
        const newToken = await getOrRenewAccessToken('renew', token.refresh_token, token.code_verifier);
        if(newToken?.access_token)
          storeFitbitToken(userId, newToken);
        else
          console.log("newToken is null");
      }
      console.log(token);
      return token;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return;
  }
}

function checkTokenExpiration(token) {
  const expiresAt = token.timestamp.seconds + token.expires_in;
  const currentTime = Timestamp.now().seconds;
  if (expiresAt < currentTime) {
    console.log("token is expired");
    return true;
  } else {
    console.log("token is not expired");
    return false;
  }
}

/**
 * Exchanges the authorization code for tokens.
 * @param {string} code - The authorization code obtained from the URL query parameters.
 * @param {string} code_verifier - The code verifier used for the authorization code.
 * @returns {Promise<any>} - A promise that resolves to the access code.
 */
async function exchangeCodeForTokens(code, code_verifier) {
  // Obtain the authorization code from the URL query parameters
  // const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    // Send a POST request to exchange the authorization code for tokens
    console.log(code);
    const getAccessCode = await getOrRenewAccessToken('get', code, code_verifier);
    console.log(getAccessCode);
    return getAccessCode;
    // Redirect to home page
    // window.location.replace('/');
  }
}

export { exchangeCodeForTokens, getFitbitAuthState, removeDevice };

