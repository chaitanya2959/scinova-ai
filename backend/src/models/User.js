import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      type: String,
      default: "",
    },

    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      aiResponseStyle: {
        type: String,
        enum: ["detailed", "balanced", "concise"],
        default: "balanced",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);