import { PrismaClient } from '@prisma/client';
import { Global, Injectable, OnModuleDestroy } from '@nestjs/common';

@Global() //This module is used Global
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy() {
    await this.$connect();
  }
}
