import express from 'express';
import { aboutPage } from '../controllers';
const aboutRouter = express.Router();

aboutRouter.get('/about', aboutPage);

export default aboutRouter;
