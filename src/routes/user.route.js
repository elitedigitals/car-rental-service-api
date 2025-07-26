import express from 'express';
import { forgotPassword, 
        login, 
        resetPassword, 
        signUp,verifyEmail,
        verifyotp} from '../controller/user.controller.js';

const router = express.Router();

router.post('/register', signUp)
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password',forgotPassword)
router.post('/verify-otp', verifyotp);
router.post('/reset-password/:userId', resetPassword);

export default router;
// This route handles user registration. It uses the signUp function from the user controller to process