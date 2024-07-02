const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware(['admin', 'user']), userController.getAllUsers);
router.post('/', authMiddleware(['admin']), userController.validateUser, userController.createUser);
router.put('/:id', authMiddleware(['admin']), userController.validateUser, userController.updateUser);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

module.exports = router;
