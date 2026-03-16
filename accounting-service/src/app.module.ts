import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { CustomersModule } from './customers/customer.module.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { ConfigModule } from '@nestjs/config';
import { CurrencyModule } from './currency/currency.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SyncModule } from './sync/sync.module.js';
import { QuickbooksModule } from './quickbooks/quickbooks.module.js';
import { BullModule } from '@nestjs/bullmq';
import { ProductModule } from './product/product.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { InvoiceModule } from './invoice/invoice.module.js';
import { PaymentModule } from './payment/payment.module.js';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to `true` if you want to emit the newListener event
      newListener: false,
      // set this to `true` if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomersModule,
    CurrencyModule,
    SyncModule,
    QuickbooksModule,
    ProductModule,
    PrismaModule,
    InvoiceModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
