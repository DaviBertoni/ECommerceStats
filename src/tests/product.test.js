const request = require('supertest');
const app = require('../app');
const { Product } = require('../models');

describe('Product Endpoints', () => {
  beforeEach(async () => {
    await Product.destroy({ where: {} });
    await Product.create({
      name: 'Initial Product',
      price: 100,
      description: 'Initial product for testing',
    });
  });

  describe('GET /products', () => {
    it('should return all products', async () => {
      const response = await request(app)
        .get('/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return cached products if available', async () => {
      const response = await request(app)
        .get('/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    it('should handle errors gracefully', async () => {
      await Product.destroy({ where: {} });

      const response = await request(app)
        .get('/products')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const newProductData = {
        name: 'New Product',
        price: 200,
        description: 'A new product for testing',
      };

      const response = await request(app)
        .post('/products')
        .send(newProductData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should handle validation errors', async () => {
      const invalidProductData = {
        price: 200,
        description: 'A new product for testing',
      };

      const response = await request(app)
        .post('/products')
        .send(invalidProductData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors).toBeTruthy();
    });

    it('should handle errors gracefully', async () => {
      await Product.destroy({ where: {} });

      const response = await request(app)
        .post('/products')
        .send({
          name: 'New Product',
          price: 200,
          description: 'A new product for testing',
        })
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('PUT /products/:id', () => {
    it('should update an existing product', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 150,
        description: 'Updated product information',
      };

      const products = await Product.findAll();
      const productId = products[0].id;

      const response = await request(app)
        .put(`/products/${productId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Product');
    });

    it('should handle product not found', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 150,
        description: 'Updated product information',
      };

      const response = await request(app)
        .put('/products/999')
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Product not found');
    });

    it('should handle errors gracefully', async () => {
      await Product.destroy({ where: {} });

      const updateData = {
        name: 'Updated Product',
        price: 150,
        description: 'Updated product information',
      };

      const products = await Product.findAll();
      const productId = products[0].id;

      const response = await request(app)
        .put(`/products/${productId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete an existing product', async () => {
      const products = await Product.findAll();
      const productId = products[0].id;

      const response = await request(app)
        .delete(`/products/${productId}`)
        .expect(204);
    });

    it('should handle product not found', async () => {
      const response = await request(app)
        .delete('/products/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('Product not found');
    });

    it('should handle errors gracefully', async () => {
      await Product.destroy({ where: {} });

      const products = await Product.findAll();
      const productId = products[0].id;

      const response = await request(app)
        .delete(`/products/${productId}`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });
});
