import Account from "../models/accountModel.js";
import Transaction from "../models/transactionModel.js";

// Create account
export const createAccount = async (req, res) => {
  try {
    const { accountName, accountType, balance = 0, bankName = "" } = req.body;
    const account = await Account.create({
      user: req.user._id,
      accountName,
      accountType,
      balance,
      bankName,
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all accounts for user
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single account by id (ensure user owns it)
export const getAccountById = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update account
export const updateAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Account not found" });
    }
    const { accountName, accountType, balance, bankName } = req.body;
    if (accountName !== undefined) account.accountName = accountName;
    if (accountType !== undefined) account.accountType = accountType;
    if (balance !== undefined) account.balance = balance;
    if (bankName !== undefined) account.bankName = bankName;
    const updated = await account.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete account (and optionally its transactions)
export const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account || account.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Account not found" });
    }
    // optionally delete related transactions
    await Transaction.deleteMany({ account: account._id });
    await account.remove();
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
