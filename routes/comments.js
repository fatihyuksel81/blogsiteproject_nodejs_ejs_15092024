const express = require('express');

const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/my-comments/', commentController.showMyComments);


router.post('/comments/:id/delete', commentController.deleteMyComment);
router.post('/post-comment', commentController.makeComment );
router.post('/comments/:id/edit', commentController.editMyComment);

module.exports = router;