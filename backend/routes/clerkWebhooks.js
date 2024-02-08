
import express from 'express';
import bodyParser from 'body-parser';
import { registerUser, deleteUser, authUser,  } from '../controllers/userController.js';

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
            await registerUser(id, first_name, last_name, email_addresses);
            res.status(200).json({ success: true, message: 'User created or updated' });
          } catch (err) {
            console.error('Error creating or updating user:', err);
            res.status(500).json({ success: false, message: 'Error creating or updating user '  + type });
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
          case 'session.created':
            try {
                // Handle session creation or update in your controller
            await authUser(user_id)
                res.status(200).json({ success: true, message: 'Session created' });
              } catch (err) {
                console.error('Error session created:', err);
                res.status(500).json({ success: false, message: 'session created unsucccessfully'  + type });
              }
              break;

              case 'session.ended':
                try {
                    // Handle user creation or update in your controller
                    
                    res.status(200).json({ success: true, message: 'Session ended' });
                  } catch (err) {
                    console.error('Error session ended:', err);
                    res.status(500).json({ success: false, message: 'session ended unsucccessfully'  + type });
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


// test.js



const testRegisterUser = async () => {
  try {
    const sampleData = {
      id: 'sampleId',
      first_name: 'Sample',
      last_name: 'User',
      email_addresses: [{ email_address: 'sample@example.com' }],
    };
    await registerUser(sampleData);
    console.log('User registration successful.');
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

// Call the test function
// testRegisterUser();

export default router;