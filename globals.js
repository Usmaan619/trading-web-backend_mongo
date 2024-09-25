import { fileURLToPath } from "url";
import { dirname } from "path";
/**
 * parses error so you can read error message and handle them accordingly
 * */
import pe from "parse-error";

const __filename = fileURLToPath(import.meta.url);
global.__dirname = dirname(__filename);

export const to = async (promise) => {
  return promise
    .then((data) => {
      return [null, data];
    })
    .catch((err) => [pe(err)]);
};

export const TE = (err_message, log) => {
  // TE stands for Throw Error
  if (log === true) {
    console.error(err_message);
  }

  throw new Error(err_message);
};

export const ReE = (res, err, code) => {
  // Error Web Response
  if (typeof err == "object" && typeof err.message != "undefined") {
    err = err.message;
  }

  if (typeof code !== "undefined") res.statusCode = code;

  return res.json({ success: false, message: err });
};

export const ReS = (res, data, code) => {
  // Success Web Response
  let send_data = { success: true };

  if (typeof data == "object") {
    send_data = Object.assign(data, send_data); //merge the objects
  }

  if (typeof code !== "undefined") res.statusCode = code;

  return res.json(send_data);
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const isEmptyObject = (obj) => {
  return Object.getOwnPropertyNames(obj).length === 0;
};
//This is here to handle all the uncaught promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Uncaught Error", pe(error));
});
