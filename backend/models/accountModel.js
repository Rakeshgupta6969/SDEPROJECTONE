import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  accountName: { type: String, required: true },
  accountType: {
    type: String,
    enum: ["Savings", "Checking", "Credit Card", "Investment", "Other"],
    default: "Savings",
  },
  balance: { type: Number, default: 0 },
  bankName: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);