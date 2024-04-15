import * as functions from 'firebase-functions';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { validateFirebaseIdToken } from './validateToken/validateToken';
import routes from '../src/routes/routes';

admin.initializeApp();
const app = express();
app.use(validateFirebaseIdToken);
app.use(routes); // Use the routes

exports.app = functions.https.onRequest(app);
