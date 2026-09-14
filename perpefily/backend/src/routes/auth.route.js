import express from 'express';

import  {registerValidator , loginValidator , forgetPasswordValidator , verifyForgetPasswordValidator,resetPasswordValidator} from  "../validator/auth.validator.js"
import { registerController ,loginController , getMeController, logoutController , googleAuthController , forgetPasswordController, verifyOtpController , resetPasswordController , testStreamController, sendVerificationEmailController} from '../controllers/auth.controller.js';
import {verifyEmailController} from "../controllers/auth.controller.js"
import { identifyUser } from '../middlewares/identifyUser.js';
import { validate } from '../middlewares/validate.middleware.js';
import passport from 'passport';
const AuthRouter = express.Router();



/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email or username already exists
 */
// POST /api/auth/send-verification-email
// Public - Send verification email using action token
AuthRouter.post("/send-verification-email", sendVerificationEmailController)

// POST /api/auth/register
// Public - Register new user
AuthRouter.post("/register" ,registerValidator , validate, registerController)

// GET /api/auth/verify/:token
// Public - Verify email

AuthRouter.get("/verify/:token" , verifyEmailController)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 */
// POST /api/auth/login
// Public - Login user

AuthRouter.post("/login" ,loginValidator ,validate ,  loginController )

// GET /api/auth/getMe
// Private - Get authenticated user

AuthRouter.get("/getMe",identifyUser ,getMeController )

// POST /api/auth/logout
// Private - Logout user

AuthRouter.post("/logout", logoutController)

// POST /api/auth/forgot-password
// Public - Send password reset OTP

AuthRouter.post("/forget-password" ,forgetPasswordValidator , validate,  forgetPasswordController)

// POST /api/auth/verify-forgot-password
// Public - Verify password reset OTP

AuthRouter.post("/verify-forget-password" , verifyForgetPasswordValidator , validate,  verifyOtpController)
// POST /api/auth/reset-password
// Public - Reset password using reset token
AuthRouter.post("/reset-password" ,resetPasswordValidator , validate ,resetPasswordController )
AuthRouter.get(
  "/test-stream",
  testStreamController
);

AuthRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false, 
  })
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false, 
  }),
  googleAuthController
);

export default AuthRouter;
