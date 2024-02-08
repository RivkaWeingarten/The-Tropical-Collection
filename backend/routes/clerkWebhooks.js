// import express from "express";
// import bodyParser from "body-parser";


// import { deleteUser, registerUser } from "../controllers/userController.js";

// const router = express.Router();

// router.post(
//   "/webhooks",
//   bodyParser.json(),
//   async function (req, res) {
//     // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
//     const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
//     if (!WEBHOOK_SECRET) {
//       throw new Error("You need a WEBHOOK_SECRET in your .env");
//     }

//     // Grab the headers and body
//     const headers = req.headers;
//     const payload = req.body;

//     // Get the Svix headers for verification
//     const svix_id = headers["svix-id"];
//     const svix_timestamp = headers["svix-timestamp"];
//     const svix_signature = headers["svix-signature"];

//     // If there are missing Svix headers, error out
//     if (!svix_id || !svix_timestamp || !svix_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Error occurred -- no svix headers",
//       });
//     }

//     // Initiate Svix
//     const wh = new Webhook(WEBHOOK_SECRET);

//     let evt;

//     // Attempt to verify the incoming webhook
//     // If successful, the payload will be available from 'evt'
//     // If the verification fails, error out and return an error code
//     try {
//       evt = wh.verify(payload, {
//         "svix-id": svix_id,
//         "svix-timestamp": svix_timestamp,
//         "svix-signature": svix_signature,
//       });
//     } catch (err) {
//       // Console log and return error
//       console.log("Webhook failed to verify. Error:", err.message);
//       return res.status(400).json({
//         success: false,
//         message: err.message,
//       });
//     }

//     // Grab the ID and TYPE of the Webhook
//     const eventType = evt?.type;
//     if (eventType === "user.created" || eventType === "user.updated") {
//         console.log(`from backend ${eventType}` )
//       const { id, first_name, last_name, email_addresses } = evt?.data;
//       try {
//         await registerUser(id, first_name, last_name, email_addresses);
//         return new Response("User is created or updated", { status: 200 });
//       } catch (err) {
//         console.error("error creating or updating user");
//         return new Response("Error creating or updating user", { status: 500 });
//       }
//     }
//     if (eventType === "user.deleted") {
       
//         try {
//             const { id } = evt?.data;
//           await deleteUser(id);
//           return new Response("User is deleted", { status: 200 });
//         } catch (err) {
//           console.error("error deleting user");
//           return new Response("Error deleting user", { status: 500 });
//         }
//       }

//   }
// );

// export default router;
import express from 'express';
import bodyParser from 'body-parser';
import { createAndUpdateUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post(
  '/webhooks',
  bodyParser.json(), // Parse JSON payload
  async function (req, res) {
    try {
      // Extract necessary properties from the Clerk webhook payload
      const { type, data } = req.body;

      // Handle different event types
      switch (type) {
        case 'user.created':
        case 'user.updated':
          const { id, first_name, last_name, email_addresses } = data;
          try {
            // Handle user creation or update in your controller
            await createAndUpdateUser(id, first_name, last_name, email_addresses);
            res.status(200).json({ success: true, message: 'User created or updated' });
          } catch (err) {
            console.error('Error creating or updating user:', err);
            res.status(500).json({ success: false, message: 'Error creating or updating user' + type });
          }
          break;

        case 'user.deleted':
          const { id: deletedUserId } = data;
          try {
            // Handle user deletion in your controller
            await deleteUser(deletedUserId);
            res.status(200).json({ success: true, message: 'User deleted' });
          } catch (err) {
            console.error('Error deleting user:', err);
            res.status(500).json({ success: false, message: 'Error deleting user' });
          }
          break;

        // Add more cases for other event types if needed

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