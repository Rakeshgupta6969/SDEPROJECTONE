import express from "express";
import {
  createTransaction, getTransactions, getTransactionById,
  updateTransaction, deleteTransaction, monthlySpendingByCategory
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createTransaction).get(getTransactions);
router.route("/aggregate/monthly-by-category").get(monthlySpendingByCategory);
router.route("/:id").get(getTransactionById).put(updateTransaction).delete(deleteTransaction);

export default router;