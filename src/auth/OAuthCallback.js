// AuthCallback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Obtain the authorization code from the URL query parameters
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      // Send a POST request to exchange the authorization code for tokens
      // axios
      //   .post(`/.netlify/functions/fitbit-auth?code=${code}`)
      //   .then((response) => {
      //     // Store the access token and refresh token securely (e.g., in a state or local storage)
      //     // dispatch(setAccessToken(response.data.access_token));
      //     // dispatch(setExpiresIn(response.data.expires_in));
      //     // dispatch(setRefreshToken(response.data.refresh_token));
      //     localStorage.setItem('accessToken', response.data.access_token);
      //     localStorage.setItem('expiresIn', response.data.expires_in);
      //     localStorage.setItem('refreshToken', response.data.refresh_token);
      //     localStorage.setItem('userId', response.data.user_id);
      //   })
      //   .catch((error) => {
      //     // Handle any errors
      //     dispatch(setError(error));
      //   })
      //   .finally(() => {
      //     navigate('/dashboard');
      //   });
    }
  }, []);

  return <div>Authenticating...</div>;
}