const arrayWrap = (value: any) => (Array.isArray(value) ? value : [value])

export class Errors {
  /**
   * Create a new error bag instance.
   */
  constructor(public errors = {}) {}

  /**
   * Set the errors object or field error messages.
   *
   * @param field
   * @param messages
   */
  set(field: string | object, messages?: any[] | string | undefined): void {
    if (typeof field === 'object') {
      this.errors = field
    } else {
      this.set({
        ...this.errors,
        [field]: arrayWrap(messages),
      })
    }
  }

  /**
   * Get all the errors.
   */
  all(): {} {
    return this.errors
  }

  /**
   * Determine if there is an error for the given field.
   *
   * @param field - Field name
   */
  has(field: string): boolean {
    return this.errors.hasOwnProperty(field)
  }

  /**
   * Determine if there are any errors for the given fields.
   *
   * @param fields - An array of field names
   */
  hasAny(...fields: string[]): boolean {
    return fields.some(field => this.has(field))
  }

  /**
   * Determine if there are any errors.
   */
  any(): boolean {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Get the first error message for the given field.
   *
   * @param field - The name of the field
   */
  get(field: string): string | undefined {
    if (this.has(field)) {
      return this.getAll(field)[0]
    }
  }

  /**
   * Get all the error messages for the given field.
   *
   * @param field - he name of the field
   */
  getAll(field: string): any[] {
    return arrayWrap(this.errors[field] || [])
  }

  /**
   * Get the error message for the given fields.
   *
   * @param - Field names
   */
  only(...fields: string[]): any[] {
    const messages: string[] = []

    fields.forEach(field => {
      const message = this.get(field)

      if (message) {
        messages.push(message)
      }
    })

    return messages
  }

  /**
   * Clear one or all error fields.
   *
   * @param - Field name
   */
  clear(field?: string): void {
    const errors = {}

    if (field) {
      Object.keys(this.errors).forEach(key => {
        if (key !== field) {
          errors[key] = this.errors[key]
        }
      })
    }

    this.set(errors)
  }
}
