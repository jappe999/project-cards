import { AxiosResponse, AxiosRequestConfig, Method, AxiosInstance } from 'axios'
import { Errors } from './Errors'

export class Form<TForm> {
  static routes = {}
  static ignore = ['busy', 'successful', 'errors', 'originalData']
  static axios: AxiosInstance

  busy: boolean
  successful: boolean
  errors: Errors
  originalData: TForm

  /**
   * Create a new form instance.
   *
   * @param data
   */
  constructor(data: TForm) {
    this.busy = false
    this.successful = false
    this.errors = new Errors()
    this.originalData = { ...data }

    Object.assign(this, data)
  }

  /**
   * Fill form data.
   *
   * @param data
   */
  fill(data: {}) {
    this.keys().forEach(key => {
      this[key] = data[key]
    })
  }

  /**
   * Get the form data.
   *
   * @return data
   */
  data(): TForm {
    const keys = this.keys()
    return keys.reduce(
      (data, key) => ({ ...data, [key]: this[key] }),
      {} as TForm,
    )
  }

  /**
   * Get the form data keys.
   */
  keys(): string[] {
    return Object.keys(this).filter(key => !Form.ignore.includes(key))
  }

  /**
   * Checks if all keys are empty.
   */
  isEmpty(): boolean {
    return (
      this.keys().filter(key => {
        return this[key] !== ''
      }).length === 0
    )
  }

  /**
   * Start processing the form.
   */
  startProcessing() {
    this.errors.clear()
    this.busy = true
    this.successful = false
  }

  /**
   * Finish processing the form.
   */
  finishProcessing() {
    this.busy = false
    this.successful = true
  }

  /**
   * Clear the form errors.
   */
  clear() {
    this.errors.clear()
    this.successful = false
  }

  /**
   * Reset the form fields.
   */
  reset() {
    Object.keys(this)
      .filter(key => !Form.ignore.includes(key))
      .forEach(key => {
        this[key] = { ...this.originalData[key] }
      })
  }

  /**
   * Submit the from via a GET request.
   *
   * @param url
   */
  get<TResponse>(url: string): Promise<AxiosResponse<TResponse>> {
    return this.submit('get', url)
  }

  /**
   * Submit the from via a POST request.
   *
   * @param url
   */
  post<TResponse>(url: string): Promise<AxiosResponse<TResponse>> {
    return this.submit('post', url)
  }

  /**
   * Submit the from via a PATCH request.
   *
   * @param url
   */
  patch<TResponse>(url: string): Promise<AxiosResponse<TResponse>> {
    return this.submit('patch', url)
  }

  /**
   * Submit the from via a PUT request.
   *
   * @param url
   */
  put<TResponse>(url: string): Promise<AxiosResponse<TResponse>> {
    return this.submit('put', url)
  }

  /**
   * Submit the from via a DELETE request.
   *
   * @param url
   */
  delete<TResponse>(url: string): Promise<AxiosResponse<TResponse>> {
    return this.submit('delete', url)
  }

  /**
   * Submit the form data via an HTTP request.
   *
   * @param - method (get, post, patch, put)
   * @param - url
   * @param - config (axios config)
   */
  async submit<TResponse>(
    method: Method,
    url: string,
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse<TResponse>> {
    this.startProcessing()

    const data = method === 'get' ? { params: this.data() } : this.data()

    try {
      const response = await Form.axios.request({
        url: this.route(url),
        method,
        data,
        ...config,
      })

      this.finishProcessing()
      return { ...response, data: <TResponse>response.data }
    } catch (error) {
      if (error.response) {
        this.errors.set(this.extractErrors(error.response))
      }

      throw error
    } finally {
      this.busy = false
    }
  }

  /**
   * Extract the errors from the response object.
   *
   * @param - Response object
   */
  extractErrors(response: AxiosResponse) {
    if (!response.data || typeof response.data !== 'object') {
      return { error: '' }
    }

    if (response.data.errors) {
      return { ...response.data.errors }
    }

    if (response.data.message) {
      return { error: response.data.message }
    }

    return { ...response.data }
  }

  /**
   * Get a named route.
   *
   * @param - Route name
   */
  route(name: string, parameters = {}): string {
    let url = name

    if (Form.routes.hasOwnProperty(name)) {
      url = decodeURI(Form.routes[name])
    }

    if (typeof parameters !== 'object') {
      parameters = { id: parameters }
    }

    Object.keys(parameters).forEach(key => {
      url = url.replace(`{${key}}`, parameters[key])
    })

    return url
  }

  /**
   * Clear errors on keydown.
   *
   * @param - event
   */
  onKeydown(event: KeyboardEvent | any): void {
    if (event.target.name) {
      this.errors.clear(event.target.name)
    }
  }
}

export default ({ $axios }) => {
  Form.axios = $axios
}
