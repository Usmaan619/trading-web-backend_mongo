import { User } from "../models/user.js";
import { asyncForEach, generatePromoCode, getOtp } from "../utils/helper.js";
import { upload } from "./s3.service.js";
import pk from "rest-api-errors";
const { APIError } = pk;
import { forgetPasswordTemplate } from "../emailTemplates/forgetPassword.template.js";
import { sentOtp, verifySentOtp, createEmailTransporter } from "./helper.js";
import { Transaction } from "../models/transaction.js";
import { Expo } from "expo-server-sdk";

export const signUpUser = async (data) => {
  try {
    let userData = {
      promoCode: await generatePromoCode(),
      ...data,
    };

    return await User.create(userData);
  } catch (error) {
    throw error;
  }
};
export const updateUser = async (data, files) => {
  try {
    const checkUser = await User.findOne({
      _id: data.userId,
    });
    if (checkUser) {
      let id = checkUser._id;
      let imageUrls = {};
      await asyncForEach(files, async (file) => {
        imageUrls[file.fieldname] = await upload(
          file,
          `users/${data.mobNo}`,
          file.fieldname.toUpperCase()
        );
      });

      const dataObj = {
        ...data,
        ...imageUrls,
      };
      const user = await User.updateOne({ _id: id }, { $set: dataObj });
      if (user) {
        const updatedUser = await User.findOne({
          _id: id,
        });
        return updatedUser;
      }
    }
    return checkUser;
  } catch (error) {
    throw error;
  }
};

export const getUserWithToken = async (mobNo) => {
  let user = await User.findOne({ isDeleted: false, mobNo });

  if (!user) {
    throw new APIError(404, "404", "User Not Found!");
  }

  user.isMobNoVerified = true;
  await user.save();

  const token = sendToken(user._id, user.email);

  return {
    token,
    user,
  };
};

export const sendToken = (id, email) => {
  return jwt.sign(
    {
      id: id,
      email: email,
    },
    SECRET,
    { expiresIn: "90 days" }
  );
};

export const verifyOtp = async (req, res) => {
  try {
    const otp = req.otp;

    const user = await User.findOne({ otp });

    if (!user) {
      throw new APIError(404, "404", "OTP is incorrect!");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const getDBKey = (key) => {
  switch (key) {
    case "Metamask":
      return "metaMaskBalance";
    case "Bhaipay Card":
      return "bhaiPayCardBalance";
    case "Robinhood":
      return "robinhoodBalance";
    case "Fidelity":
      return "fidelityBalance";
    case "CoinBase Wallet":
      return "coinBaseBalance";

    default:
      return null;
      break;
  }
};

export const addFunds = async (data, userId) => {
  try {
    data.status = "pending";
    data.userId = userId;
    data.transacitonType = "others";
    data.description = "others";
    let userBalance = await UserBalance.findOne({ userId });
    const deductfrom = getDBKey(data.deductFrom);
    if (!deductfrom) {
      throw new Error("Invalid ");
    }
    const addto = getDBKey(data.addTo);
    if (!addto) {
      throw new Error("Invalid ");
    }
    if (data.amount > userBalance[deductfrom]) {
      data.status = "failed";
      throw new Error("Not enough funds");
    }
    if (data.amount <= userBalance[deductfrom]) {
      data.status = "completed";
      userBalance[deductfrom] -= data.amount;
      userBalance[addto] += data.amount;
      await userBalance.save();

      return (transaction = await Transaction.create(data));
    }
  } catch (Error) {
    const transaction = await Transaction.create(data);
    throw Error;
  }
};
export const userDetail = async (req, res) => {
  try {
    const userId = req.query.userId;
    const totalVehicle = await Vehicle.countDocuments({ userId });
    const approved = await Vehicle.countDocuments({ userId, approved: true });
    const unapproved = await Vehicle.countDocuments({
      userId,
      approved: {
        $ne: true,
      },
    });

    return {
      totalVehicle,
      approved,
      unapproved,
    };
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {String} email - required
 * @param {{name,mobNo,userProfile,providerId}} Object - Optional
 * @returns {String} token
 *
 * Create a new user using Gmail and add gmail as a providers
 */

export const signUpWithGoogle = async (
  email,
  { name = "", mobNo = "", userProfile = "", providerId, provider }
) => {
  try {
    if (!email) {
      throw new APIError(422, "422", "Email must be passed.");
    }
    const user = await User.create({
      email,
      providers: [{ providerId, type: provider }],
    });

    const card = await Card.create({
      amount: 0,
      currencyCode: "USD",
      currencySign: "$",
      status: "not asign",
      last4: 0,
      userId: user._id,
    });

    user.cardId = card._id;
    if (name) user.name = name;
    if (userProfile) user.userProfile = userProfile;
    if (mobNo) user.mobNo = mobNo;

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {String} email - required
 * @param {{name,mobNo,userProfile,providerId}} Object - Optional
 * @returns {String} token
 *
 * Authenticate a user using Gmail
 */
export const loginWithGoogle = async (
  email,
  { name = "", mobNo = "", userProfile = "", providerId, provider }
) => {
  try {
    if (!email) {
      throw new APIError(422, "422", "Email must be passed.");
    }
    let user = await User.findOne({ email });

    if (!user) {
      user = await signUpWithGoogle(email, {
        name,
        mobNo,
        userProfile,
        providerId,
        provider,
      });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {String} name - required
 * @param {} Object - Optional
 * @returns {String}
 *
 * Authenticate a user using Gmail
 */
export const profileNameUpdate = async (name, countryId, userId) => {
  try {
    if (!name) {
      throw new APIError(422, "422", "Name must be passed.");
    }
    let user = await User.findOne({ _id: userId });

    if (!user) {
      throw new APIError(422, "422", "User not found.");
    }
    user.name = name;
    if (countryId) user.countryId = countryId;
    user.save();

    return user;
  } catch (error) {
    throw error;
  }
};

export const checkAndSendOtp = async (userId, email, mobNo, countryCode) => {
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw new APIError(400, "400", "Email doesn't exist");
    }

    if (email) {
      user.emailOtp = getOtp();
      const emailTransporter = await createEmailTransporter();
      const emailOptions = {
        subject: "OTP for Bhaipay App email update.",
        to: user?.email,
        from: process.env.BHAIPAY_EMAIL,
        html: forgetPasswordTemplate(user.emailOtp, ""),
      };
      await emailTransporter.sendMail(emailOptions);
    }

    if (mobNo) {
      const mobileNum = `${countryCode}${mobNo}`;
      await sentOtp(mobileNum);
      user.countryCode = countryCode;
    }
    await user.save();

    return "OTP sent successfully";
  } catch (error) {
    throw error;
  }
};

export const otpVerifyEmailAndMobNo = async (
  email,
  mobNo,
  userId,
  emailOtp,
  mobNoOtp,
  countryCode,
  countryId
) => {
  try {
    let user = await User.findOne({ _id: userId });
    if (!user) {
      throw new APIError("400", 400, "User doesn't exist.");
    }

    if (email && emailOtp) {
      if (user.emailOtp !== emailOtp) {
        throw new APIError("422", 422, "Invalid OTP.");
      }
      user.emailOtp = "";
      user.email = email;
    }

    if (mobNo && mobNoOtp) {
      const mobileNum = `${countryCode}${mobNo}`;
      const res = await verifySentOtp(mobileNum, mobNo.toString());
      if (!res) {
        throw new APIError(422, "422", "Otp verify failed.");
      }
      user.mobNo = mobNo;
      user.countryCode = countryCode;
    }
    if (countryId) user.countryId = countryId;
    await user.save();
    return "Profile updated";
  } catch (error) {
    throw error;
  }
};

export const loginWithWalletConnect = async (body) => {
  try {
    let newUser;

    const findUser = await User.find({
      providers: {
        $elemMatch: { id: body?.wallet_id },
      },
    });

    if (findUser.length === 0) {
      newUser = new User({
        providers: [{ id: body?.wallet_id, name: body?.wallet_name }],
      });
      await newUser.save();
    } else if (findUser.length > 1) {
      newUser = findUser;
    } else {
      const walletId = findUser[0].providers.find(
        (w) => w.id === body?.wallet_id
      );

      if (findUser[0].providers.length === 1) {
        if (!walletId) {
          findUser[0].providers.push({
            id: body?.wallet_id,
            name: body?.wallet_name,
          });
          newUser = findUser[0];
          await newUser.save();
        } else {
          newUser = findUser;
        }
      } else {
        newUser = findUser;
      }
    }

    return newUser;
  } catch (error) {
    throw error;
  }
};

export const pushNotification = async (
  notificationToken,
  notificationTitle,
  notificationBody
) => {
  /**
     * 
    Use this code you not use this face this error (const expo = new Expo();)
    "Expo.chunkPushNotifications is not a function"

     * 
     */
  const expo = new Expo();
  try {
    if (!notificationToken) {
      throw new APIError(404, "404", "Token missing");
    }

    const tokensArray = Array.isArray(notificationToken)
      ? notificationToken
      : [notificationToken];

    const messages = tokensArray.map((token) => ({
      to: token,
      sound: "default",
      badge: 1,
      title: notificationTitle ? notificationTitle : "Test Title",
      body: notificationBody ? notificationBody : "Test Body",
    }));

    const chunks = expo.chunkPushNotifications(messages);
    const results = await Promise.all(
      chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk))
    );

    const successResponses = results.reduce(
      (acc, result) => acc.concat(result),
      []
    );

    return successResponses;
  } catch (error) {
    throw error;
  }
};
