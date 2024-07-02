const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.get('/', authMiddleware(['admin', 'user']), productController.getAllProducts);
router.post('/', authMiddleware(['admin']), upload.single('productimage'), productController.validateProduct, productController.createProduct);
router.put('/:id', authMiddleware(['admin']), upload.single('productimage'), productController.validateProduct, productController.updateProduct);
router.delete('/:id', authMiddleware(['admin']), productController.deleteProduct);

module.exports = router;
