import * as functions from "firebase-functions";
import * as express from "express";
import * as admin from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import { config } from "../ServiceAccount.json";
const firebaseConfig = config;

admin.initializeApp(firebaseConfig);

import { validateFirebaseIdToken } from "./src/validateToken/validateToken";
import routes from "./src/routes/routes";
// Create Express app
const app = express();
app.use(validateFirebaseIdToken);
app.use(routes); // Use the routes
exports.app = onRequest({ cors: true }, app);
