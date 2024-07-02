const { validationResult, body } = require('express-validator');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const cache = require('../utils/cache');

exports.validateOrder = [
    body('user_id').isInt({ min: 1 }).withMessage('User ID must be a valid integer'),
    body('product_id').isInt({ min: 1 }).withMessage('Product ID must be a valid integer'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
    body('status').isIn(['pending', 'completed', 'cancelled']).withMessage('Invalid status value'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.getAllOrders = async (req, res) => {
    try {
        const cachedOrders = cache.get('orders');
        if (cachedOrders) {
            return res.status(200).json(cachedOrders);
        }

        const orders = await Order.findAll();
        cache.set('orders', orders);

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { user_id, product_id, quantity, status } = req.body;

        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const total_price = product.price * quantity;
        console.log({ user_id, product_id, quantity, total_price, status });
        const newOrder = await Order.create({ user_id, product_id, quantity, total_price, status });
        res.status(201).json(newOrder);
        cache.del('orders');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, product_id, quantity, status } = req.body;
        const order = await Order.findByPk(id);

        if (order) {
            const product = await Product.findByPk(product_id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const total_price = product.price * quantity;

            order.user_id = user_id;
            order.product_id = product_id;
            order.quantity = quantity;
            order.total_price = total_price; 
            order.status = status;
            await order.save();

            cache.del('orders');

            res.status(200).json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Order.destroy({ where: { id } });
        if (result) {

            cache.del('orders');

            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
