module.exports = {
  server: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.DB_URL,
  },
  routes: {
    key: process.env.JWT_KEY,
  }

}