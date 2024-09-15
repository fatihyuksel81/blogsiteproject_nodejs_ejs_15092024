const express = require('express');

const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.index);

router.get('/login', (req, res) => {
    const message = req.flash('message');
    res.render('admin/adminlogin', {message});
});

router.get('/logout', adminController.logout);
router.get('/posts', adminController.getAllPosts);
router.get('/comments', adminController.getAllComments);
router.get('/users', adminController.getAllUsers);
router.get('/edit-post/:id', adminController.getEditPost);

router.post('/posts/:id/delete', adminController.deletePost);
router.post('/comments/:id/delete', adminController.deleteComment);
router.post('/users/:id/delete', adminController.deleteUser);
router.post('/login', adminController.login);
router.post('/edit-post/:id', adminController.editPost);


module.exports = router;