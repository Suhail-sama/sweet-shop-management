const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

const TEST_DB = 'mongodb://localhost:27017/sweetshop_test';

describe('Sweet Endpoints', () => {
  let userToken;
  let adminToken;
  let sweetId;

  beforeAll(async () => {
    // Close existing connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    await mongoose.connect(TEST_DB);

    // Create regular user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123'
      });
    userToken = userRes.body.token;

    // Create admin user
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
    adminToken = adminRes.body.token;
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/sweets', () => {
    it('should create sweet as admin', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 100
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Chocolate Bar');
      sweetId = res.body.data._id;
    });

    it('should not create sweet as regular user', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Candy',
          category: 'Candy',
          price: 1.99,
          quantity: 50
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Candy',
          category: 'Candy',
          price: 1.99,
          quantity: 50
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 100
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Gummy',
          price: 1.50,
          quantity: 200
        });
    });

    it('should get all sweets', async () => {
      const res = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/sweets');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Milk Chocolate',
          category: 'Chocolate',
          price: 3.99,
          quantity: 50
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Dark Chocolate',
          category: 'Chocolate',
          price: 4.99,
          quantity: 30
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Gummy',
          price: 2.50,
          quantity: 100
        });
    });

    it('should search by name', async () => {
      const res = await request(app)
        .get('/api/sweets/search?name=Chocolate')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by category', async () => {
      const res = await request(app)
        .get('/api/sweets/search?category=Gummy')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should filter by price range', async () => {
      const res = await request(app)
        .get('/api/sweets/search?minPrice=3&maxPrice=5')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 50
        });
      sweetId = res.body.data._id;
    });

    it('should purchase sweet successfully', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(45);
    });

    it('should fail when quantity exceeds stock', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 100 });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: 10
        });
      sweetId = res.body.data._id;
    });

    it('should restock sweet as admin', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.quantity).toBe(60);
    });

    it('should not restock as regular user', async () => {
      const res = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Old Name',
          category: 'Chocolate',
          price: 2.99,
          quantity: 50
        });
      sweetId = res.body.data._id;
    });

    it('should update sweet as admin', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Name',
          price: 3.99
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe('New Name');
      expect(res.body.data.price).toBe(3.99);
    });

    it('should not update as regular user', async () => {
      const res = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'New Name' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'To Delete',
          category: 'Chocolate',
          price: 2.99,
          quantity: 50
        });
      sweetId = res.body.data._id;
    });

    it('should delete sweet as admin', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should not delete as regular user', async () => {
      const res = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});