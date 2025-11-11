import db from '../config/database'
import { User } from '../models/User'
import request from 'supertest'
import app from '../app'

beforeEach(async () => {
  await db.sync({ force: true })
})

afterAll(async () => {
  await db.close()
})

it('POST /users creates a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({ name: 'Mykola', email: '' })
    .expect(201)

  expect(response.body).toHaveProperty('id')
  expect(response.body.name).toBe('Mykola')

  await request(app).post('/users').send({ name: '' }).expect(400)
})

it('GET /users returns list of users', async () => {
  const response = await request(app).get('/users')
  expect(response.body).toHaveLength(0)
  await User.create({ name: 'User', email: 'user@gmail.com' })
  await User.create({ name: 'User 1', email: 'user@gmail.com' })
  const response2 = await request(app).get('/users')
  expect(response2.body).toHaveLength(2)
})

it('DELETE /users/:id deletes a user', async () => {
  const user = await User.create({
    name: 'User to delete',
    email: 'deleteduser@gmail.com',
  })
  await request(app).delete(`/users/${user.id}`).expect(200)
  const response = await request(app).get('/users')
  expect(response.body).toHaveLength(0)

  await User.create({ name: 'User', email: 'user@gmail.com' })
  await request(app).delete('/users/999').expect(404)
})