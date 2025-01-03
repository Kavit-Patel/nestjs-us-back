import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateUrlDto } from 'src/url/dto/create-url.dto';

export class userDto {
  @ApiProperty({ description: 'Unique identifier for the user', example: 'cuid-generated-id' })
  @IsString()
  id: string; 

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Google unique identifier for the user', example: '1234567890abcdef' })
  @IsString()
  googleId: string;
  
  @ApiProperty({ type: () => CreateUrlDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateUrlDto)
  urls?: CreateUrlDto[];

  @ApiProperty({ description: 'The creation time of the user', example: '2023-01-02T18:16:40.000Z' })
  @ApiProperty({ default: 'now()' })
  createdAt?: Date;

}
