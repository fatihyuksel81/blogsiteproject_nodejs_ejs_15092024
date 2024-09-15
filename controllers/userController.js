const bcrypt = require('bcrypt');
const db = require('../db');
const express = require('express');
const session = require('express-session');
const flush = require('connect-flash');

const users = express();
users.use(flush());

users.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



exports.register = (req, res) => {
    const { username,  email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, 0)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if(err) throw err;
        req.flash('message', 'Başarıyla Kullanıcı Oluşturdunuz.')
        res.redirect('/');
    });
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    const message = req.flash('message');
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası.');
        }
        if (results.length > 0) {
            const user = results[0];
            if (bcrypt.compareSync(password, user.password)) {
                req.session.userId = user.id;
                req.flash('message', 'Giriş başarılı.');
                res.redirect('/');
            } else {
                req.flash('message', 'Geçersiz şifre.');
                res.redirect('/login');
            }
        } else {
            req.flash('message', 'Kullanıcı bulunamadı.');
            res.redirect('/login');
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};
