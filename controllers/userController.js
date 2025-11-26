// controllers/userController.js
import User from "../models/User.js";

// PUT /api/users/me
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updates = {};
    const allowedFields = ["name", "department", "year", "bio", "interests", "avatarUrl"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }  // return updated document
    ).select("-password");

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("updateUserProfile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
