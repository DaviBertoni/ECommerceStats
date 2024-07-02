const express = require('express');
const bodyParser = require('body-parser');
const securityMiddleware = require('./middlewares/securityMiddleware');
const cacheMiddleware = require('./middlewares/cacheMiddleware');
const uploadMiddleware = require('./middlewares/uploadMiddleware');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

securityMiddleware(app);

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/products', cacheMiddleware);
app.use('/orders', cacheMiddleware);

app.post('/upload', uploadMiddleware.single('file'), (req, res) => {
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

module.exports = app;
