import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import wordListRoutes from './routes/wordList.routes';
import { logger } from './utils/logger';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Body parsing
app.use(express.json());

// Routes
app.use('/api/wordlists', wordListRoutes);

// Error handling
app.use(errorHandler);

const port = config.port;

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});