import express from 'express';
import { forgotPassword, 
        login, 
        resetPassword, 
        signUp,verifyEmail,
        verifyotp,} from '../controller/user.controller.js';
        import { verifyPayment } from '../controller/rental.controller.js';

const router = express.Router();

router.post('/register', signUp)
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.post('/forgot-password',forgotPassword)
router.post('/verify-otp', verifyotp);
router.post('/reset-password/:userId', resetPassword);


//verify payment route
router.get('/verify-payment', verifyPayment);

export default router;
// This route handles user registration. It uses the signUp function from the user controller to process