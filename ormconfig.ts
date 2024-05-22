import { config } from 'dotenv';
config();

export default [
  {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/src/entities/**.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsRun: false,
    cli: {
      entitiesDir: __dirname + '/src/entities',
      migrationsDir: __dirname + '/migrations',
    },
    timezone: 'Z',
    synchronize: false,
    debug: process.env.NODE_ENV === 'development' ? true : false,
  },
];
