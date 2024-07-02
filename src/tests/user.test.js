const request = require('supertest');
const app = require('../app');
const { validationResult } = require('express-validator');
const { User } = require('../models');
const cache = require('../utils/cache');

describe('User Endpoints', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
    await User.create({
      username: 'initial_user',
      email: 'initial@example.com',
      password: 'password123',
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    it('should return cached users if available', async () => {
      const users = [
        { username: 'user1', email: 'user1@example.com', password: 'password123' },
        { username: 'user2', email: 'user2@example.com', password: 'password123' },
      ];

      cache.set('users', users);

      const response = await request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(users);
    });

    it('should handle errors gracefully', async () => {
      await User.destroy({ where: {} });

      const response = await request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        username: 'new_user',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should handle validation errors', async () => {
      const invalidUserData = {
        email: 'invalidemail', // invalid email format
        password: '123', // password too short
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUserData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.errors).toBeTruthy();
    });

    it('should handle email already in use', async () => {
      const existingUser = {
        username: 'existing_user',
        email: 'existing@example.com',
        password: 'password123',
      };

      await User.create(existingUser);

      const response = await request(app)
        .post('/users')
        .send(existingUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Email already in use');
    });

    it('should handle errors gracefully', async () => {
      await User.destroy({ where: {} });

      const newUser = {
        username: 'new_user',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      const updateUser = {
        username: 'updated_user',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      const users = await User.findAll();
      const userId = users[0].id;

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updateUser)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('username', 'updated_user');
    });

    it('should handle user not found', async () => {
      const updateUser = {
        username: 'updated_user',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      const response = await request(app)
        .put('/users/999')
        .send(updateUser)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should handle email already in use', async () => {
      const existingUser = {
        username: 'existing_user',
        email: 'existing@example.com',
        password: 'password123',
      };

      const newUser = {
        username: 'new_user',
        email: 'newuser@example.com',
        password: 'password123',
      };

      await User.create(existingUser);
      const user = await User.create(newUser);

      const updateUserData = {
        ...newUser,
        email: existingUser.email, // attempting to update to an email that already exists
      };

      const response = await request(app)
        .put(`/users/${user.id}`)
        .send(updateUserData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.error).toBe('Email already in use');
    });

    it('should handle errors gracefully', async () => {
      await User.destroy({ where: {} });

      const updateUser = {
        username: 'updated_user',
        email: 'updated@example.com',
        password: 'newpassword',
      };

      const users = await User.findAll();
      const userId = users[0].id;

      const response = await request(app)
        .put(`/users/${userId}`)
        .send(updateUser)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      const users = await User.findAll();
      const userId = users[0].id;

      const response = await request(app)
        .delete(`/users/${userId}`)
        .expect(204);
    });

    it('should handle user not found', async () => {
      const response = await request(app)
        .delete('/users/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.error).toBe('User not found');
    });

    it('should handle errors gracefully', async () => {
      await User.destroy({ where: {} });

      const users = await User.findAll();
      const userId = users[0].id;

      const response = await request(app)
        .delete(`/users/${userId}`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body.error).toBeTruthy();
    });
  });
});
