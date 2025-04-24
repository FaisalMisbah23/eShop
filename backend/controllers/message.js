const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/ErrorHandler");
const Message = require("../model/message");
const { upload } = require("../multer");
const path = require("path");

// create new message
router.post(
  "/create-new-message",
  upload.single("images"),
  catchAsyncError(async (req, res, next) => {
    try {
      const messagesData = req.body;

      if (req.file) {
        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        messagesData.images = fileUrl;
      }

      messagesData.conversationId = req.body.conversationId;
      messagesData.sender = req.body.sender;
      messagesData.text = req.body.text;

      const message = new Message({
        conversationId: messagesData.conversationId,
        text: messagesData.text,
        sender: messagesData.sender,
        images: messagesData.images ? messagesData.images : undefined,
      });

      await message.save();

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      return next(ErrorHandler(error.response.message), 500);
    }
  })
);

// get all messages with conversation id
router.get(
  "/get-all-messages/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.id,
      });

      res.status(201).json({
        success: true,
        messages,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  })
);

module.exports = router;
