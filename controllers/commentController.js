const db = require('../db');
const express = require('express');
const session = require('express-session');
const flush = require('connect-flash');
const { format } = require('date-fns');
const { tr } = require('date-fns/locale');

const users = express();
users.use(flush());

users.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function getLoggedInUser(req, callback) {
    if (req.session.userId) {
        const sql = 'SELECT username FROM users WHERE id = ?';
        db.query(sql, [req.session.userId], (err, userResult) => {
            if (err) {
                return callback(err, null);
            }
            if (userResult.length > 0) {
                return callback(null, { id: req.session.userId, username: userResult[0].username });
            } else {
                return callback(null, null);
            }
        });
    } else {
        callback(null, null);
    }
}

exports.makeComment = (req, res) => {
    const {content, postId} = req.body;
    if(req.session.userId){
        const sql = 'INSERT INTO comments (content,post_id, user_id) VALUES (?, ?, ?)';
        db.query(sql, [content, postId, req.session.userId], (err, result) =>{
            if (err) throw err;
            res.redirect("/");

        });
    } else {
        res.redirect('/login');
    }
};

exports.editMyComment = (req, res) => {
    const commentId = req.params.id;
    const newContent = req.body.content;

    if (req.session.userId) {
        const sql = 'UPDATE comments SET content = ? WHERE id = ? AND user_id = ?';
        db.query(sql, [newContent, commentId, req.session.userId], (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: false, message: 'Sunucu hatası' });
                return;
            }
            res.json({ success: true, message: 'Yorum başarıyla güncellendi' });
        });
    } else {
        res.status(401).json({ success: false, message: 'Giriş yapmanız gerekiyor' });
    }
};

exports.showMyComments = (req, res) => {
    const message = req.flash('message');
    if (req.session.userId) {
        getLoggedInUser(req, (err, user) => {
            if (err) {
                console.error(err);
                res.status(500).send('Sunucu hatası');
                return;
            }

            if (!user) {
                res.redirect('/login');
                return;
            }

            const sql = `
                SELECT comments.*, posts.title AS post_title 
                FROM comments 
                JOIN posts ON comments.post_id = posts.id 
                WHERE comments.user_id = ?
            `;
            db.query(sql, [user.id], (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Sunucu hatası');
                    return;
                }

                results.forEach(comment => {
                    comment.created_at_formatted = format(new Date(comment.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                });

                res.render('my-comments', { comments: results, userId: user.id, loggedInUser: user.username, message });
            });
        });
    } else {
        res.redirect('/login');
    }
};

exports.deleteMyComment = (req,res) => {
    const commentId = req.params.id;
    const deleteCommentsSql = 'DELETE FROM comments WHERE id = ?';
    db.query(deleteCommentsSql, [commentId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
        }
        res.json({ success: true, message: 'Yorum başarıyla silindi.' });
    });
};