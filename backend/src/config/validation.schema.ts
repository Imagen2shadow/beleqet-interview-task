import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(4000),
  
  DATABASE_URL: Joi.string().uri().required(),
  
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
  
  OPENAI_API_KEY: Joi.string().required(),
  OPENAI_MODEL: Joi.string().default('gpt-4o-mini'),
  MIN_SCORE_SHORTLIST: Joi.number().min(0).max(100).default(70),
  ENABLE_AUTO_INTERVIEW: Joi.boolean().default(true),
  
  TELEGRAM_BOT_TOKEN: Joi.string().optional(),
  CHAPA_SECRET_KEY: Joi.string().optional(),
  CHAPA_WEBHOOK_SECRET: Joi.string().optional(),
  
  FRONTEND_URL: Joi.string().uri().default('http://localhost:3000'),
});