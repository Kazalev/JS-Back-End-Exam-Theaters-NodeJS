const router = require('../routes');

module.exports = (app) => {
    app.use('/', router.home);

    app.use('/users', router.users);

    app.use('/plays', router.plays);
};

// Parent routes [!]