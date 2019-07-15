import { IsNotEmpty, IsUUID } from 'class-validator'

export class UserCreateDto {
  @IsNotEmpty()
  username!: string

  @IsNotEmpty()
  password!: string
}

export class UserViewDto {
  @IsUUID()
  id!: string

  @IsNotEmpty()
  username!: string
}
