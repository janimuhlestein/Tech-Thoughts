const router = require('express').Router();
const { Post, User } = require('../../models');

//get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'post_text', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get one post
router.get('/:id', (req, res) => {
    Post.findOne({
        attributes: ['id', 'post_url', 'post_text', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        post_text: req.body.post_text,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

//update a post
router.put('/:id', (req, res) => {
    Post.update({
        title: req.body.title,
        post_text: req.body.post_test,
        post_url: req.body.post_url
    },
    {
        where: {
            id: req.params.id
        }
    }
)
.then(dbPostData => {
    if (!dbPostData) {
        res.status(404).json({message: 'No post found with that id!'});
        return;
    }
    res.json(dbPostData)  
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with that id!'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;