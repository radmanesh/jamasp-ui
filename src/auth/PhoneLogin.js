import React, { Fragment, useState } from 'react';
import { auth } from "../firebase";
import { Box } from '@mui/system';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Button } from '@mui/base';
import { Link } from 'react-router-dom';

function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const recaptchaVerifier = auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible'
    });

    try {
      const confirmationResult = await auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier);

      // Send verification code to user's phone (implement logic here)

      const handleVerifyCode = async (code) => {
        try {
          await confirmationResult.confirm(code);
          // User signed in successfully
          console.log('User signed in!');
        } catch (error) {
          console.error('Verification error:', error);
        }
      };

      // Prompt user to enter verification code and call handleVerifyCode

    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleAgreeTerms = (event) => {
    setAgreed(event.target.checked);
  }

  return (
    <Fragment>
      <Box sx={{ mt: 5, m: 1 }}>
        <Typography variant="h3">Phone Login</Typography>
        <Typography variant="subtitle">Please Enter Your Phone To Complete Your Registration</Typography>
        <Box component={"form"} onSubmit={handleSignIn} sx={{ m: 1, '& > :not(style)': { m: 1, width: '25ch' } }} >
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone Number (e.g. +1 123 456 7890)"
            name="phone"
            autoComplete="phone"
            pattern="[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*"
            autoFocus
            type='tel'
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
            
            <FormControlLabel
              control={<Checkbox value="accept" required onChange={handleAgreeTerms} color="primary" />}
              label="By clicking this box, I accept the Terms of Service and Privacy Policy and I consent to Jamasp's use of my contact information for sending me messages. Message & data rates may apply"
            /> 
          <Button
            type="submit"
            disabled={!agreed}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send verification code
          </Button>
          <br />
          <Typography variant="subtitle">We will send you an SMS to confirm your phone number. Message & data rates may apply.</Typography>
          <Typography variant="subtitle">By signing in, you agree to our <Link to="/terms" target='_blank'>Terms of Service and Privacy Policy</Link>.</Typography>

        </Box>
        <div id="recaptcha-container"></div>
        {verificationCode && (
          // <form onSubmit={() => handleVerifyCode(verificationCode)}>
          <Box component={"form"} onSubmit={() => console.log(verificationCode)} sx={{ m: 1, '& > :not(style)': { m: 1, width: '25ch' } }}>
            <TextField
              margin="normal"
              type="text"
              required
              fullWidth
              id="verificationCode"
              label="Verification Code"
              name="verificationCode"
              autoComplete="verificationCode"
              autoFocus
              pattern="^[0-9]{6}$"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Verify code</Button>
          </Box>
        )}

      </Box>
    </Fragment>
  );
}

export default PhoneLogin;