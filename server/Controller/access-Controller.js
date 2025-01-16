const jwt = require('jsonwebtoken');
let user = require('../db/Model/userModel');
const dotenv = require('dotenv');
dotenv.config();
const control_data = require('../Controller/contol-Data.json');
const { success_function, error_function } = require('../utils/ResponseHandler');

exports.accessControl = async function (access_types, req, res, next) {
  try {
    if (access_types === '*') {
      return next(); // Allow unrestricted access
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send(
        error_function({
          statusCode: 401,
          message: 'Please login to continue',
        })
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(400).send(
        error_function({
          statusCode: 400,
          message: 'Invalid access token',
        })
      );
    }

    jwt.verify(token, process.env.PRIVATE_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).send(
          error_function({
            statusCode: 401,
            message: err.message || 'Authentication failed',
          })
        );
      }

      // Fetch user details from the database
      const user_data = await user.findOne({ _id: decoded.id }).populate('userType');
      if (!user_data) {
        return res.status(404).send(
          error_function({
            statusCode: 404,
            message: 'User not found',
          })
        );
      }

      // Check if the user is blocked
      if (user_data.user_Status === 'block') {
        return res.status(403).send(
          error_function({
            statusCode: 403,
            message: 'Your account has been blocked. Please contact support.',
          })
        );
      }

      // Extract user role
      const user_role = user_data.userType?.userType || 'Admin';
      console.log('Extracted user role:', user_role);

      // Verify access permissions
      const allowedRoles = access_types.split(',').map((type) => control_data[type]);
      if (!allowedRoles.includes(user_role)) {
        return res.status(403).send(
          error_function({
            statusCode: 403,
            message: 'Not allowed to access the route',
          })
        );
      }

      // Attach user and role to the request
      req.user = {
        id: user_data._id,
        role: user_role,
      };
      req.user_data = user_data;

      next();
    });
  } catch (error) {
    console.error('Access control error:', error);
    res.status(500).send(
      error_function({
        statusCode: 500,
        message: error.message || 'Something went wrong',
      })
    );
  }
};
