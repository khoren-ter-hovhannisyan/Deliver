const jwt = require('jsonwebtoken')
const config = require('../../utils/config')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.auth
    const decoded = jwt.verify(token, config.routes.key)
    req.userData = decoded
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({
      message: 'Auth failed',
    })
  }
}