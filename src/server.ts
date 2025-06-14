import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import errorHandler from '@/common/middleware/errorHandler';
// import rateLimiter from '@/common/middleware/rateLimiter';
import requestLogger from '@/common/middleware/requestLogger';
import { reportRouter } from '@/api/report/reportRouter';
import { companyRouter } from '@/api/company/companyRouter';
import { userRouter } from '@/api/user/userRouter';
import { assetRouter } from '@/api/assets/assetRouter';
import { incidentRouter } from '@/api/incidents/incidentRouter';
import { taskRouter } from '@/api/tasks/taskRouter';
import { indicatorRouter } from '@/api/indicators/indicatorRouter';

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use('/users', userRouter);
app.use('/reports', reportRouter);
app.use('/accounts', companyRouter);
app.use('/assets', assetRouter);
app.use('/incidents', incidentRouter);
app.use('/tasks', taskRouter);
app.use('/indicators', indicatorRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
