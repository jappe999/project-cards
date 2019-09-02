import { Injectable, PipeTransform } from '@nestjs/common'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private type: any) {}

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

  protected transformObject(value: Object) {
    const keys = Object.keys(value)

    return Object.entries(this.type).reduce((result, [variableName, type]) => {
      if (!keys.includes(variableName)) {
        return { ...result, [variableName]: value[variableName] }
      }

      const newValue =
        (<any>type).name === value[variableName].constructor.name
          ? value[variableName]
          : plainToClass(<any>type, value[variableName])

      return {
        ...result,
        [variableName]: newValue,
      }
    }, {})
  }
}
