import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
const firebaseConfig = {
  apiKey: "AIzaSyC56xBydr6eT0LrF5CuJc10-AB7kkJsPJk",
  authDomain: "easyv2ray.firebaseapp.com",
  projectId: "easyv2ray",
  storageBucket: "easyv2ray.appspot.com",
  messagingSenderId: "774280027821",
  appId: "1:774280027821:web:b9527ceea2528a1257f024",
  measurementId: "G-SGWW2BCQRM",
};
admin.initializeApp(firebaseConfig);

import { validateFirebaseIdToken } from "./src/validateToken/validateToken";
import routes from "./src/routes/routes";
import { errorHandler } from "./src/dataManager/dataManager";
// Create Express app
const app = express();
app.use(errorHandler as unknown as express.RequestHandler);
app.use(validateFirebaseIdToken);
app.use(routes); // Use the routes
exports.app = onRequest({ cors: true }, app);
