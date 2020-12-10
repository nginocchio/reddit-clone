import express from 'express';
import {
  indexPage,
  messagesPage,
  addMessage,
  registerUser,
  logInUser,
} from '../controllers';
import { modifyMessage } from '../middleware';
require('../utils/passport-config');
const indexRouter = express.Router();

indexRouter.get('/', indexPage);
indexRouter.get('/messages', messagesPage);
indexRouter.post('/messages', modifyMessage, addMessage);
indexRouter.post('/register', registerUser);
indexRouter.post('/login', logInUser);

export default indexRouter;
