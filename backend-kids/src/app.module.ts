import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
// Modules will be created shortly, importing them now to avoid later edits
import { ChildrenModule } from './children/children.module';
import { EventsModule } from './events/events.module';
import { ParticipationsModule } from './participations/participations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ChildrenModule,
    EventsModule,
    ParticipationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
