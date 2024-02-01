import express from "express";
import bodyParser from "body-parser";
import { Webhook, WebhookEvent } from "@clerk/clerk-sdk-node";
import { deleteUser, registerUser } from "../controllers/userController";

const router = express.Router();

router.post(
  "/webhooks",
  bodyParser.raw({ type: "application/json" }),
  async function (req, res) {
    // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Grab the headers and body
    const headers = req.headers;
    const payload = req.body;

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    // If there are missing Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).json({
        success: false,
        message: "Error occurred -- no svix headers",
      });
    }

    // Initiate Svix
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and return an error code
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      // Console log and return error
      console.log("Webhook failed to verify. Error:", err.message);
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Grab the ID and TYPE of the Webhook
    const eventType = evt?.type;
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, first_name, last_name, email_addresses } = evt?.data;
      try {
        await registerUser(id, first_name, last_name, email_addresses);
        return new Response("User is created or updated", { status: 200 });
      } catch (err) {
        console.error("error creating or updating user");
        return new Response("Error creating or updating user", { status: 500 });
      }
    }
    if (eventType === "user.deleted") {
       
        try {
            const { id } = evt?.data;
          await deleteUser(id);
          return new Response("User is deleted", { status: 200 });
        } catch (err) {
          console.error("error deleting user");
          return new Response("Error deleting user", { status: 500 });
        }
      }

    // return res.status(200).json({
    //   success: true,
    //   message: "Webhook received",
    // });
  }
);

export default router;
