import { LockOutlined } from '@mui/icons-material';
import { Avatar, Box, Button, Container, Link, Typography } from '@mui/material';
import React from 'react';

const codeVerifierStorageKey = 'PKCE_code_verifier'
const stateStorageKey = 'ROCP_auth_state'
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
}

function generateFitbitLoginUrl()  {
  const codeVerifier = generateRandomString(96);
  var result ;
  generateCodeChallenge(codeVerifier).then((codeChallenge) => {
    console.log(codeVerifier,codeChallenge);
    localStorage.setItem("code_challenge", codeChallenge);
    // Set query parameters and redirect user to OAuth2 authentication endpoint
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: '23RHP3',
      //redirect_uri: 'http://localhost:3000/fitbit_callback',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      scope: 'activity cardio_fitness electrocardiogram heartrate location nutrition oxygen_saturation profile respiratory_rate settings sleep social temperature',
    });
    const codeState = generateRandomString(32);
    params.append('state',codeState);
    sessionStorage.setItem(stateStorageKey, codeState);
    localStorage.setItem("code_state", codeState);
    result = (`${authorizationEndpoint}?${params.toString()}`);
  });

  return result;
}

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://jamasp.cut.social/">
        Jamasp®
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function FitbitSignIn() {

  return (
    <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login with Fitbit
          </Typography>
          <Box  sx={{ mt: 1 }}>
            <Button
              href={generateFitbitLoginUrl}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Fitbit Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />   
    </Container>
  );
};