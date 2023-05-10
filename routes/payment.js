import express from 'express';
import paymentController from '../controllers/paymentController.js';
import isLoggedIn from '../middleware/isLoggedin.js';
const router = express.Router();


router.post('/create-payment', isLoggedIn.isAuthenticated, paymentController.createPayment);
router.get('/verify-payment', isLoggedIn.isAuthenticated, paymentController.verifyPayment);
router.get('/payment-history', isLoggedIn.isAuthenticated, paymentController.getPaymentHistory);
router.get('/success', isLoggedIn.isAuthenticated, paymentController.successPayment);

export default router;