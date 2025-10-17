import Transaction from "../models/transactionModel.js";
import Account from "../models/accountModel.js";
import mongoose from "mongoose";

// Create transaction and update account balance
export const createTransaction = async (req, res) => {
  try {
    const { accountId, amount, category, type, date, merchant, note } = req.body;
    // validate account belongs to user
    const account = await Account.findById(accountId);
    if (!account || account.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Account not found" });
    }

    const tx = await Transaction.create({
      user: req.user._id,
      account: accountId,
      amount,
      category,
      type,
      date: date || Date.now(),
      merchant,
      note,
    });

    // update account balance (credit adds, debit subtracts)
    account.balance = type === "credit" ? account.balance + amount : account.balance - amount;
    await account.save();

    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get transactions for user (optionally filter by account, date range, category)
export const getTransactions = async (req, res) => {
  try {
    const { accountId, startDate, endDate, category, page = 1, limit = 50 } = req.query;
    const q = { user: req.user._id };
    if (accountId) q.account = accountId;
    if (category) q.category = category;
    if (startDate || endDate) q.date = {};
    if (startDate) q.date.$gte = new Date(startDate);
    if (endDate) q.date.$lte = new Date(endDate);

    const skip = (Number(page) - 1) * Number(limit);
    const txs = await Transaction.find(q)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json(txs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single transaction
export const getTransactionById = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx || tx.user.toString() !== req.user._id.toString()) return res.status(404).json({ message: "Not found" });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update transaction (and adjust account balance accordingly)
export const updateTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx || tx.user.toString() !== req.user._id.toString()) return res.status(404).json({ message: "Not found" });

    const oldAmount = tx.amount;
    const oldType = tx.type;
    const { amount, type, category, merchant, note, date } = req.body;

    // If account change allowed, not handling here (keep same account)
    if (amount !== undefined) tx.amount = amount;
    if (type !== undefined) tx.type = type;
    if (category !== undefined) tx.category = category;
    if (merchant !== undefined) tx.merchant = merchant;
    if (note !== undefined) tx.note = note;
    if (date !== undefined) tx.date = date;

    await tx.save();

    // adjust account balance delta = new effect - old effect
    const account = await Account.findById(tx.account);
    const oldEffect = oldType === "credit" ? oldAmount : -oldAmount;
    const newEffect = tx.type === "credit" ? tx.amount : -tx.amount;
    account.balance = account.balance - oldEffect + newEffect;
    await account.save();

    res.json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete transaction (and revert account balance)
export const deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx || tx.user.toString() !== req.user._id.toString()) return res.status(404).json({ message: "Not found" });

    const account = await Account.findById(tx.account);
    const effect = tx.type === "credit" ? tx.amount : -tx.amount;
    account.balance = account.balance - effect; // revert
    await account.save();

    await tx.remove();
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Aggregation: monthly spending by category for given year and user
export const monthlySpendingByCategory = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    const pipeline = [
      { $match: { user: req.user._id, date: { $gte: start, $lt: end }, type: "debit" } },
      { $project: { month: { $month: "$date" }, category: 1, amount: 1 } },
      { $group: { _id: { month: "$month", category: "$category" }, total: { $sum: "$amount" } } },
      { $group: { _id: "$_id.month", categories: { $push: { category: "$_id.category", total: "$total" } } } },
      { $sort: { _id: 1 } }
    ];

    const result = await Transaction.aggregate(pipeline).exec();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};