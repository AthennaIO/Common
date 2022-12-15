const http = require('http')

export class HttpClient {
    constructor(options) {
        this.defaultOptions = {
            baseUrl: '',
            headers: {},
            agent: new http.Agent({ keepAlive: true })
        }

        this.options = Object.assign({}, this.defaultOptions, options)
    }

    get(path) {
        return this.request('GET', path)
    }

    post(path, data) {
        return this.request('POST', path, data)
    }

    put(path, data) {
        return this.request('PUT', path, data)
    }

    delete(path) {
        return this.request('DELETE', path)
    }

    request(method, path, data) {
        const options = Object.assign({}, this.options, {
            method,
            path: this.options.baseUrl + path,
            headers: Object.assign({}, this.options.headers)
        })

        if(data) {
            options.headers['Content-Lenght'] = Buffer.byteLength(data)
        }

        return new Promise((resolve, reject) => {
            const req = http.request(options, res => {
                res.setEncoding('utf8')
                const chunks = []
                res.on('data', chunk => chunks.push(chunk))
                res.on('end', () => resolve(chunks.join('')))
            })

            req.on('error', err => reject(err))

            if(data) {
                req.write(data)
            }

            req.end()
        })
    }

}