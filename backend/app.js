const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const booksRoutes = require('./routes/books');
const readersRoutes = require('./routes/readers');
const requestedbookRoutes = require('./routes/requestedbook');
const loansRoutes = require('./routes/loans');
const authRoutes = require('./routes/auth'); // New import
const admin = require('./firebaseAdmin');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/books', booksRoutes);
app.use('/readers', readersRoutes);
app.use('/requestedbook', requestedbookRoutes);
app.use('/loans', loansRoutes);
app.use('/auth', authRoutes); // New route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
