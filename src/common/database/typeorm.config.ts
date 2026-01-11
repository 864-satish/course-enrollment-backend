import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number.parseInt(process.env.DB_PORT || '5432', 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'course_enrollment_db',
  autoLoadEntities: true,
  synchronize: true, // Set to false in production and use migrations
};

export default config;
