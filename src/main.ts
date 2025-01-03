import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:(origin,callback)=>{
      const allowedOrigin = process.env.ALLOWED_ORIGINS || '';
      if(!origin){
        return callback(null,true)
      }
      if(allowedOrigin.includes(origin)){
        return callback(null,true)
      }
      return callback(new Error("Not allowed by cors !"),false)
    },
    credentials:true
  })

  const swaggerConfig = new DocumentBuilder()
  .setTitle('Api Documentation')
  .setDescription('Api endpoints for url-shortner')
  .setVersion('1.0')
  .addCookieAuth('jwt.connect.sid')
  .build()

  const document = SwaggerModule.createDocument(app,swaggerConfig)
  SwaggerModule.setup('docs',app,document)

  await app.listen(3001);
}
bootstrap();
