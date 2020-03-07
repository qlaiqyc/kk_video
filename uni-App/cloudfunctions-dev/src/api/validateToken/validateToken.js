const {
  validateToken
} = require('../../utils/validateToken.js')

const db = uniCloud.database()
async function report(event) {
  try {
    return await validateToken(event.token)
  } catch (e) {
    //TODO handle the exception
    return {
      status: -2,
      errCode: 'TOKEN_INVALID',
      msg: 'token无效'
    }
  }
};

exports.main = report
