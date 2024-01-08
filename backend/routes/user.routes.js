// user.route.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { UserModel } = require("../models/user.model");
const { FormDataModel } = require("../models/formData.model");
const { authenticateToken } = require("../middleware/authMiddleware");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs").promises;

require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router();

// User Registration Route
userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username is already registered
    const isUserPresent = await UserModel.findOne({ username });
    if (isUserPresent) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({ username, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: "Registration successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// User Login Route
userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUserPresent = await UserModel.findOne({ username });
    if (!isUserPresent) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, isUserPresent.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: isUserPresent._id }, process.env.JWT_SECRET, { expiresIn: "4h" });

    res.status(200).json({ message: "Login successful", token, user: isUserPresent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// Form Submission Route with File Upload
userRouter.post("/submit-form", upload.single("photo"), authenticateToken, async (req, res) => {
  try {
    const { userId, name, age, address } = req.body;

    // Check if a file was uploaded
    const photo = req.file ? req.file.buffer.toString("base64") : undefined;

    // Create a new FormData document
    const formData = new FormDataModel({ userId, name, age, address, photo });

    // Save the data to the database
    await formData.save();

    res.status(201).json({ message: "Form submitted successfully", formData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



// Data Retrieval Route
userRouter.get("/get-form-data/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch form data from the database based on userId
    const formData = await FormDataModel.findOne({ userId });

    if (!formData) {
      return res.status(404).json({ error: "Form data not found" });
    }

    res.status(200).json({ formData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



userRouter.get("/generate-pdf/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch form data from the database based on userId
    const formData = await FormDataModel.findOne({ userId });

    if (!formData) {
      return res.status(404).json({ error: "Form data not found" });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add content to the PDF
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    // Add text to the PDF with form data
    page.drawText(`Name: ${formData.name}`, { x: 50, y: height - 100 });
    page.drawText(`Age: ${formData.age}`, { x: 50, y: height - 120 });
    page.drawText(`Address: ${formData.address}`, { x: 50, y: height - 140 });

    // Embed the photo in the PDF if available
    if (formData.photo) {
      // Create a temporary file for the image
      const imagePath = "./temp.jpg";

      // Save the base64-encoded image to the file
      await fs.writeFile(imagePath, Buffer.from(formData.photo, "base64"));

      // Embed the image from the file path
      const image = await pdfDoc.embedJpg(await fs.readFile(imagePath));

      // Log image dimensions for debugging
      console.log("Image Dimensions:", image.width, "x", image.height);

      // Scale the image as needed
      const imageDims = image.scale(0.5); // Adjust the scale as needed

      // Draw the image on the PDF
      page.drawImage(image, { x: 50, y: height - 200, width: imageDims.width, height: imageDims.height });

      // Remove the temporary file
      await fs.unlink(imagePath);
    }

    // Save the PDF to a buffer
    const pdfBytes = await pdfDoc.save();

    // Set the response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=form_data.pdf");

    // Send the PDF as a response
    res.status(200).send(pdfBytes);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = { userRouter };
