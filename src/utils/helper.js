import _ from "lodash";
import { User } from "../models/user.js";

/**
 * Check for non-nullish value
 * other than null, undefined or blank('')
 */
export const hasValue = (value) => {
  return ![null, undefined, ""].includes(value);
};

export const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const generateVitCode = async (vehicleIndex, vehicleType, userId) => {
  let city = "";
  let state = "";
  const vitNumber = vehicleIndex.toLocaleString("en-US", {
    minimumIntegerDigits: 7,
    useGrouping: false,
  });

  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const currentDate = dd + "/" + mm + "/" + yyyy;
  if (vehicleType === "Private") {
    vehicleType = "S";
  } else {
    vehicleType = "T";
  }

  let checkUser = await User.findOne({
    _id: userId,
  });

  if (checkUser) {
    city = checkUser.city.trim();
    state = checkUser.stateCode;
  }
  let vitCode =
    currentDate +
    "/" +
    state +
    "/" +
    city.toUpperCase() +
    "/" +
    vehicleType +
    "/" +
    vitNumber;
  return vitCode;
};

export const generatePromoCode = async () => {
  try {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    const randomCharacters = await generateCharacters(2);
    return "SIW-" + randomCharacters + randomNumber;
  } catch (error) {
    console.log("error: ", error);
  }
};

export const generateCharacters = async (lenString) => {
  //define a variable consisting alphabets in small and capital letter
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let result = "";

  //loop to select a new character in each iteration
  for (let i = 0; i < lenString; i++) {
    let rnum = Math.floor(Math.random() * characters.length);
    result += characters.substring(rnum, rnum + 1);
  }
  return result.toUpperCase();
};

// using this function
export const sentOtp = async (to) => {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Set environment variables for your credentials
  // Read more at http://twil.io/secure
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SID;

  const client = require("twilio")(accountSid, authToken);

  const response = await client.verify.v2
    .services(verifySid)
    .verifications.create({ to, channel: "sms" });
  return response;
};

export const verifySentOtp = async (to, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const verifySid = process.env.TWILIO_VERIFY_SID;
  const client = require("twilio")(accountSid, authToken);

  const response = await client.verify.v2
    .services(verifySid)
    .verificationChecks.create({ to, code: otp });
  return response;
};

export const getOtp = () => Math.floor(1000 + Math.random() * 9000);
