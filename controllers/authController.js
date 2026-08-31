import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ১. Credential Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, image, password } = req.body;


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters, with one uppercase and one lowercase letter." 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
        name, 
        email, 
        image, 
        password: hashedPassword,
        role: "user",
        isBlocked: false,
        isPremium: false
    });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    if (user.isBlocked) return res.status(403).json({ message: "Account is blocked by Admin" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).status(200).json({ 
        message: "Login successful", 
        role: user.role, 
        name: user.name, 
        image: user.image 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const googleLogin = async (req, res) => {
    try {
      const { name, email, image } = req.body;
  
      let user = await User.findOne({ email });
  
      
      if (!user) {
        user = new User({
          name,
          email,
          image,
          password: "", 
          role: "user",
          isBlocked: false,
          isPremium: false
        });
        await user.save();
      }
  
      if (user.isBlocked) return res.status(403).json({ message: "Account is blocked by Admin" });
  
      const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }).status(200).json({ 
          message: "Google Login successful", 
          role: user.role, 
          name: user.name, 
          image: user.image 
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        }).status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};