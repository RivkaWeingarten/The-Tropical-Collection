
// import express from 'express';
// import bodyParser from 'body-parser';
// import { createOrUpdateUser, deleteUser, authUser,  registerUser  } from '../controllers/userController.js';
// import { clerkClient } from "@clerk/clerk-sdk-node"
// const router = express.Router();

// router.post(
//   '/webhooks',
//   bodyParser.json(), // Parse JSON payload
//   async function (req, res) {
//     try {
//       // Extract necessary properties from the Clerk webhook payload
//       const { type, data } = req.body;

//       // Handle different event types
//       switch (type) {
//         case 'user.created':
//         case 'user.updated':
             
        
//           const { id, first_name, last_name, email_addresses } = data;
//           try {
//             // Handle user creation or update in your controller
//            await createOrUpdateUser(id, first_name, last_name, email_addresses);
//             res.status(200).json({ success: true, message: 'User created or updated ' + last_name + ' ' + first_name});
//           } catch (err) {
//             console.error('Error creating or updating user:', err);
//             res.status(500).json({ success: false, message: 'Error creating or updating user '  + type  + ' ' + last_name});
//           }
//           break;

   

//         case 'user.deleted':
//           const { id: deletedUserId } = data;
//           try {
//             // Handle user deletion in your controller
//             await deleteUser(deletedUserId);
//             res.status(200).json({ success: true, message: 'User deleted' });
//           } catch (err) {
//             console.error('Error deleting user:', err);
//             res.status(500).json({ success: false, message: 'Error deleting user' });
//           }
//           break;
//           case 'session.created':
//             try {
//                 // Handle session creation or update in your controller
//                 const { user_id: user_id } = data;
//             // await authUser(user_id)
//                 res.status(200).json({ success: true, message: 'Session created' });
//               } catch (err) {
//                 console.error('Error session created:', err);
//                 res.status(500).json({ success: false, message: 'session created unsucccessfully'  + type });
//               }
//               break;

//               case 'session.ended':
//                 try {
//                     // Handle user creation or update in your controller
                    
//                     res.status(200).json({ success: true, message: 'Session ended' });
//                   } catch (err) {
//                     console.error('Error session ended:', err);
//                     res.status(500).json({ success: false, message: 'session ended unsucccessfully'  + type });
//                   }
//                   break;

//         // Add more cases for other event types if needed

//         default:
//           res.status(400).json({ success: false, message: 'Unsupported event type' });
//       }
//     } catch (error) {
//       console.error('Error handling webhook:', error);
//       res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   }
// );


// // test.js



// const testRegisterUser = async () => {
//   try {
//     const sampleData = {
//       id: 'sampleId2',
//       first_name: 'Sample2',
//       last_name: 'User2',
//       email_addresses: [{ email_address: 'sample2@example.com' }],
//     };

//     const res = {
//       cookie: () => {},
//     };
//     await createOrUpdateUser(sampleData, res);
//     console.log('User registration successful.');
//   } catch (error) {
//     console.error('Error registering user:', error);
//   }
// };

// // Call the test function
// // testRegisterUser();

// export default router;

import express from 'express';
import bodyParser from 'body-parser';
import { createOrUpdateUser, deleteUser, authUser } from '../controllers/userController.js';
import { Webhook } from 'svix';

const router = express.Router();

router.post(
  '/webhooks',
  bodyParser.json(), // Parse JSON payload
  async function (req, res) {
    try {
      // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
      const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        throw new Error('You need a WEBHOOK_SECRET in your .env');
      }

      // Extract necessary properties from the Clerk webhook payload
      const { type, data } = req.body;

      // Get the headers
      const svix_id = req.get('svix-id');
      const svix_timestamp = req.get('svix-timestamp');
      const svix_signature = req.get('svix-signature');

      // If there are missing Svix headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return res.status(400).json({ success: false, message: 'Missing Svix headers' });
      }

      // Get the body
      const body = JSON.stringify(req.body);

      // Create a new Svix instance with your secret
      const wh = new Webhook(WEBHOOK_SECRET);

      let evt;

      // Verify the payload with the headers
      try {
        evt = wh.verify(body, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
        });
      } catch (err) {
        console.error('Error verifying webhook:', err);
        return res.status(400).json({ success: false, message: 'Error verifying webhook' });
      }

      // Handle different event types
      switch (type) {
        case 'user.created':
        case 'user.updated':
          const { id, first_name, last_name, email_addresses } = data;
          try {
            // Handle user creation or update in your controller
           const result= await createOrUpdateUser({id, first_name, last_name, email_addresses}, res);
            console.log(result)
            res.status(200).json({ success: true, message: 'User created or updated ' + last_name + ' ' + first_name });
          } catch (err) {
            console.error('Error creating or updating user:', err);
            res.status(500).json({ success: false, message: 'Error creating or updating user ' + type + ' ' + last_name });
          }
          break;

        // Handle other cases

        default:
          res.status(400).json({ success: false, message: 'Unsupported event type' });
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
);

export default router;
