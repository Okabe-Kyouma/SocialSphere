const router = require('express').Router();
const bodyParser = require('body-parser');
const postModel = require('../Models/post');
const userModel = require('../Models/user');
const { v4: uuidv4 } = require('uuid');



router.post('/comment/:id', async (req, res) => {
    if (req.isAuthenticated()) {
  
        const postId = req.params.id;
        const { comment } = req.body;

        console.log(`the comment is : ${comment} and the postId is ${postId}`);

        try {
            const post = await postModel.findById(postId);
            if (!post) {
                console.log("Post not found");
                return res.redirect('/home');
            }

            const user = req.user;

            if (!user) {
                console.log("User not found");
                return res.redirect('/home');
            }

            const uuid = uuidv4();

            post.comments.push({ personCommented: user._id, comment,uuid});
            await post.save();
            console.log("Comment added successfully");
            res.redirect('/home');
        } catch (error) {
            console.log(error);
            res.redirect('/home');
        }
    } else {
        res.redirect('/');
    }
});


router.put('/comment/edit/:id', (req, res) => {
	const commentId = req.params.id;
	const { editComment } = req.body;

	commentModel.findByIdAndUpdate(commentId, { text: editComment }, (err, updatedComment) => {
		if (err) {
			console.log(err);
			res.redirect('/home')
		} else {
			console.log('you comment is updated ');
			res.redirect('/home');
		}
	});
});

router.delete('/comment/delete/:id', (req, res) => {
	const commentId = req.params.id;
	commentModel.findByIdAndDelete(commentId, (err, deletedComment) => {
		if (err) {
			console.log(err);
			res.redirect('/home')
		} else {
			console.log('comment deleted');
			res.redirect('/home');
		}
	});
});

module.exports = router;
