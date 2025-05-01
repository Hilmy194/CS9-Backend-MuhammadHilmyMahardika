const {
  getItemPriceRepo,
  createTransactionRepo,
  payTransactionRepo,
  deleteTransactionRepo,
  getTransactionsRepo 
} = require("../repositories/transaction.repository");
const baseResponse = require("../utils/baseResponse.utils");

// Membuat transaksi baru (sudah ada)
exports.createTransaction = async (req, res) => {
  try {
    const { user_id, item_id, quantity } = req.body;

    if (!user_id || !item_id || !quantity || quantity <= 0) {
      return baseResponse(res, false, 400, "User ID, Item ID, and Quantity are required and must be > 0");
    }

    // Ambil harga item dari DB
    const itemPrice = await getItemPriceRepo(item_id);
    if (itemPrice === null) {
      return baseResponse(res, false, 404, "Item not found");
    }

    // Hitung total
    const total = itemPrice * quantity;

    // Simpan transaksi ke database
    const newTransaction = await createTransactionRepo({ user_id, item_id, quantity, total });
    if (!newTransaction) {
      return baseResponse(res, false, 400, "Failed to create transaction");
    }

    return baseResponse(res, true, 201, "Transaction created", newTransaction);
  } catch (error) {
    console.error("Error in createTransaction:", error);
    return baseResponse(res, false, 500, "Error creating transaction", error);
  }
};

// Melakukan pembayaran transaksi (sudah ada)
exports.payTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return baseResponse(res, false, 400, "Transaction ID is required");
    }

    const paidTransaction = await payTransactionRepo(id);
    if (!paidTransaction) {
      return baseResponse(res, false, 400, "Failed to pay transaction");
    }

    return baseResponse(res, true, 200, "Payment successful", paidTransaction);
  } catch (error) {
    console.error("Error in payTransaction:", error);
    return baseResponse(res, false, 500, "Error processing payment", error);
  }
};

// Menghapus transaksi (sudah ada)
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return baseResponse(res, false, 400, "Transaction ID is required");
    }

    const deletedTransaction = await deleteTransactionRepo(id);
    if (!deletedTransaction) {
      return baseResponse(res, false, 404, "Transaction not found");
    }

    return baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
  } catch (error) {
    console.error("Error in deleteTransaction:", error);
    return baseResponse(res, false, 500, "Error deleting transaction", error);
  }
};

// Mendapatkan semua transaksi beserta data user dan item terkait.
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsRepo();
    if (!transactions) {
      return baseResponse(res, false, 404, "Transactions not found");
    }
    return baseResponse(res, true, 200, "Transactions found", transactions);
  } catch (error) {
    console.error("Error in getTransactions:", error);
    return baseResponse(res, false, 500, "Error fetching transactions", error);
  }
};
