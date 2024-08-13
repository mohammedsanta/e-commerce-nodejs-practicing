const jwt = require('jsonwebtoken')

const createToken = (payload) => {

    return jwt.sign({ userId: payload },"SECRET_KEY",{
        expiresIn: '120s'
    })

}

module.exports = createToken