import { createParamDecorator } from '@nestjs/common'

export const CurrentUser = createParamDecorator((_, req) => req.user)
