import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { Child } from './entities/child.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Child])],
    controllers: [ChildrenController],
    providers: [ChildrenService],
    exports: [ChildrenService], // Export service in case other modules need it (e.g. Participations)
})
export class ChildrenModule { }
