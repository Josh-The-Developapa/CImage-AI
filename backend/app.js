import express, { json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
config();
import routes from './routes/router.js';
import errorHandler from './middleware/errorHandler.js';
const app = express();

app.use(json({ "type": "application/json" }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(cors({ origin: "http://localhost:3000" }));
app.use(morgan('dev'));
app.use(routes);
//Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${ PORT }`);
})

