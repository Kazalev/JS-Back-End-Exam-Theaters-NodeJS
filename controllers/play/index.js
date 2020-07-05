const User = require('../users/User');
const Play = require('./Play');

module.exports = {
    get: {
        createPlay(req, res, next) {
            const isLoggedIn = req.user !== undefined;

            res.render('plays/create-play.hbs', {
                isLoggedIn
            });
        },

        detailsPlay(req, res) {
            const { id } = req.params;

            Play
                .findById(id)
                .lean()
                .populate('usersLiked')
                .then((play) => {
                    const isLoggedIn = req.user !== undefined;
                    const currentUser = JSON.stringify(req.user._id);

                    const isAlreadyLiked = JSON.stringify(play.usersLiked).includes(currentUser);

                    res.render('plays/details-play.hbs', {
                        isLoggedIn,
                        isAlreadyLiked,
                        isTheCreator: currentUser === JSON.stringify(play.creator),
                        play
                    });
                })
        },

        likePlay(req, res) {
            const { id } = req.params;
            const userID = req.user._id;

            Promise.all([
                Play.updateOne({ _id: id }, { $push: { usersLiked: userID } }),
                User.updateOne({ _id: userID }, { $push: { likedPlay: id } })
            ]).then(([updatedPlay, updatedUser]) => {
                res.redirect(`/plays/details-play/${id}`)
            })
        },

        editPlay(req, res) {
            const isLoggedIn = req.user !== undefined;
            const { id } = req.params;

            Play.findById({ _id: id }).lean().then((playToEdit) => {

                res.render('plays/edit-play.hbs', {
                    isLoggedIn,
                    playToEdit
                });
            })

        },

        deletePlay(req, res) {
            const { id } = req.params;

            Play.deleteOne({ _id: id }).then((response) => {
                res.redirect('/');
            })
        },
        
        sortByLikes(req, res) {
            const isLoggedIn = (req.user !== undefined);
            const criteria = isLoggedIn ? { usersLiked: '-1' } : { createdAt: '1' };
            
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
        },

        sortByDate(req, res) {
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
    },

    post: {
        createPlay(req, res, next) {
            const { title, description, imageUrl, isPublic: isChecked } = req.body;
            const isPublic = isChecked === 'on' ? true : false;
            const createdAt = (new Date() + "").slice(0, 24);
            const isLoggedIn = req.user !== undefined;
            const creator = req.user._id;
            
            if (title === "" || description === "" || imageUrl === "") {
                return res.render('plays/create-play.hbs', {
                    message: "You can not have empty fields!",
                    oldInput: { title, description, imageUrl },
                    isLoggedIn
                })
            }

            Play.create({ title, description, imageUrl, isPublic, createdAt, creator }).then((createdPlay) => {
                res.status(201).redirect('/');
            })
        },

        editPlay(req, res, next) {
            const { id } = req.params;
            const { title, description, imageUrl, isPublic: isChecked } = req.body;
            console.log(title, description, imageUrl);
            const isLoggedIn = req.user !== undefined;
            const isPublic = isChecked === 'on' ? true : false;

            if (title === "" || description === "" || imageUrl === "") {
                return res.render('plays/create-play.hbs', {
                    message: "You can not have empty fields!",
                    oldInput: { title, description, imageUrl },
                    isLoggedIn
                })
            }

            Play.updateOne({ _id: id }, { $set: { title: title, description: description, imageUrl: imageUrl, isPublic: isPublic } })
                .then((result) => {
                    res.redirect('/');
                })
        }
    }
};