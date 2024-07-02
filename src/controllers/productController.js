const { body, validationResult } = require('express-validator');
const Product = require('../models/productModel');
const cache = require('../utils/cache');

exports.validateProduct = [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('description').not().isEmpty().withMessage('Description is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.getAllProducts = async (req, res) => {
    try {
        const cachedProducts = cache.get('products');
        if (cachedProducts) {
            return res.status(200).json(cachedProducts);
        }

        const products = await Product.findAll();
        cache.set('products', products);

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const productimage = req.file ? req.file.path : null;
        const newProduct = await Product.create({ name, price, productimage, description });
        res.status(201).json(newProduct);
        cache.del('products');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const product = await Product.findByPk(id);
        if (product) {
            product.name = name;
            product.price = price;
            product.description = description; 
            product.productimage = req.file ? req.file.path : product.productimage;
            await product.save();

            cache.del('products');

            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.destroy({ where: { id } });
        if (result) {

            cache.del('products');

            res.status(204).end();
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
