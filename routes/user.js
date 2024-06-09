const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticationMiddleWare = require('../middlewares/authenticationMiddleware');

router.route('/signup')
    .post(userController.signUp);

router.route('/login')
    .post(userController.login);

router.route('/:memberId')
    // .all(authenticationMiddlUeWare)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
