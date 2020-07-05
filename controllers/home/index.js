const Play = require('../play/Play');

module.exports = {
    get: {
        home(req, res, next) {
            const isLoggedIn = (req.user !== undefined);
            const criteria = isLoggedIn ? { createdAt: '1' } : { usersLiked: '-1' };

            Play
                .find({ isPublic: true })
                .lean()
                .sort(criteria)
                .then((play) => {
                    res.render('home/home.hbs', {
                        isLoggedIn,
                        play
                    });
                })
        }
    }
};