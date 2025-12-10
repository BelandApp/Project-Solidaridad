import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get<string>('DATABASE_URL'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true, // Auto-create tables (dev only)
                autoLoadEntities: true,
            }),
        }),
    ],
    
})
export class DatabaseModule { 
    
}
