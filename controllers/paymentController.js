import passport from "../config/passport.js";
import User from "../models/user.js";


router.post('/create-payment', isLoggedIn.isAuthenticated, paymentController.createPayment);
router.get('/verify-payment', isLoggedIn.isAuthenticated, paymentController.verifyPayment);
router.get('/payment-history', isLoggedIn.isAuthenticated, paymentController.getPaymentHistory);
router.get('/success', isLoggedIn.isAuthenticated, paymentController.successPayment);

class PaymentController {
  static createPayment = async (req, res) => {
    res.render("payment", {error: null});
  }
  static verifyPayment = async (req, res) => {
    res.render("register", {error: null});
  }
  static getPaymentHistory = async (req, res) => {
    res.render("login", {error: null});
  }
  static successPayment = async (req, res) => {
    res.render("success", req.user);
  }
}

export default PaymentController;
