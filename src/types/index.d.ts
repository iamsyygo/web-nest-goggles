type AppYamlConfig = {
  application: {
    name: string;
    host: string;
    port: number;
    version: string;
    description: string;
  };
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
    username: string;
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

  bcrypt: {
    salt: string;
  };

  jwt: {
    secret: string;
    signOptions: {
      expiresIn: string;
    };
  };

  refresh_token: {
    secret: string;
    signOptions: {
      expiresIn: string;
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
  email: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  github: {
    client_id: string;
    client_secret: string;
  };
};
