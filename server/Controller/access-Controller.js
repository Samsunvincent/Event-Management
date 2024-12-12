const jwt = require('jsonwebtoken');
let user = require('../db/Model/userModel');
const dotenv = require('dotenv');
dotenv.config();
const control_data = require('../Controller/contol-Data.json');
const { success_function, error_function } = require('../utils/ResponseHandler');

exports.accessControl = async function (access_types, req, res, next) {
  try {
    if (access_types === '*') {
      next();
    } else {
      const authHeader = req.headers['authorization'];
      if (!authHeader) {
        let response = error_function({
          statusCode: 400,
          message: "Please login to continue",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        let response = error_function({
          statusCode: 400,
          message: "Invalid access token",
        });
        res.status(response.statusCode).send(response);
        return;
      }

      jwt.verify(token, process.env.PRIVATE_KEY, async function (err, decoded) {
        if (err) {
          let response = error_function({
            statusCode: 400,
            message: err.message ? err.message : "Authentication failed",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        // Attach the user details to the request
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };

        // Fetch user data to validate existence
        let user_data = await user.findOne({ _id: decoded.id }).populate("userType");
        if (!user_data) {
          let response = error_function({
            statusCode: 404,
            message: "User not found",
          });
          res.status(response.statusCode).send(response);
          return;
        }

        // Verify user role access
        let user_type = user_data.userType ? user_data.userType.userType : 'Admin';
        let allowed = access_types.split(",").map((obj) => control_data[obj]);
        if (allowed && allowed.includes(user_type)) {
          req.user_data = user_data; // Pass user data to the request
          next();
        } else {
          let response = error_function({
            statusCode: 403,
            message: "Not allowed to access the route",
          });
          res.status(response.statusCode).send(response);
          return;
        }
      });
    }
  } catch (error) {
    let response = error_function({
      statusCode: 500,
      message: error.message ? error.message : "Something went wrong",
    });
    res.status(response.statusCode).send(response);
  }
};

