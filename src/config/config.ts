import path from 'path';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    HOST: Joi.string().optional().description('Server host'),
    FRONTEND_URL: Joi.string().required().description('Frontend URL is required'),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  host: envVars.HOST,
  frontendURL: envVars.FRONTEND_URL,
  app: {
    version: process.env.npm_package_version,
  },
  port: envVars.PORT,
  mongoose: {
    url: `${envVars.MONGODB_URL}dns`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  }
};
