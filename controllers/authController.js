const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmailWithInvoice = require("../routes/sendEmail"); // Adjust the path as necessary


const createUser = async (req, res) => {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res
          .status(400)
          .json({ errors: { email: "Email already exists" } });
      }
  
      // Create a user in the database with additional fields
      const user = new User({
        email: req.body.email,
        password: req.body.password, // Pass plain text here; will be hashed in pre('save')
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      });
  
      await user.save(); // Save user to trigger the pre('save') middleware
  
      // Generate a token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
  
      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    } catch (error) {
      console.error("Error during user creation:", error);
      res.status(500).json({ message: "Signup failed" });
    }
  };
  
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "No user found with this email" });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      // Generate a token if the password matches
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      const invoiceProducts = [
        { description: "Premium Subscription", quantity: 2, price: 50 },
        { description: "Extra Storage", quantity: 5, price: 100 }
      ]; 
      const userDetails = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        address: "User Address (You can add dynamically if available)"
      };
      // await sendEmailWithInvoice(userDetails, invoiceProducts);

      // Respond with user details (excluding password) and token
      res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  };
  
module.exports = { createUser, loginUser };
