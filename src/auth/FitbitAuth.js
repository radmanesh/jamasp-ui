/**
 * This file contains the implementation of Fitbit authentication functionality.
 * It includes functions for generating the Fitbit login URL, retrieving the Fitbit authentication state for a user,
 * and exchanging the authorization code for tokens.
 *
 * @module FitbitAuth
 * @filepath /Users/armanrad/Documents/Projects/Work/Cut/cutsocial/jamasp-ui/src/auth/FitbitAuth.js
 */
import { Timestamp, collection, deleteField, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { storeFitbitToken } from './FitbitAuthUtils';
import { getOrRenewAccessToken } from './api';

const authorizationEndpoint = 'https://www.fitbit.com/oauth2/authorize';

/**
 * Removes a device for a specific user.
 * @param {string} userId - Google user ID.
 * @returns {Promise<Object|void>} - A promise that resolves to the token object if it exists and is valid, or void if there is an error or no token.
 */
async function removeDevice(userId) {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    if (querySnapshot.size === 0) {
      throw new Error('No such document!');
    }
    const docRef = querySnapshot.docs[0];
    const usr = docRef.data();
    if (!usr) {
      throw new Error('userObj is null');
    }
    const userRef = doc(db, 'users', docRef.id);
    await updateDoc(userRef, { fitbitData: deleteField() });
  } catch (e) {
    console.error('Error removing device: ', e);
    return null;
  }
}

/**
 * Refreshes the Fitbit access token for a given user.
 * @param {string} userId - Google user ID.
 * @returns {Promise<Object|null>} - A promise that resolves to the new Fitbit access token if the refresh is successful, or null if there is an error.
 */
async function refreshFitbitToken(userId) {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    if (querySnapshot.size === 0) {
      throw new Error('No such document!');
    }
    const docRef = querySnapshot.docs[0];
    const usr = docRef.data();
    if (!usr) {
      throw new Error('userObj is null');
    }
    const token = usr.fitbitData;
    const newToken = await getOrRenewAccessToken('renew', token.refresh_token, token.code_verifier);
    if (newToken?.access_token) {
      await storeFitbitToken(userId, newToken);
      console.log('newToken is stored');
      return newToken;
    } else {
      console.log('newToken is null');
      return null;
    }
  } catch (err) {
    console.error('Error refreshing token: ', err);
    return null;
  }
}

/**
 * Retrieves the Fitbit authentication state for a given user.
 * @param {string} userId - Google user ID.
 * @returns {Promise<Object|null>} - A promise that resolves to the Fitbit access token if the user has logged in with Fitbit, or null if the user has never logged in with Fitbit.
 */
async function getFitbitAuthState(userId) {
  try {
    const querySnapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', userId)));
    if (querySnapshot.size === 0) {
      throw new Error('No such document!');
    }
    const docRef = querySnapshot.docs[0];
    const token = docRef.data().fitbitData;
    console.log('getFitbitAuthState, token: ', token);
    if (!token) {
      console.log('No Fitbit token');
      return null;
    } else if (token.user_id) {
      if (checkTokenExpiration(token)) {
        console.log('Token is expired');
        const newToken = await getOrRenewAccessToken('renew', token.refresh_token, token.code_verifier);
        if (newToken?.access_token) {
          await storeFitbitToken(userId, newToken);
        } else {
          console.log('newToken is null');
        }
      }
      console.log(token);
      return token;
    }
  } catch (e) {
    console.error('Error getting Fitbit auth state: ', e);
    return null;
  }
}

/**
 * Checks if the token has expired.
 * @param {Object} token - The token object.
 * @returns {boolean} - True if the token has expired, false otherwise.
 */
function checkTokenExpiration(token) {
  let expired = false;
  if (token?.timestamp === undefined || token?.expires_in === undefined || token?.timestamp === null || token?.expires_in === null) {
    expired = true;
  } else {
    if (token.timestamp.seconds + token.expires_in < Timestamp.now().seconds) {
      expired = true;
    }
  }
  return expired;
}

/**
 * Exchanges the authorization code for tokens.
 * @param {string} code - The authorization code obtained from the URL query parameters.
 * @param {string} code_verifier - The code verifier used for the authorization code.
 * @returns {Promise<any>} - A promise that resolves to the access code.
 */
async function exchangeCodeForTokens(code, code_verifier) {
  try {
    if (!code) {
      throw new Error('Invalid authorization code');
    }
    console.log(code);
    const getAccessCode = await getOrRenewAccessToken('get', code, code_verifier);
    console.log(getAccessCode);
    return getAccessCode;
  } catch (err) {
    console.error('Error exchanging code for tokens: ', err);
    return null;
  }
}

export {
  exchangeCodeForTokens,
  getFitbitAuthState,
  removeDevice,
  refreshFitbitToken,
};