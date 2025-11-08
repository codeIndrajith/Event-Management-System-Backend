import admin from "firebase-admin";
import path from "path";
import { ErrorResponse } from "./errorResponse";

const serviceAccount = require(path.resolve(
  __dirname,
  "../firebase-config/system-firebase.json"
));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (
  token: string,
  title: string,
  body: string
) => {
  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Push notification sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending push notification:", error);
    throw new ErrorResponse("Failed to send push notification", 500);
  }
};
