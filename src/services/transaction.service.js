import { Transaction } from "../models/transaction.js";
import pkg from 'rest-api-errors';
const { APIError } = pkg;

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
