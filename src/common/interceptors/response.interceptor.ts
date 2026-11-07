import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface.js';
import { PaginatedResult } from '../interfaces/paginated-result.interface.js';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator.js';

const METADATA_KEYS = ['total', 'page', 'limit', 'totalPages'] as const;

const isPaginatedResult = (
  value: unknown,
): value is PaginatedResult<unknown> => {
  if (typeof value !== 'object' || value === null) return false;

  const { data, metadata } = value as Record<string, unknown>;
  if (!Array.isArray(data)) return false;
  if (typeof metadata !== 'object' || metadata === null) return false;

  const m = metadata as Record<string, unknown>;
  return METADATA_KEYS.every((key) => typeof m[key] === 'number');
};

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<unknown, ApiResponse<unknown>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<unknown>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'OK';

    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result: unknown) => {
        if (result instanceof StreamableFile) {
          return result as unknown as ApiResponse<unknown>;
        }

        const status = response.statusCode;

        if (isPaginatedResult(result)) {
          return {
            data: result.data,
            message,
            status,
            metadata: result.metadata,
          };
        }

        return { data: result ?? null, message, status };
      }),
    );
  }
}