const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flush = require('connect-flash');
const path = require('path');
const db = require('./db');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flush());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.set('view engine', 'ejs');

app.use('/', userRoutes);
app.use('/', postRoutes);
app.use('/', commentRoutes);
app.use('/admin/', adminRoutes);

app.use((req, res, next) => {
    res.locals.message = req.flash('message');
    next();
});

app.listen(3000, () => {
    console.log('3000')
});