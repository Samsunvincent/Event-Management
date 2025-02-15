const users = require('../db/Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { success_function, error_function } = require('../utils/ResponseHandler');
const resetpassword = require('../utils/email-templates/resetpassword').resetPassword
let sendEmail  = require('../utils/send-email').sendEmail

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Check for missing email
    if (!email) {
      let response = error_function({
        success: false,
        statusCode: 400,
        message: "Email is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      let response = error_function({
        success: false,
        statusCode: 400,
        message: "Invalid email format",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    // Check for missing password
    if (!password) {
      let response = error_function({
        success: false,
        statusCode: 400,
        message: "Password is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    // Find the user in the users collection (which includes both users and admins)
    let check_user = await users.findOne({ email: email }).populate('userType');
    console.log("Checking email in users data:", check_user);

    if (check_user) {
      // Check if the user is blocked
      if (check_user.user_Status === 'block') {
        let response = error_function({
          success: false,
          statusCode: 403,
          message: "Your account has been blocked. Please contact support.",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      // Compare password with the stored hash
      const isPasswordMatch = await bcrypt.compare(password, check_user.password);
      if (isPasswordMatch) {
        // Check if userType exists, otherwise assign 'admin' role
        const role = check_user.userType ? (check_user.userType.userType === 'Organizer' ? 'admin' : 'user') : 'admin';
        
        const token = jwt.sign({ id: check_user._id, role: role }, process.env.PRIVATE_KEY, { expiresIn: role === 'admin' ? '1h' : '10d' });
        console.log('token : ', token);

        let response = success_function({
          success: true,
          statusCode: 200,
          message: "Login is successful",
          data: { user: check_user, token }
        });
        
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          success: false,
          statusCode: 401,
          message: "Incorrect password",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    }

    // If no user found
    let response = error_function({
      success: false,
      statusCode: 404,
      message: "User not found",
    });
    res.status(response.statusCode).send(response);

  } catch (error) {
    console.error("Error during login:", error);
    let response = error_function({
      success: false,
      statusCode: 500,
      message: "An error occurred during login",
    });
    res.status(response.statusCode).send(response);
  }
};


exports.forgetpassword = async function (req, res) {
  try {
      let email = req.body.email;
      console.log("Email from user:", email);

      // Check if the user exists
      let check_user = await users.findOne({ email });
      console.log("User found:", check_user);

      if (!check_user) {
          let response = error_function({
              statusCode: 404,
              message: "User not found",
          });
          return res.status(response.statusCode).send(response);
      }

      // Generate password reset token
      let reset_token = jwt.sign({ user_id: check_user._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
      console.log("Generated reset token:", reset_token);

      // Update user document with password reset token
      let data = await users.updateOne({ email: email }, { $set: { password_token: reset_token } });
      console.log("Update result:", data);

      if (data.matchedCount === 0) {
          // This case means no user matched the email in the database
          let response = error_function({
              statusCode: 404,
              message: "No user found to update with the provided email",
          });
          return res.status(response.statusCode).send(response);
      }

      if (data.modifiedCount === 0) {
          // If the matched count is greater than 0 but nothing was modified
          let response = error_function({
              statusCode: 400,
              message: "Failed to update password token",
          });
          return res.status(response.statusCode).send(response);
      }

      // Generate reset link with the token
      let reset_link = `${process.env.FRONTEND_URL}?token=${reset_token}`;

      // Generate email template for reset password
      let email_template = await resetpassword(check_user.name, reset_link);
  

      // Send email with reset link
      sendEmail(email, "Forgot password", email_template);

      // Send success response
      let response = success_function({
          statusCode: 200,
          message: "Email sent successfully",
          data: reset_token,
      });
      return res.status(response.statusCode).send(response);

  } catch (error) {
      console.log("Error:", error);

      // Handle error and respond with an appropriate message
      let response = error_function({
          statusCode: 500,
          message: "Password reset failed",
      });
      return res.status(response.statusCode).send(response);
  }
};
