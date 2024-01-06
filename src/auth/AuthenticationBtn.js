import { Button } from '@mui/material';
import React from 'react';
import generateFitbitLoginUrl from './FitbitAuth';

export default function AuthenticationBtn() {

  async function initiateFitbitLogin() {
    try {
      const fitbitLoginUrl = await generateFitbitLoginUrl();
      // Redirect the user to the generated login URL
      window.location.href = fitbitLoginUrl;
    } catch (error) {
      console.error("Error initiating Fitbit login:", error);
      // Handle the error appropriately, e.g., display an error message to the user
    }
  }

  return (
    <Button onClick={async () => {
      try {
        await initiateFitbitLogin();
      } catch (error) {
        console.error("Error initiating Fitbit login:", error);
        // Handle the error appropriately, e.g., display an error message to the user
      }
    }}
      variant='contained'>
      Authenticate with Fitbit
    </Button>
  );
}