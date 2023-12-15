
import { Router } from 'express';

import { auth } from '../config/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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

export default authRouter;