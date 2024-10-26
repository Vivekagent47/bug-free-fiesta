import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

// Custom Validator: Ensure `data` is only allowed when there are no children.
function ValidateDataOrChildren(): PropertyDecorator {
  return ValidateIf((obj) => !obj.children || obj.children.length === 0);
}

// Custom Validator: Ensure `children` are only allowed when `data` is not present.
function ValidateChildrenOrData(): PropertyDecorator {
  return ValidateIf((obj) => !obj.data);
}

export class TagsDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @ValidateDataOrChildren() // Ensure data is only present if no children exist
  data?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Validate nested children properly
  @Type(() => TagsDto) // Transform children into TagsDto instances
  @ValidateChildrenOrData() // Ensure children are only allowed if no data exists
  children?: TagsDto[];
}
