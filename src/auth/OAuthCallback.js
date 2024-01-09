// AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { getOrRenewAccessToken } from './api';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';


function storeFitbitToken(userId, token) {  
  console.log("storeFitbitToken");
  console.log(userId);
  console.log(token);
  if(!token.user_id){
    console.log("token.user_id is null");
    alert("token.user_id is null");
    return;
  }else{
    try {
      const docRef = doc(db, 'users', userId);
      setDoc(docRef, 
        {...token ,
          timestamp: serverTimestamp() 
        }, 
        { merge: true }
      );
      
    } catch (error) {
      
    }
    
  }


}

export default function OAuthCallback() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  
  
  useEffect(() => {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
      console.log('No user is signed in.');
      navigate('/auth/login');
    }

    const code_verifier = localStorage.getItem('codeVerifier');
    if (!code_verifier) {
      console.log("code_verifier is null");
      alert("code_verifier is null");
      navigate('/');
    }
    // Obtain the authorization code from the URL query parameters
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      // Send a POST request to exchange the authorization code for tokens
      console.log(code);
      getOrRenewAccessToken('get', code, code_verifier).then(
        (resToken) => {
          console.log(resToken);
          if (resToken.accessToken) {
            localStorage.setItem("accessToken", resToken.accessToken);
            localStorage.setItem("refreshToken", resToken.refreshToken);
            localStorage.setItem("userId", user.uid);

            storeFitbitToken(user.uid, resToken); // Call the function
          } else {
            console.log("getAccessCode is null");
            alert("getAccessCode is null");
            navigate('/');
          }

        }
      );
    }
  }, [navigate, user]);

  return <div>Authenticating...</div>;
}