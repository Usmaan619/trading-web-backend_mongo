import { APIError } from "rest-api-errors";

import { Transaction } from "../models/transaction.js";

export const createTransaction = async (data) => {
  try {
    if (!data) {
      throw new APIError(404, "404", "Transaction failed!");
    }
    return await Transaction.create(data);
  } catch (error) {
    throw error;
  }
};
