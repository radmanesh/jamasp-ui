// AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, storeFitbitToken } from '../firebase';
import { getOrRenewAccessToken } from './api';

export default function OAuthCallback() {
  const [fitbitToken, setFitbitToken] = React.useState(null); // [1
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
        (resToken) => {
          console.log(resToken);
          if (resToken.accessToken) {
            localStorage.setItem("accessToken", resToken.accessToken);
            localStorage.setItem("refreshToken", resToken.refreshToken);
            localStorage.setItem("userId", user.uid);
            setFitbitToken(resToken);
            storeFitbitToken(user.uid, resToken.accessToken); // Call the function
          } else {
            console.log("getAccessCode is null");
            alert("getAccessCode is null");
            navigate('/');
          }

        }
      );
    }
  }, [navigate, user.uid]);

  return <div>Authenticating...</div>;
}