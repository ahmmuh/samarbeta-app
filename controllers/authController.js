import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Unit from "../models/unit.js";

export const signUp = async (req, res, next) => {
  const { name, email, phone, username, password, role, unitId } = req.body;

  try {
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({ message: "Enheten hittades inte" });
    }
    //Check Email
    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already  exists" });

    //Check Phone

    const existingPhone = await User.findOne({ phone });
    if (existingPhone)
      return res.status(400).json({ message: "Phone already  exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
      role,
      unit: unitId,
    });

    console.log("Ny ANvändare kommer att registrera:", user);
    await user.save();
    unit.users.push(user._id);
    unit.save();
    res.status(201).json({ message: "User created" });
  } catch (error) {
    console.error("Fel vid skapande av användare:", error); // Lägg till denna rad
    return res.status(500).json({ message: "User Could not be created " });
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("LOGIN FUNCTION KÖRS", req.body);

    const user = await User.findOne({ username }).populate("unit");
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
        unitId: user.unit?._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60,
    });

    console.log("TOKEN", token);

    res.json({ token, user });
  } catch (err) {
    next(err); // Passes error to Express error handler
  }
};

export const getCurrentUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ message: "Ingen token" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token hittades ej" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Serverfel vid hämtning av användarens info" });
  }
};

//Logout
