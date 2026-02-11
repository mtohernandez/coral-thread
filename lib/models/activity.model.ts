import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "reply", "repost"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ targetUser: 1, createdAt: -1 });
activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index(
  { type: 1, user: 1, thread: 1 },
  { unique: true, partialFilterExpression: { type: { $in: ["like", "repost"] } } }
);

const Activity = mongoose.models.Activity || mongoose.model("Activity", activitySchema);

export default Activity;
