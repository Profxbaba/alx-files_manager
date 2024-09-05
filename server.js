import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';

const app = express();

// Middleware
app.use(bodyParser.json());

// Use routes
app.use('/', router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
