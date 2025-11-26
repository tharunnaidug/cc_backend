// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    techStack: [String],      // ["React", "Node", "MongoDB"]
    lookingFor: [String],     // ["UI/UX", "Backend dev"]
    department: String,       // optional: BCA, CSE, etc.

    visibility: {
      type: String,
      enum: ["college", "public"],
      default: "college",
    },

    status: {
      type: String,
      enum: ["recruiting", "in-progress", "completed"],
      default: "recruiting",
    },

    links: {
      github: String,
      docs: String,
      other: String,
    },

    joinRequests: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
