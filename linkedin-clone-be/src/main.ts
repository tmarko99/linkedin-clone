import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as fs from 'fs';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a', //append,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const err = validationErrors.reduce((acc, error) => {
          acc[error.property] = Object.values(error.constraints);
          return acc;
        }, {});
        const status = HttpStatus.BAD_REQUEST;

        return new HttpException(
          { status: status, error: err },
          HttpStatus.BAD_REQUEST,
        );

        // return new BadRequestException(
        //   validationErrors.map((error) => ({
        //     field: error.property,
        //     error: Object.values(error.constraints).join(', '),
        //   })),
        // );
      },
    }),
  );
  app.use(morgan('dev', { stream: logStream }));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
