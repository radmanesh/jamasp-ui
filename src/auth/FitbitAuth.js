/**
 * This file contains the implementation of Fitbit authentication functionality.
 * It includes functions for generating the Fitbit login URL, retrieving the Fitbit authentication state for a user,
 * and exchanging the authorization code for tokens.
 * 
 * @module FitbitAuth
 * @filepath /Users/armanrad/Documents/Projects/Work/Cut/cutsocial/jamasp-ui/src/auth/FitbitAuth.js
 */
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { fitbit } from "../utils/settings";
import { getOrRenewAccessToken } from "./api";

const authorizationEndpoint = 'https://www.fitbit.com/oauth2/authorize';
// const apiEndpoint = 'https://api.fitbit.com/oauth2/token';

function getRandomInteger(range) {
  const maxRange = 256; // Highest possible number in Uint8

  // Create byte array and fill with 1 random number
  const byteArray = new Uint8Array(1);
  // This is the new, and safer API than Math.Random()
  window.crypto.getRandomValues(byteArray);

  // If the generated number is out of range, try again
  if (byteArray[0] >= Math.floor(maxRange / range) * range) {
    return getRandomInteger(range);
  }
  return byteArray[0] % range;
}

function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(getRandomInteger(possible.length - 1));
  }
  return text;
}

//
//  PKCE Code Challenge = base64url(hash(codeVerifier))
//
async function generateCodeChallenge(codeVerifier) {
  try {
    if (!window.crypto.subtle?.digest) {
      throw new Error(
        "The context/environment is not secure, and does not support the 'crypto.subtle' module. See: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle for details",
      );
    }
    const encoder = new TextEncoder();
    // Encode the verifier to a byteArray
    const bytes = encoder.encode(codeVerifier);
    // sha256 hash it
    const hash = await window.crypto.subtle.digest("SHA-256", bytes);
    const hashString = String.fromCharCode(...new Uint8Array(hash));
    // Base64 encode the verifier hash
    const base64 = btoa(hashString);
    // Base64Url encode the base64 encoded string, making it safe as a query param
    return base64
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  } catch (error) {
    console.error("Error generating code challenge:", error);
    throw error; // Re-throw to potentially handle upstream
  }
}

/**
 * Removes a device for a specific user.
 * @param {string} userId - google user.id.
 * @param {string} deviceId - fitibit user_id. The ID of the device to be removed.
 * @returns {Promise<Object|void>} - A promise that resolves to the token object if it exists and is valid, or void if there is an error or no token.
 */
async function removeDevice(userId, deviceId) { 
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
    const userObj = docRef.data();
    console.log("userObj", userObj);
    console.log("getFitbitAuthState, token: ",userObj?.fitbitData?.access_token);
    // check if user has logged in with fitbit
    if (!userObj.fitbitData) {
      // user has never logged in with fitbit, maybe? we should redirect to the fitbit login page. 
      console.log("No fitbit token");
      return;
    } else {
      // we should remove the device from the user's devices list
      try {
        const { fitbitData , ...newUser} = userObj;
        console.log("new", newUser);
        // update the user
        await updateDoc(docRef, { ...newUser});
        console.log("Document successfully updated!");
        return newUser;        
      } catch (error) {
        console.error("Error removing device:", error); 
      }
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

/**
 * Generates the Fitbit login URL.
 * @returns {string} The Fitbit login URL.
 * @throws {Error} If there is an error generating the Fitbit login URL.
 */
async function generateFitbitLoginUrl() {
  try {
    const codeVerifier = generateRandomString(96);
    localStorage.setItem("codeVerifier", codeVerifier);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("code_challenge", codeChallenge);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: fitbit.clientId,
      //redirect_uri: 'http://localhost:3000/fitbit_callback',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature',
    });
    const codeState = generateRandomString(32);
    localStorage.setItem("code_state", codeState);
    params.append('state', codeState);
    console.log('generateFitbitLoginUrl, params: ', params.toString());
    return (`${authorizationEndpoint}?${params.toString()}`);

  } catch (error) {
    console.error("Error generating Fitbit login URL:", error);
    throw error; // Re-throw to potentially handle upstream
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
    console.log("getFitbitAuthState, token: ",token);
    // check if user has logged in with fitbit
    if (!token) {
      // user has never logged in with fitbit, maybe? we should redirect to the fitbit login page. 
      console.log("No fitbit token");
      return;
    } else if (token.user_id) {
      //we should check here if there is a token and it is valid and not expired.
      console.log(token);
      return token;
    }
  } catch (e) {
    console.error("Error adding document: ", e);
    return;
  }
}

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

export default generateFitbitLoginUrl;
export { exchangeCodeForTokens, getFitbitAuthState ,removeDevice };

