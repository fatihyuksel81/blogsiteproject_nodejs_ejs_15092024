const db = require('../db');
const express = require('express');
const session = require('express-session');
const flush = require('connect-flash');
const { format } = require('date-fns');
const { tr } = require('date-fns/locale');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

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
};

function removeTags(str) {
    if((str === null) || (str === ''))
        return false;
    else
        str = str.toString();
    return str.replace(/(<([^>]+)>)/ig,'')
}

exports.addPost = (req, res) => {
    const { title, content, category } = req.body;
    const image = req.files;
    if (req.session.userId) {
        const sqlImage = 'INSERT INTO images (post_id, file_path) VALUES (?, ?)';
        const filePath = `/uploads/${req.file.filename}`;
        const sql = 'INSERT INTO posts (title, content, category, user_id) VALUES (?, ?, ?, ?)';
        db.query(sql, [title, content, category, req.session.userId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Veritabanı hatası' });
            }
            req.flash('message', 'Makaleniz başarıyla oluşturuldu.');
            const postId = result.insertId;
            db.query(sqlImage, [postId, filePath], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Veritabanı hatası' });
                }
                res.redirect('/');
            });
        });
    } else {
        res.status(401).json({ error: 'Yetkisiz erişim' });
    }
};

exports.showPost = (req, res) => {
    console.log(req.session.userId);
    const message = req.flash('message');
    const sql = `
        SELECT posts.*, users.username, images.file_path
        FROM posts 
        JOIN users ON posts.user_id = users.id
        LEFT JOIN images ON posts.id = images.post_id
    `;
    db.query(sql, (err, results) => {
        if (err) throw err;
        if (req.session.userId) {
            const userSql = 'SELECT username FROM users WHERE id = ?';
            db.query(userSql, [req.session.userId], (err, userResult) => {
                if (err) throw err;

                const loggedInUser = userResult.length > 0 ? userResult[0].username : null;
                
                results.forEach(post => {
                    removeTags(post.content);
                    post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                    post.short_content = post.content.length > 700 ? post.content.substring(0, 700) + '...' : post.content;
                });
                
                res.render('index', { posts: results, userId: req.session.userId, loggedInUser, message });
            });
        } else {
            results.forEach(post => {
                post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                post.short_content = post.content.length > 700 ? post.content.substring(0, 700) + '...' : post.content;
            });
            res.render('index', { posts: results, userId: req.session.userId, loggedInUser: null, message });
        }
    });
};

exports.showPostByCategory = (req, res) => {
    const category = req.params.category;
    const message = req.flash('message');
    console.log(req.session.userId);
    const sql = `
        SELECT posts.*, users.username, images.file_path
        FROM posts
        JOIN users ON posts.user_id = users.id
        LEFT JOIN images ON posts.id = images.post_id
        WHERE category = ?
    `;
    db.query(sql, [category], (err, results) => {
        if (err) throw err;
        if (req.session.userId) {
            const userSql = 'SELECT username FROM users WHERE id = ?';
            db.query(userSql, [req.session.userId], (err, userResult) => {
                if (err) throw err;

                const loggedInUser = userResult.length > 0 ? userResult[0].username : null;
                
                results.forEach(post => {
                    removeTags(post.content);
                    post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                    post.short_content = post.content.length > 700 ? post.content.substring(0, 500) + '...' : post.content;
                });
                
                res.render('category', { posts: results, userId: req.session.userId, loggedInUser, message });
            });
        } else {
            results.forEach(post => {
                post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                post.short_content = post.content.length > 700 ? post.content.substring(0, 700) + '...' : post.content;
            });
            res.render('category', { posts: results, userId: req.session.userId, loggedInUser: null, message });
        }
    });
}

exports.postDetail = (req, res) => {
    const postId = req.params.id;
    console.log(req.session.userId);
    const sql = `
        SELECT posts.*, users.username, images.file_path
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        LEFT JOIN images ON posts.id = images.post_id
        WHERE posts.id = ?
    `;
    const sql1 = `
        SELECT comments.*, users.username 
        FROM comments 
        JOIN users ON comments.user_id = users.id 
        WHERE comments.post_id = ?
        `;
    db.query(sql, [postId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const post = result[0];
            post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
            db.query(sql1, [postId], (err, commentsResult) => {
                if (err) throw err;

                commentsResult.forEach(comment => {
                    comment.created_at_formatted = format(new Date(comment.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                });

                getLoggedInUser(req, (err, user) => {
                    if (err) throw err;

                    res.render('posts', {
                        post,
                        comments: commentsResult,
                        userId: user ? user.id : null,
                        loggedInUser: user ? user.username : null
                    });
                });
            });
        } else {
            res.status(404).send('Gönderi bulunamadı.');
        }
    });
};

exports.showMyPosts = (req, res) => {
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
                SELECT * FROM posts WHERE user_id = ?
            `;
            db.query(sql, [user.id], (err, results) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Sunucu hatası');
                    return;
                }

                results.forEach(post => {
                    post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                    post.short_content = post.content.length > 280 ? post.content.substring(0, 280) + '...' : post.content;
                });

                res.render('my-posts', { posts: results, userId: user.id, loggedInUser: user.username, message });
            });
        });
    } else {
        res.redirect('/login');
    }
};

exports.getEditMyPost = (req, res) => {
    const postId = req.params.id;
    if (req.session.userId) {
        const sql = 'SELECT * FROM posts WHERE id = ? AND user_id = ?';
        db.query(sql, [postId, req.session.userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Sunucu hatası.');
            }
            if (results.length > 0) {
                const post = results[0];
                res.render('edit-post', { post });
            } else {
                req.flash('message', 'Bu gönderiyi düzenleme yetkiniz yok.');
                res.redirect('/');
            }
        });
    } else {
        res.redirect('/login');
    }
};

exports.editMyPost = (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    if (req.session.userId) {
        const checkOwnerSql = 'SELECT * FROM posts WHERE id = ? AND user_id = ?';
        db.query(checkOwnerSql, [postId, req.session.userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Sunucu hatası.');
            }
            if (results.length === 0) {
                req.flash('message', 'Bu gönderiyi güncelleme yetkiniz yok.');
                return res.redirect('/');
            }
            const updateSql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
            db.query(updateSql, [title, content, postId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Sunucu hatası.');
                }
                req.flash('message', 'Gönderi başarıyla güncellendi.');
                res.redirect('/');
            });
        });
    } else {
        res.redirect('/login');
    }
};

exports.deleteMyPost = (req, res) => {
    const postId = req.params.id;
    
    const deleteCommentsSql = 'DELETE FROM comments WHERE post_id = ?';
    db.query(deleteCommentsSql, [postId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
        }

        const getImageSql = 'SELECT file_path FROM images WHERE post_id = ?';
        db.query(getImageSql, [postId], (err, imageResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
            }

            if (imageResults.length > 0) {
                const imagePath = path.join(__dirname, '..', imageResults[0].file_path);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            const deleteImageSql = 'DELETE FROM images WHERE post_id = ?';
            db.query(deleteImageSql, [postId], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
                }
                const deletePostSql = 'DELETE FROM posts WHERE id = ?';
                db.query(deletePostSql, [postId], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
                    }
                    res.json({ success: true, message: 'Gönderi, yorumlar ve resim başarıyla silindi.' });
                });
            });
        });
    });
};
