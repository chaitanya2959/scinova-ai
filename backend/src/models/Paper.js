import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    authors: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      default: "General",
    },

    pdfUrl: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aiStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed"
      ],
      default: "pending"
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Paper", paperSchema);