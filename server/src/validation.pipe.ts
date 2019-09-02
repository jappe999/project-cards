import { Injectable, PipeTransform } from '@nestjs/common'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private type: any) {}

  /**
   * Transform the given value to the type set in the constructor.
   * @param value - The value passed to this pipe.
   */
  transform(value: any) {
    try {
      if (this.type.constructor.name === 'Object') {
        return this.transformObject(value)
      } else if (this.type) {
        return plainToClass(this.type, value)
      } else {
        return value
      }
    } catch (e) {
      console.error('[ValidationPipe Error]: ', e)
    }
  }

  /**
   * Transform all values in the given value object to the types given in the type object.
   * @param object - The value passed to this pipe.
   */
  protected transformObject(object: Object) {
    const keys = Object.keys(object)

    return Object.entries(this.type).reduce((result, [variableName, value]) => {
      // If a key value pair does not need to be transformed, the original pair is included in the result.
      if (!keys.includes(variableName)) {
        return { ...result, [variableName]: object[variableName] }
      }

      // Check if the value isn't already the type it should be.
      const newValue =
        (<any>value).name === object[variableName].constructor.name
          ? object[variableName]
          : plainToClass(<any>value, object[variableName])

      return {
        ...result,
        [variableName]: newValue,
      }
    }, {})
  }
}
