const jwt = require('jsonwebtoken');

function userAuth() {
  const authError = {
    message: 'You shall not pass!'
  };

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json(authError);
      }

      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json(authError);
        }

        req.token = decoded;

        next();
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = {
  userAuth
};
