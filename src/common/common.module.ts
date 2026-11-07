import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor.js';
import { AllExceptionsFilter } from './filters/http-exception.filter.js';
import { DtoValidationPipe } from './pipes/dto-validation.pipe.js';

@Module({
    providers: [
        {provide: APP_INTERCEPTOR, useClass: ResponseInterceptor},
        {provide: APP_FILTER, useClass: AllExceptionsFilter},
        {provide: APP_PIPE, useClass: DtoValidationPipe}
    ]
})
export class CommonModule {}
