import { collection, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { authorizationEndpoint } from "./FitbitAuth";
import { fitbit } from '../utils/settings';

/**
 * Stores the Fitbit token for a user.
 * 
 * @param {string} userId - The ID of the user.
 * @param {object} token - The Fitbit token to store.
 * @returns {void}
 */
export async function storeFitbitToken(userId, token) {
  //console.log("storeFitbitToken");
  //console.log(userId);
  //console.log(token);
  if (!token.user_id) {
    console.log("token.user_id is null");
    alert("token.user_id is null");
    return null;
  } else {
    try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        updateDoc(doc.ref,
          {
            fitbitData: {
              ...token,
              timestamp: serverTimestamp()
            }
          }
        ).then((res) => {
          console.log("Document successfully updated!", res);
          return doc.ref;

        }).catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });

      });
    } catch (error) {
      console.error("Error adding document: ", error);
      return null;
      // Handle error
    }
  }
}
// const apiEndpoint = 'https://api.fitbit.com/oauth2/token';
/**
 * Generates a random integer within a specified range.
 * @param {number} range - The range within which the random integer should be generated.
 * @returns {number} - The randomly generated integer.
 */
export function getRandomInteger(range) {
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
/**
 * Generates a random string of the specified length.
 * @param {number} length - The length of the random string to generate.
 * @returns {string} The generated random string.
 */
export function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(getRandomInteger(possible.length - 1));
  }
  return text;
}
/**
 * Generates a code challenge for the Fitbit authentication flow.
 *
 * @param {string} codeVerifier - The code verifier used to generate the code challenge.
 * @returns {Promise<string>} The generated code challenge.
 * @throws {Error} If the context/environment is not secure or does not support the 'crypto.subtle' module.
 */
export async function generateCodeChallenge(codeVerifier) {
  try {
    if (!window.crypto.subtle?.digest) {
      throw new Error(
        "The context/environment is not secure, and does not support the 'crypto.subtle' module. See: https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle for details"
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
export async function generateFitbitLoginUrl() {
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
 * Returns the Fitbit token for a user.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {object} - The Fitbit token for the user.
 */
const getUserIdByFitbitId = async (fitbitUserId) => {
	try {
		const q = query(collection(db, "users"), where("fitbitData.user_id", "==", fitbitUserId));
		const querySnapshot = await getDocs(q);
		var docRef;
		if (querySnapshot.size === 0) {
			// the user has nev
			console.log("No such document!");
			return null;
		} else {
			docRef = querySnapshot.docs[0];
		}
    const userId = docRef.data().uid;
    console.log("userId: ", userId);
    return userId;
	} catch (e) {
		console.error("Error adding document: ", e);
		return null;
	}
};

export { getUserIdByFitbitId };
