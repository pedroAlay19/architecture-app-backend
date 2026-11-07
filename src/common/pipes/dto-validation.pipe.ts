import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CONSTRAINT_MESSAGES } from '../constants/validation-messages.constants.js';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype, type }: ArgumentMetadata) {
    if (type === 'custom' || !metatype || !this.shouldValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value ?? {});
    const errors = await validate(object, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException(this.flatten(errors).join('. '));
    }

    return object;
  }

  private shouldValidate(metatype: Function): boolean {
    const primitives: Function[] = [String, Boolean, Number, Array, Object];
    return !primitives.includes(metatype);
  }

  private flatten(errors: ValidationError[], parent = ''): string[] {
    return errors.flatMap((err) => {
      const field = parent ? `${parent}.${err.property}` : err.property;
      const own = Object.entries(err.constraints ?? {}).map(
        ([key, original]) => CONSTRAINT_MESSAGES[key]?.(field) ?? original,
      );
      return [...own, ...this.flatten(err.children ?? [], field)];
    });
  }
}