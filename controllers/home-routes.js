const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('homepage', {
        id: 1,
        post_url: 'https://handlebars.js.com/guide/',
        title: 'Handlebars Docs',
        post_text: 'Handlebars is the express way to create a new MVC',
        created_at: new Date(),
        vote_count: 10,
        comments: [{}, {}],
        user: {
            username: 'text_user'
        }
    });
});

module.exports = router;