// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    department: { type: String },
    year: { type: Number },

    bio: String,
    interests: [String],
    avatarUrl: {type:String},
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
