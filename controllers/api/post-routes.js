const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');

//get all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'post_url', 'post_text', 'title', 'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
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
    Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
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

//put /api/posts/vote
router.put('/upvote', (req, res) => {
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(() => {
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'post_text',
                'created_at',
                [sequelize.literal('(SELECT Count(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ]
        })
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
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