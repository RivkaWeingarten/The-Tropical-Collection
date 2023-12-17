
import { Router } from 'express';

import { auth } from '../config/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from 'firebase/auth';
const authRouter = Router();

authRouter.post('/register', async (req, res) => {
//   const { email, password } = req.body;
console.log(`backend ${req.body}`)
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, req.body.email, req.body.password);
    const user = userCredential.user;
    res.json({ uid: user.uid, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});
authRouter.post('/loginwithgoogle', (req, res) => {
 signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...

      // You might want to send a response back to the client here if needed.
      res.status(200).json({ token, user });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...

      // You might want to send an error response back to the client here if needed.
      res.status(500).json({ errorCode, errorMessage });
    });
});

authRouter.post('/login', (req, res) => {
  const { email, password } = req.body; // Assuming you're sending email and password in the request body

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // You might want to send a response back to the client here if needed.
      res.status(200).json({ user });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // You might want to send an error response back to the client here if needed.
      res.status(500).json({ errorCode, errorMessage });
    });
});
export default authRouter;