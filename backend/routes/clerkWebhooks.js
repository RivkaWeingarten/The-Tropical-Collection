
// import express from 'express';
// import bodyParser from 'body-parser';
// import { createOrUpdateUser, deleteUser, authUser,  registerUser  } from '../controllers/userController.js';

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
//       id: 'sampleId1',
//       first_name: 'Sample1',
//       last_name: 'User',
//       email_addresses: [{ email_address: 'sample1@example.com' }],
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
import { createOrUpdateUser, deleteUser } from '../controllers/userController.js';
import { Webhook } from 'svix';

const router = express.Router();

router.post(
  '/webhooks',
  bodyParser.json(),
  async function (req, res) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return res.status(500).json({ success: false, message: 'Missing WEBHOOK_SECRET' });
    }

    const svix_id = req.get('svix-id');
    const svix_timestamp = req.get('svix-timestamp');
    const svix_signature = req.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({ success: false, message: 'Missing svix headers' });
    }
    const { type, data } = req.body;

    const wh = new Webhook(WEBHOOK_SECRET);



    // try {
    //   evt = wh.verify(payload, {
    //     'svix-id': svix_id,
    //     'svix-timestamp': svix_timestamp,
    //     'svix-signature': svix_signature,
    //   });
    // } catch (err) {
    //   console.error('Error verifying webhook:', err);
    //   return res.status(400).json({ success: false, message: 'Error verifying webhook' });
    // }

    const eventType = evt?.type;

    if (type === 'user.created' || type === 'user.updated') {
      const { id, first_name, last_name, email_addresses } = evt?.data;

      try {
        await createOrUpdateUser(id, first_name, last_name, email_addresses, res);

        return res.status(200).json({ success: true, message: 'User is created or updated' });
      } catch (err) {
        console.error('Error creating or updating user:', err);
        return res.status(500).json({ success: false, message: 'Error creating or updating user' });
      }
    }

    if (type === 'user.deleted') {
      try {
        const { id } = evt?.data;
        await deleteUser(id);

        return res.status(200).json({ success: true, message: 'User is deleted' });
      } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ success: false, message: 'Error deleting user' });
      }
    }

    return res.status(400).json({ success: false, message: 'Unsupported event type' });
  }
);

export default router;