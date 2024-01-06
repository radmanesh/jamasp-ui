import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
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
      client_id: '23RHP3',
      //redirect_uri: 'http://localhost:3000/fitbit_callback',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature',
    });
    const codeState = generateRandomString(32);
    localStorage.setItem("code_state", codeState);
    params.append('state', codeState);
    return (`${authorizationEndpoint}?${params.toString()}`);
    
  } catch (error) {
    console.error("Error generating Fitbit login URL:", error);
    throw error; // Re-throw to potentially handle upstream
  }

}

const getFitbitAuthState = async function (userId) {
  console.log(userId);
  try {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      console.log("No such document!");
      return;
    }
    const dbUser = querySnapshot.docs[0].data();
    // check if user has logged in with fitbit
    if (!dbUser.fitbit_id) {
      // user has never logged in with fitbit
      console.log("No fitbit_id");
      return null;
    }

  } catch (e) {
    console.error("Error adding document: ", e);
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
export { getFitbitAuthState, exchangeCodeForTokens };
