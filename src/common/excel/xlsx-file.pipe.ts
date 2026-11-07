import { BadRequestException, FileTypeValidator, ParseFilePipe } from '@nestjs/common';
import { MESSAGES } from '../constants/messages.constants';

const XLSX_MIME = /^application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet$/;

export const xlsxFilePipe = () =>
  new ParseFilePipe({
    validators: [new FileTypeValidator({ fileType: XLSX_MIME })],
    exceptionFactory: () =>
      new BadRequestException(MESSAGES.FILES.XLSX_REQUIRED),
  });