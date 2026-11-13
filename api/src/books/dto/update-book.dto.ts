import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalCopies?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  genreId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  publishedYear?: number;
}

