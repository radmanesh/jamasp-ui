# FitbitAuth.js

This file contains two main functions related to Fitbit authentication.

## Function: Anonymous

This function queries a Firestore collection named "users" for a document where the "uid" field matches the provided `userId`. If no such document exists, it logs "No such document!" and returns. If a document is found, it checks if the user has a `fitbit_id`. If not, it logs "No fitbit_id" and returns `null`.

### Parameters

- `userId`: The unique identifier of the user.

### Returns

- If a user document is found and the user has a `fitbit_id`, it returns the user data. Otherwise, it returns `null`.

## Function: exchangeCodeForTokens

This function takes an authorization code and a code verifier, and attempts to exchange them for access tokens. If the code is valid, it sends a POST request to get or renew the access token and returns the response.

### Parameters

- `code`: The authorization code obtained from Fitbit.
- `code_verifier`: The code verifier for the PKCE flow.

### Returns

- If the code is valid, it returns the response from the `getOrRenewAccessToken` function. Otherwise, it doesn't return anything.