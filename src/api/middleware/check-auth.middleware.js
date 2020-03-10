const jwt = require('jsonwebtoken')

const config = require('../../utils/config')
const { message } = require('../../utils/constans')

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
    console.log(req.headers.authorization);
      
    console.log(req.headers);
    
    console.log(token,"***********");
    
    const decoded = jwt.verify(token, config.routes.key)
    req.userData = decoded
    next()
  } catch {
    return res.status(401).send({
      message: message.errorMessage,
    })
  }
}
