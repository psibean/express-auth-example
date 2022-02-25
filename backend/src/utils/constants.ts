export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(", ") ?? ["localhost"];
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
export const EXPRESS_PORT = process.env.EXPRESS_PORT ?? 4000;
export const IS_PRODUCTION = (process.env.NODE_ENV ?? 'development') === 'production';
export const SESSION_SECRET = process.env.SESSION_SECRET