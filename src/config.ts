const cookies = {
  key: "SESSION_COOKIE",
  secret: "secret",
};

const isProd = process.env.NODE_ENV === "production";

const config = {
  cookies,
  isProd,
};

export default config;
