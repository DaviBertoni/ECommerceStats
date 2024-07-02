const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');


const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later.'
});

module.exports = (app) => {
    app.use(helmet());
    app.use('/api', limiter);
    app.use(xssClean());
    app.use(mongoSanitize());
};
