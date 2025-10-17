import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  date: { type: Date, default: Date.now },
  merchant: { type: String, default: "" },
  note: { type: String, default: "" },
}, { timestamps: true });

transactionSchema.index({ user: 1, account: 1, date: -1 }); // helpful index
export default mongoose.model("Transaction", transactionSchema);