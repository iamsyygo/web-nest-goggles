type AppYamlConfig = {
  application: {
    name: string;
    host: string;
    port: number;
    version: string;
    description: string;
  };
  db: {
    mysql: {
      type: 'mysql';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize: boolean;
      logging: boolean;
      poolSize: number;
      connectorPackage: string;
    };
    redis: {
      host: string;
      port: number;
      password: string;
      db: number;
      keyPrefix: string;
      ttl: number;
      family: number;
      poolSize: number;
      enableReadyCheck: boolean;
      enableOfflineQueue: boolean;
      // reconnectOnError: (err) => err.message.includes('READONLY')
    };
  };

  logs: {
    winston: {
      dirname: string;
      level: string;
      filename: string;
      datePattern: string;
      zippedArchive: boolean;
      maxSize: string;
      maxFiles: string;
    };
  };
};
