import config from '@config/config';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Domain Api Docs',
    version: config.app.version,
  },
  servers: [
    {
      url: `${config.host}/v1`,
    },
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
  tags: [
  ],
};

export default swaggerDef;
