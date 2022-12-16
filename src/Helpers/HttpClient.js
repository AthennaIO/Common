import got from 'got'

export class HttpClient {
  constructor() {
    this.globalSettings = {}
  }

  setGlobalSettings(settings) {
    this.setGlobalSettings = settings
  }

  async makeRequest(method, url, options = {}) {
    const mergedOptions = {
      ...this.globalSettings,
      ...options,
    }

    try {
      const response = await got(url, { ...mergedOptions, method })
      return {
        statusCode: response.statusCode,
        body: response.body,
      }
    } catch (error) {
      return {
        statusCode: error.response.statusCode,
        body: error.response.body,
      }
    }
  }

  async get(url, options = {}) {
    return this.makeRequest('GET', url, options)
  }

  async post(url, body, options = {}) {
    return this.makeRequest('POST', url, { body, ...options })
  }

  async delete(url, options = {}) {
    return this.makeRequest('DELETE', url, options)
  }

  async patch(url, body, options = {}) {
    return this.makeRequest('PATCH', url, { body, ...options })
  }

  async put(url, body, options = {}) {
    return this.makeRequest('PUT', url, { body, ...options })
  }
}
