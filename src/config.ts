const auth = {
  cookie: {
    key: "SESSION_COOKIE",
    expirationDays: 7,
  },
  secret: "secret",
};

const isProd = process.env.NODE_ENV === "production";

const config = {
  auth,
  isProd,
};

export default config;
