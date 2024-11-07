import request from 'supertest';
import { app } from '../src/server';
import { pool } from '../src/config/database';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/config';

describe('WordList API', () => {
  let token: string;
  const userId = '123';

  beforeAll(() => {
    token = jwt.sign({ id: userId, email: 'test@example.com' }, config.jwt.secret);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('GET /api/wordlists', () => {
    it('should return all word lists for user', async () => {
      const response = await request(app)
        .get('/api/wordlists')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/wordlists');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/wordlists', () => {
    const newList = {
      title: 'Test List',
      description: 'Test Description',
      fromLanguage: { code: 'en', name: 'English' },
      toLanguage: { code: 'es', name: 'Spanish' },
      words: []
    };

    it('should create a new word list', async () => {
      const response = await request(app)
        .post('/api/wordlists')
        .set('Authorization', `Bearer ${token}`)
        .send(newList);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newList.title);
    });

    it('should return 400 with invalid data', async () => {
      const response = await request(app)
        .post('/api/wordlists')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/wordlists/:id', () => {
    it('should update a word list', async () => {
      // First create a list
      const createResponse = await request(app)
        .post('/api/wordlists')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original Title',
          description: 'Original Description',
          fromLanguage: { code: 'en', name: 'English' },
          toLanguage: { code: 'es', name: 'Spanish' },
          words: []
        });

      const listId = createResponse.body.id;

      // Then update it
      const response = await request(app)
        .put(`/api/wordlists/${listId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
    });

    it('should return 404 for non-existent list', async () => {
      const response = await request(app)
        .put('/api/wordlists/999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Title'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/wordlists/:id', () => {
    it('should delete a word list', async () => {
      // First create a list
      const createResponse = await request(app)
        .post('/api/wordlists')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'To Delete',
          description: 'Will be deleted',
          fromLanguage: { code: 'en', name: 'English' },
          toLanguage: { code: 'es', name: 'Spanish' },
          words: []
        });

      const listId = createResponse.body.id;

      // Then delete it
      const response = await request(app)
        .delete(`/api/wordlists/${listId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });

  describe('POST /api/wordlists/:id/fork', () => {
    it('should fork a word list', async () => {
      // First create a list
      const createResponse = await request(app)
        .post('/api/wordlists')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original List',
          description: 'To be forked',
          fromLanguage: { code: 'en', name: 'English' },
          toLanguage: { code: 'es', name: 'Spanish' },
          words: []
        });

      const listId = createResponse.body.id;

      // Then fork it
      const response = await request(app)
        .post(`/api/wordlists/${listId}/fork`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Original List (Fork)');
    });
  });
});