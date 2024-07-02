const request = require('supertest');
const app = require('../app');
const { validationResult } = require('express-validator');
const { Order, Product } = require('../models');
const cache = require('../utils/cache');

describe('Order Endpoints', () => {
  beforeEach(async () => {
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });

    await Product.create({
      name: 'Test Product',
      price: 50,
    });
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const response = await request(app)
        .get('/orders')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return cached orders if available', async () => {
      const orders = [
        { user_id: 1, product_id: 1, quantity: 2, total_price: 100, status: 'pending' },
        { user_id: 2, product_id: 1, quantity: 3, total_price: 150, status: 'completed' },
      ];

      cache.set('orders', orders);

      const response = await request(app)
        .get('/orders')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(orders);
    });

    it('should handle errors gracefully', async () => {
      await Order.destroy({ where: {} });

      const response = await request(app)
        .get('/orders')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder = {
        user_id: 1,
        product_id: 1,
        quantity: 2,
        status: 'pending',
      };

      const response = await request(app)
        .post('/orders')
        .send(newOrder)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should handle validation errors', async () => {
      const invalidOrderData = {
        user_id: 'invalid', // user_id should be an integer
        product_id: 1,
        quantity: 0, // quantity should be positive
        status: 'invalid_status', // invalid status value
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidOrderData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors).toBeTruthy();
    });

    it('should handle product not found', async () => {
      const orderWithNonExistentProduct = {
        user_id: 1,
        product_id: 999, // non-existent product ID
        quantity: 2,
        status: 'pending',
      };

      const response = await request(app)
        .post('/orders')
        .send(orderWithNonExistentProduct)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Product not found');
    });

    it('should handle errors gracefully', async () => {
      await Product.destroy({ where: {} });

      const newOrder = {
        user_id: 1,
        product_id: 1,
        quantity: 2,
        status: 'pending',
      };

      const response = await request(app)
        .post('/orders')
        .send(newOrder)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('PUT /orders/:id', () => {
    it('should update an existing order', async () => {
      const updatedOrder = {
        user_id: 1,
        product_id: 1,
        quantity: 3,
        status: 'completed',
      };

      const orders = await Order.findAll();
      const orderId = orders[0].id;

      const response = await request(app)
        .put(`/orders/${orderId}`)
        .send(updatedOrder)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('quantity', 3);
    });

    it('should handle order not found', async () => {
      const updatedOrder = {
        user_id: 1,
        product_id: 1,
        quantity: 3,
        status: 'completed',
      };

      const response = await request(app)
        .put('/orders/999')
        .send(updatedOrder)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Order not found');
    });

    it('should handle product not found', async () => {
      const orders = await Order.findAll();
      const orderId = orders[0].id;

      const updatedOrderWithNonExistentProduct = {
        user_id: 1,
        product_id: 999, // non-existent product ID
        quantity: 3,
        status: 'completed',
      };

      const response = await request(app)
        .put(`/orders/${orderId}`)
        .send(updatedOrderWithNonExistentProduct)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Product not found');
    });

    it('should handle errors gracefully', async () => {
      await Order.destroy({ where: {} });

      const updatedOrder = {
        user_id: 1,
        product_id: 1,
        quantity: 3,
        status: 'completed',
      };

      const orders = await Order.findAll();
      const orderId = orders[0].id;

      const response = await request(app)
        .put(`/orders/${orderId}`)
        .send(updatedOrder)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete an existing order', async () => {
      const orders = await Order.findAll();
      const orderId = orders[0].id;

      const response = await request(app)
        .delete(`/orders/${orderId}`)
        .expect(204);
    });

    it('should handle order not found', async () => {
      const response = await request(app)
        .delete('/orders/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Order not found');
    });

    it('should handle errors gracefully', async () => {
      await Order.destroy({ where: {} });

      const orders = await Order.findAll();
      const orderId = orders[0].id;

      const response = await request(app)
        .delete(`/orders/${orderId}`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });
});
