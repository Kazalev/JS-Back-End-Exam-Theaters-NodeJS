const router = require('express').Router();
const controller = require('../controllers/play');
const isAuth = require('../utils/isAuth');

router.get('/create-play', isAuth(), controller.get.createPlay);
router.get('/details-play/:id', isAuth(), controller.get.detailsPlay);
router.get('/like-play/:id', isAuth(), controller.get.likePlay);
router.get('/delete-play/:id', isAuth(), controller.get.deletePlay);
router.get('/edit-play/:id', isAuth(), controller.get.editPlay);
router.get('/sort-by-likes', isAuth(), controller.get.sortByLikes);
router.get('/sort-by-date', isAuth(), controller.get.sortByDate);

router.post('/create-play', isAuth(), controller.post.createPlay);
router.post('/edit-play/:id', isAuth(), controller.post.editPlay);

module.exports = router;