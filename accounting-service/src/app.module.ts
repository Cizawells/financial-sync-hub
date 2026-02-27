import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { CustomersModule } from './customers/customer.module.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ConfigModule } from '@nestjs/config';
import { CurrencyModule } from './currency/currency.module.js';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }), CustomersModule, CurrencyModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
