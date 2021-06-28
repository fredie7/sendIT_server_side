import "core-js/stable";
import "regenerator-runtime/runtime";
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import { Pool } from 'pg';
import authRoute from './routers/auth';
import parcelRoutes from './routers/parcel';
import userRoutes from './routers/user';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cors());


app.use('/api/v1/auth', authRoute);
app.use('/api/v1', parcelRoutes);
app.use('/api/v1', userRoutes);

app.get('/', (req, res) => res.status(200).json({ mesage: 'app started......' }));

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

export default app;
