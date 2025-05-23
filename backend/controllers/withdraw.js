const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request for only for seller
router.post(
  "/create-withdraw-request",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { amount } = req.body;

      const shop = await Shop.findById(req.seller._id);
      if (shop.availableBalance >= amount) {
        const data = {
          seller: req.seller,
          amount,
        };

        try {
          await sendMail({
            email: req.seller.email,
            subject: "Withdraw Request",
            message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3 days to 7 days to processing! `,
          });
          res.status(201).json({
            success: true,
          });
        } catch (error) {
          return next(new ErrorHandler(error.message, 500));
        }

        const withdraw = await Withdraw.create(data);

        shop.availableBalance = shop.availableBalance - amount;

        await shop.save();

        res.status(201).json({
          success: true,
          withdraw,
        });
      } else {
        return next(
          new ErrorHandler("You not have enough balance to withdraw!", 400)
        );
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all withdraws for admin

router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find().sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request for admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const { sellerId } = req.body;

      const withdraw = await Withdraw.findByIdAndUpdate(
        req.params.id,
        {
          status: "succeed",
          updatedAt: Date.now(),
        },
        { new: true }
      );

      const seller = await Shop.findById(sellerId);

      const transaction = {
        _id: withdraw._id,
        amount: withdraw.amount,
        updatedAt: withdraw.updatedAt,
        status: withdraw.status,
      };

      seller.transactions = [...seller.transactions, transaction];

      await seller.save();

      try {
        await sendMail({
          email: seller.email,
          subject: "Payment confirmation",
          message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount}$ is on the way. Delivery time depends on your bank's rules it usually takes 3 days to 7 days.`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }
      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
