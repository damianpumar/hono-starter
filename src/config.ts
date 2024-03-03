const auth = {
  cookie: {
    domain: "localhost",
    key: "SESSION_COOKIE",
    expirationDays: 7,
  },
  secret: "secret",
};

const cors = {
  origin: "http://localhost:3001",
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

const isProd = process.env.NODE_ENV === "production";

const config = {
  auth,
  cors,
  isProd,
};

export default config;
