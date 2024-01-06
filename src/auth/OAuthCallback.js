// AuthCallback.js
import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { getOrRenewAccessToken } from './api';

export default function OAuthCallback() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
    console.log('No user is signed in.');
    navigate('/auth/login');
  }


  useEffect(() => {
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
        (getAccessCode) => {
          console.log(getAccessCode)
        }
      );
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
}