// AuthCallback.js
import { collection, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { getOrRenewAccessToken } from './api';


async function storeFitbitToken(userId, token) {  
  console.log("storeFitbitToken");
  console.log(userId);
  console.log(token);
  if (!token.user_id) {
    console.log("token.user_id is null");
    alert("token.user_id is null");
    return;
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
        );
      }); 
    } catch (error) {
      console.error("Error adding document: ", error);
      // Handle error
    }
  }
}

export default function OAuthCallback() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (user) {
      // User is signed in.
      console.log('OAuthcallback, User is signed in.',user);
    } else {
      // No user is signed in.
      console.log('No user is signed in.');
      //navigate('/auth/login');
    }

    // Obtain the authorization code from the URL query parameters
    const code = new URLSearchParams(window.location.search).get('code');
    console.log('callback, code: ',code);

    const code_verifier = localStorage.getItem('codeVerifier');
    if (!code_verifier) {
      console.log("code_verifier is null");
      alert("code_verifier is null");
      navigate('/');
    }
    if (code) {
      // Send a POST request to exchange the authorization code for tokens
      getOrRenewAccessToken('get', code, code_verifier).then(
        (resToken) => {
          console.log(resToken);
          if (resToken.access_token) {
            localStorage.setItem("accessToken", resToken.access_token);
            localStorage.setItem("refreshToken", resToken.refresh_token);
            localStorage.setItem("fitbitUser", resToken.user_id);
            localStorage.setItem("userId", user.uid);

            storeFitbitToken(user.uid, resToken).then( () => {
              console.log("storeFitbitToken done");
              navigate('/');
            } ); // Call the function
          } else {
            console.log("getAccessCode is null");
            alert("getAccessCode is null");
            navigate('/');
          }

        }
      );
    }
  }, [navigate, user, loading]);

  return <div>Authenticating...</div>;
}