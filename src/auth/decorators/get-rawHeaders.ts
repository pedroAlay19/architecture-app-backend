import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext): string[] => {
        const req = ctx.switchToHttp().getRequest();
        return req.rawHeaders;
    }
);