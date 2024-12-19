const users = require('../db/Model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const {success_function,error_function} = require('../utils/ResponseHandler')

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
        // Compare password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, check_user.password);
        if (isPasswordMatch) {
          // Check if userType exists, otherwise assign 'admin' role
          const role = check_user.userType ? (check_user.userType.userType === 'Organizer' ? 'admin' : 'user') : 'admin';
          
          const token = jwt.sign({ id: check_user._id, role: role }, process.env.PRIVATE_KEY, { expiresIn: role === 'admin' ? '1h' : '10d' });
          console.log('token : ',token);
  
          let response = success_function({
            success: true,
            statusCode: 200,
            message : "login is successfull",
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
  
