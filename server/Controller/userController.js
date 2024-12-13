const register = require('../db/Model/userModel');
const bcrypt = require('bcrypt');  // Assuming you want to hash passwords
const UserType = require('../db/Model/userType');  // Assuming this is the model for the userType collection
const user = require('../db/Model/userModel');
const userType = require('../db/Model/userType');
const Category = require('../db/Model/categorySchema')
const Language = require('../db/Model/languageSchema')


exports.register_user = async function (req, res) {
  try {
    const { name, email, password, phone, isActive, password_token, userType } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !userType) {
      return res.status(400).json({
        message: 'Name, email, password, and userType are required fields.'
      });
    }

    // Check for email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address.'
      });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long.'
      });
    }

    // Check if phone is provided and is a valid number
    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: 'Please provide a valid 10-digit phone number.'
      });
    }

    // Check if user already exists
    const existingUser = await register.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists.'
      });
    }

    // Find the userType by its name (string) instead of ID
    const userTypeDoc = await UserType.findOne({ userType: userType });
    if (!userTypeDoc) {
      return res.status(400).json({
        message: 'Invalid user type provided.'
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set default values for isActive and password_token if not provided
    const newUser = new register({
      name: name,
      email: email,
      password: hashedPassword,  // Store the hashed password
      phone: phone || null,       // Default to null if phone is not provided
      isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
      password_token: password_token || null, // Default to null if no password token is provided
      userType: userTypeDoc._id  // Set the userType based on the found document
    });

    // Save the new user
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        isActive: newUser.isActive,
        userType: userTypeDoc.name  // Assuming the userType document has a 'name' field
      }
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      message: 'An error occurred during registration. Please try again later.'
    });
  }
};


exports.getProfile = async function (req, res) {
  try {
    const u_id = req.params.id;

    // Validate if user ID is provided
    if (!u_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user details
    const findUser = await user.findOne({ _id: u_id });
    if (!findUser) {
      return res.status(404).json({ message: "User details not found" });
    }
    console.log('findUser', findUser);

    // Fetch the user type details from the userType collection
    const findUserType = await userType.findOne({ _id: findUser.userType });
    if (!findUserType) {
      return res.status(500).json({ message: "Not allowed to this route" });
    }
    console.log('findUserType', findUserType);

    // Check if user type matches the expected values (e.g., "Organizer" or "Attendee")
    if (findUserType.userType === "Admin") {
      return res.status(403).json({ message: "Access denied: Admin users are not allowed to this route" });
    }

    // Respond with user details
    return res.status(200).json({
      message: "User details fetched successfully",
      user: findUser,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      message: "An error occurred while fetching user details",
      error: error.message,
    });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    const u_id = req.params.id;
    const body = req.body;

    // Validate if user ID is provided
    if (!u_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user by ID
    const findUser = await user.findOne({ _id: u_id });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user details
    const updatedUser = await user.findByIdAndUpdate(
      u_id,
      { $set: body }, // Update fields passed in the body
      { new: true }   // Return the updated document
    );

    // Respond with the updated user details
    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      message: "An error occurred while updating the user profile",
      error: error.message,
    });
  }
};

exports.getUserType = async function (req, res) {
  try {
    // Query the userType collection from the database
    let usertype = await userType.find();

    // Check if the result is empty and return an appropriate response
    if (!usertype || usertype.length === 0) {
      return res.status(404).json({ message: "No user types found." });
    }

    // Log the result for debugging (can be removed in production)
    console.log("User types:", usertype);

    // Return the user types in a successful response
    return res.status(200).json(usertype);
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching user types:', error);

    // Return a generic server error response
    return res.status(500).json({
      message: 'An error occurred while fetching user types.',
      error: error.message, // Optionally send error details, be careful with sensitive data
    });
  }
};

exports.getCategory = async function (req, res) {
  try {
      // Fetch all categories from the database
      const getCategory = await Category.find();

      // If no categories are found
      if (getCategory.length === 0) {
          return res.status(404).json({
              message: "No categories found"
          });
      }

      // Return successful response with categories
      return res.status(200).json({
          message: "Categories retrieved successfully",
          data: getCategory
      });

  } catch (error) {
      // Log the error and send a failure response
      console.error("Error retrieving categories:", error);
      return res.status(500).json({
          message: "Something went wrong while retrieving categories",
          error: error.message
      });
  }
};

exports.getLanguage = async function (req, res) {
  try {
      // Fetch all languages from the database
      const getLanguage = await Language.find();

      // If no languages are found
      if (getLanguage.length === 0) {
          return res.status(404).json({
              message: "No languages found"
          });
      }

      // Return successful response with languages
      return res.status(200).json({
          message: "Languages retrieved successfully",
          data: getLanguage
      });

  } catch (error) {
      // Log the error and send a failure response
      console.error("Error retrieving languages:", error);
      return res.status(500).json({
          message: "Something went wrong while retrieving languages",
          error: error.message
      });
  }
};








