import { test } from '@japa/runner'
import { HttpClient } from '../../src/index.js'
const client = new HttpClient()

test.group('Verbs HTTP ', () => {
  test('GET request', async ({ assert }) => {
    const response = await client.get('http://example.com/')
    assert.equal(response.statusCode, 200)
  })
  test('POST request', async ({ assert }) => {
    const response = await client.post('http://example.com', { message: 'Hello' })
    assert.equal(response.statusCode, 200)
  })
  test('PUT request', async ({ assert }) => {
    const response = await client.put('http://example.com', { message: 'Hello' })
    assert.equal(response.statusCode, 200)
  })
  test('DELETE request', async ({ assert }) => {
    const response = await client.delete('http://example.com')
    assert.equal(response.statusCode, 200)
  })
  test('PATCH request', async ({ assert }) => {
    const response = await client.patch('http://example.com', { message: 'Hello' })
    assert.equal(response.statusCode, 200)
  })
})
