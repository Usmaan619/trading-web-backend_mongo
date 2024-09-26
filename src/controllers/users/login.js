import pk from "rest-api-errors";
const { APIError } = pk;
import { User } from "../../models/user.js";
import { getToken } from "../../middleware/checkAuth.js";

export const login = async (req, res, next) => {
  try {
    const {
      body: { email, password, rememberMe },
    } = req;

    const user = await User.findOne({ email });

    if (!user) {
      throw new APIError(422, "422", "User not registered, sign-up first.");
    }
    const match = await user.comparePassword(password, user.password);

    if (!match) {
      throw new APIError(422, "422", "Invalid credentials");
    }

    const token = getToken(
      user?._id,
      user?.email,
      rememberMe ? rememberMe : false
    );

    res.json({
      login: true,
      token,
      message: "Login successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    const number = req.body.number;
    if (!number) throw new Error("Please pass a mobile number.");
    const otp = false;
    let user;
    user = await User.findOne({ mobNo: number });
    if (user) {
      user.otp = otp;
      await user.save();
    } else {
      user = await User.create({ mobNo: number, otp });
    }
    const message = `This is your One Time Password: ${otp}`;
    // for send otp
    const response = false;
    res.json({
      response,
      user,
      message: "OTP sent successfully!",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWithRole = async (id) => {
  return await User.findById(
    id,
    {
      password: 0,
      __v: 0,
    },
    {
      lean: true,
      populate: [
        {
          path: "role",
          model: "Role",
          select: "roleName permissions",
          populate: [
            {
              path: "permissions",
              model: "Permission",
              select: "name alias",
            },
          ],
        },
      ],
    }
  );
};

export const adminMe = async (req, res, next) => {
  try {
    const id = req.user._id;

    if (!id) throw new APIError(422, "422", "Invalid token.");

    let user = await getUserWithRole(id);

    let response = { success: true, user };

    if (user.impersonUser) {
      response.actualUser = user;

      response.user = await getUserWithRole(user.impersonUser);
      delete user.impersonUser;
      delete user.role;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserWithCountry = async (id) => {
  return await User.findById(
    id,
    {
      password: 0,
      __v: 0,
    },
    {
      lean: true,
      populate: [
        {
          path: "countryId",
          model: "Country",
        },
      ],
    }
  );
};

export const me = async (req, res, next) => {
  try {
    let user = req?.user;

    if (!req?.user?._id) throw new APIError(422, "422", "Invalid token.");
    delete user.password;

    const card = await Card.findOne({ userId: user?._id });

    if (req?.user?.countryId) {
      user = await getUserWithCountry(user?._id);
    }

    res.json({ success: true, user, card, todayDate: new Date() });
  } catch (error) {
    next(error);
  }
};
