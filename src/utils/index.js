import { SNS } from "aws-sdk";

export const getOtp = () => Math.floor(100000 + Math.random() * 900000);

export const sendSMS = async ({ message, number, subject = "VITAG" }) => {
  const params = {
    Message: message,
    PhoneNumber: "+91" + number,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: subject,
      },
    },
  };

  try {
    if (process.env.ENABLE_SMS === "true") {
      return await new SNS({ apiVersion: "2010-03-31" })
        .publish(params)
        .promise();
    } else {
      return "SMS is disabled by admin.";
    }
  } catch (error) {
    throw error;
  }
};
