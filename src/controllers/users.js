const User = require("../models/users");
const PersonalData = require("../models/personalDetails");
const bcrypt = require("bcrypt");

const userCtrl = {
  login: async (req, res) => {
    const session = await User.startSession();
    await session.startTransaction();
    try {
      const opts = { session };
      const { email = null, password = null } = req.body;
      const data = await User.findOne({ email }, null, opts);
      if (!data) {
        await session.abortTransaction();
        await session.endSession();
        return res
          .status(400)
          .json({ success: false, msg: "Wrong credentials" });
      } else {
        const matched = await bcrypt.compare(password, data.password);
        if (matched) {
          await session.commitTransaction();
          await session.endSession();
          return res
            .status(200)
            .json({ success: true, msg: "login successfull" });
        } else {
          await session.abortTransaction();
          await session.endSession();
          return res
            .status(400)
            .json({ success: false, msg: "Wrong credentials" });
        }
      }
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res
        .status(500)
        .json({ success: false, msg: "internal server error" });
    }
  },

  signup: async (req, res) => {
    const session = await User.startSession();
    await session.startTransaction();
    try {
      const opts = { session };
      const data = await User.findOne({ email: req.body.email }, null, opts);
      if (data) {
        await session.abortTransaction();
        await session.endSession();
        return res
          .status(400)
          .json({ success: false, msg: "User already exists" });
      } else {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const resData = await User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPass,
          phone: req.body.phone,
        }).save(opts);
        if (!resData) {
          await session.abortTransaction();
          await session.endSession();
          return res
            .status(500)
            .json({ success: false, msg: "User not saved" });
        } else {
          const resPD = await PersonalData({
            email: req.body.email,
            pincode: req.body.pincode,
            state: req.body.state,
            country: req.body.country,
          }).save(opts);
          if (!resPD) {
            await session.abortTransaction();
            await session.endSession();
            return res
              .status(500)
              .json({ success: false, msg: "User not saved" });
          } else {
            await session.commitTransaction();
            await session.endSession();
            return res
              .status(200)
              .json({ success: true, msg: "User registration successfull" });
          }
        }
      }
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res
        .status(500)
        .json({ success: false, msg: "internal server error" });
    }
  },

  getPersonalDetails: async (req, res) => {
    const session = await User.startSession();
    await session.startTransaction();
    try {
      const opts = { session };
      const { email = null } = req.params;
      const data = await User.findOne({ email }, null, opts);
      if (!data) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(400).json({ success: false, msg: "User not found" });
      } else {
        const resData = await User.aggregate([
          {
            $match: { email },
          },
          {
            $lookup: {
              from: "personaldetails",
              localField: "email",
              foreignField: "email",
              as: "personal_info",
            },
          },
        ]);
        if (!resData) {
         await session.abortTransaction();
         await session.endSession();
         return res
           .status(500)
           .json({ success: false, msg: "Some error occured" });
       } else {
         await session.commitTransaction();
         await session.endSession();
         return res.status(200).json({
            success: true,
            msg: "User fetched successfully",
            data: resData,
         })
       }
      }
    } catch (err) {
      await session.abortTransaction();
      await session.endSession();
      return res
        .status(500)
        .json({ success: false, msg: "internal server error" });
    }
  },
};

module.exports = userCtrl;
