import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      role,
      state,
      district,
      village,
      landArea,
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and password are required",
      });
    }

    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    const user = await User.create({
      name,
      phone,
      email,
      password,
      role: role || "farmer",
      state,
      district,
      village,
      landArea,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        state: user.state,
        district: user.district,
        village: user.village,
        landArea: user.landArea,
      },
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);

if (error.code === 11000) {
  return res.status(400).json({
    success: false,
    message: "Phone number already registered",
  });
}
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        state: user.state,
        district: user.district,
        village: user.village,
        landArea: user.landArea,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};