import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtPayloadDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Google unique identifier for the user',
    example: '1234567890abcdef',
  })
  googleId: string;

  @IsEmail()
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  userId: string;

}
