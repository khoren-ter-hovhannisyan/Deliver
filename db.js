module.exports = (server) => {
    mongoose.connect(
        config.db.url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        },
        () => {
          server
        }
      )
}