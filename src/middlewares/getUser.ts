import passport from 'passport';

const getUserCallback = (req, resolve, reject) => async (err, user, info) => {
  req.user = user || null;
  resolve();
};

export const getUser = () => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, getUserCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default getUser;
