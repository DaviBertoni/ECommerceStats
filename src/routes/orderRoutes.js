const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware(['admin', 'user']), orderController.getAllOrders);
router.post('/', authMiddleware(['admin', 'user']), orderController.validateOrder, orderController.createOrder);
router.put('/:id', authMiddleware(['admin', 'user']), orderController.validateOrder, orderController.updateOrder);
router.delete('/:id', authMiddleware(['admin', 'user']), orderController.deleteOrder);

module.exports = router;
