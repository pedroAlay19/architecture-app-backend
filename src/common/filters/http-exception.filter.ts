import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else {
        const r = response as { message?: string | string[] };
        message = Array.isArray(r.message)
          ? r.message.join('. ')
          : (r.message ?? message);
      }
    }

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error(exception.message, exception.stack);
      } else {
        this.logger.error(String(exception));
      }
    }

    const payload: ApiResponse<null> = { data: null, message, status };
    res.status(status).json(payload);
  }
}