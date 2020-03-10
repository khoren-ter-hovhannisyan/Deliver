const jwt = require('jsonwebtoken')

const config = require('../../utils/config')
const { message } = require('../../utils/constans')

exports.generateToken = (res, id) => {
  try {
    const expiration = config.expiresIn.time
    const token = jwt.sign({ id }, config.routes.key, {
      expiresIn: expiration,
    })
    return res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'authorization',
      authorization: token,
    })
  } catch {
    return res.status(401).send({
      message: message.errorMessage,
    })
  }
}
