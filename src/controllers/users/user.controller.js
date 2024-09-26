import pk from 'rest-api-errors';
const { APIError } = pk;
import { createEmailTransporter } from "../../services/helper.js";
import { User } from "../../models/user.js";
import { Enquiry } from "../../models/enquiry.js";
import { ContactUs } from "../../models/contactUs.js";
/**
 * Create a contact us entry for bhaifinance.com
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const createContactUs = async (req, res, next) => {
  try {
    const data = await ContactUs.create(req.body);

    let emailTransporter = await createEmailTransporter();

    let emailOptions = {
      subject: "BhaiFinance.com - Contact Us",
      to: process.env.BHAIFINANCE_EMAIL,
      from: process.env.BHAIPAY_EMAIL,

      html: `
      Hello,<br>
      Email: ${req.body.email}<br>
      Name: ${req.body.name}<br>
      Subject: ${req.body.subject}<br>
      Message: ${req.body.message}<br>
      `,
    };
    const response = await emailTransporter.sendMail(emailOptions);

    if (!response) {
      throw new APIError(422, "422", "Email sending failed.");
    }

    res.json({
      success: true,
      message: "Email send successful",
    });
  } catch (error) {
    next(error);
  }
};
export const updateUserProfile = async (path, _id) => {
  try {
    const data = await User.findOne({ _id: _id });

    if (!data) {
      throw new APIError(404, "404", "Profile update failed");
    }
    data.userProfile = path;
    data.save();
    return data?.userProfile;
  } catch (error) {
    error;
  }
};
export const createEnquiry = async (body) => {
  try {
    const data = await Enquiry.create(body);

    let emailTransporter = await createEmailTransporter();
    let emailOptions = {
      subject: "Maazmemon.com - Get in touch.",
      to: process.env.MAAZ_EMAIL,
      from: process.env.BHAIPAY_EMAIL,
      html: `Hello Maaz,<br><br>
      Email: ${body.email}<br>
      subject: ${body.subject}<br>
      message: ${body.message}`,
    };
    const response = await emailTransporter.sendMail(emailOptions);
    return response;
  } catch (error) {
    error;
  }
};

export const changePassword = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new APIError(401, "401", "Token expired");
    }

    console.log(
      "req.user.comparePassword(req",
      await req.user.comparePassword(
        req.body.currentPassword,
        req.user.password
      )
    );
    if (
      !(await req.user.comparePassword(
        req.body.currentPassword,
        req.user.password
      ))
    ) {
      throw new APIError(422, "422", "Invalid Password");
    }
    req.user.password = req.body.newPassword;
    await req.user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

async (body, id) => {
  const data = await User.findOne({ _id: id });
  if (User.password == body.oldPassword) {
    data.password = body.newPassword;
    data.save();
    res.json({
      success: true,
      data,
    });
  } else {
  }
};
export const createWaitlist = async (req, res, next) => {
  try {
    const data = await WaitList.create(req.body);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
