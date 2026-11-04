import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import fs from "fs";
import path from "path";


// =====================================================
// REGISTER USER
// =====================================================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      authProvider = "local",
    } = req.body;

    const normalizedEmail =
      email.toLowerCase().trim();


    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }


    const hashedPassword =
      await bcrypt.hash(password, 12);


    const user = await User.create({
      fullName: fullName.trim(),

      email: normalizedEmail,

      mobile:
        mobile?.trim() || null,

      password: hashedPassword,

      authProvider,
    });


    res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage:
          user.profileImage,
      },
    });

  } catch (error) {

    console.error(
      "Registration Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to create account",
    });
  }
};


// =====================================================
// LOGIN USER
// =====================================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;


    const normalizedEmail =
      email.toLowerCase().trim();


    const user = await User.findOne({
      email: normalizedEmail,
    });


    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          "This account does not use password login",
      });
    }


    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


    const token = jwt.sign(
      {
        userId:
          user._id.toString(),

        email:
          user.email,
      },

      env.jwtSecret,

      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({
      success: true,

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage:
          user.profileImage,
      },
    });

  } catch (error) {

    console.error(
      "Login Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to login",
    });
  }
};


// =====================================================
// GET CURRENT USER
// =====================================================

export const getMe = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user.userId
      ).select("-password");


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        authProvider:
          user.authProvider,
        profileImage:
          user.profileImage,
        emailVerified:
          user.emailVerified,
      },
    });

  } catch (error) {

    console.error(
      "Get Me Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch user",
    });
  }
};


// =====================================================
// UPDATE PROFILE
// =====================================================

export const updateProfile = async (
  req,
  res
) => {
  try {

    const {
      fullName,
      email,
      mobile,
    } = req.body;


    if (
      !fullName ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full Name and Email are required",
      });
    }


    const normalizedEmail =
      email.toLowerCase().trim();


    const existingUser =
      await User.findOne({
        email: normalizedEmail,

        _id: {
          $ne: req.user.userId,
        },
      });


    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already being used by another account",
      });
    }


    const user =
      await User.findById(
        req.user.userId
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    user.fullName =
      fullName.trim();

    user.email =
      normalizedEmail;

    user.mobile =
      mobile?.trim() || null;


    await user.save();


    res.status(200).json({
      success: true,

      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        profileImage:
          user.profileImage,
      },
    });

  } catch (error) {

    console.error(
      "Update Profile Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
};


// =====================================================
// UPDATE PROFILE IMAGE
// =====================================================

export const updateProfileImage = async (
  req,
  res
) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a profile image",
      });
    }


    const user =
      await User.findById(
        req.user.userId
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    // Delete previous profile image
    if (
      user.profileImage &&
      user.profileImage.startsWith(
        "/uploads/profiles/"
      )
    ) {

      const oldImagePath =
        path.join(
          process.cwd(),
          user.profileImage
        );


      if (
        fs.existsSync(oldImagePath)
      ) {
        fs.unlinkSync(
          oldImagePath
        );
      }
    }


    const imageUrl =
      `/uploads/profiles/${req.file.filename}`;


    user.profileImage =
      imageUrl;


    await user.save();


    res.status(200).json({
      success: true,

      message:
        "Profile picture updated successfully",

      profileImage:
        imageUrl,
    });

  } catch (error) {

    console.error(
      "Profile Image Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to upload profile image",
    });
  }
};


// =====================================================
// DELETE ACCOUNT
// =====================================================

export const deleteAccount = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.user.userId
      );


    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }


    // Delete profile image
    if (
      user.profileImage &&
      user.profileImage.startsWith(
        "/uploads/profiles/"
      )
    ) {

      const imagePath =
        path.join(
          process.cwd(),
          user.profileImage
        );


      if (
        fs.existsSync(imagePath)
      ) {
        fs.unlinkSync(
          imagePath
        );
      }
    }


    await User.findByIdAndDelete(
      req.user.userId
    );


    res.status(200).json({
      success: true,

      message:
        "Account deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete Account Error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete account",
    });
  }
};