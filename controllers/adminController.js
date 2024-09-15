const bcrypt = require('bcrypt');
const db = require('../db');
const express = require('express');
const session = require('express-session');
const flush = require('connect-flash');
const { format } = require('date-fns');
const { tr } = require('date-fns/locale');
const fs = require('fs');
const path = require('path');

function isAdmin(userId, callback) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        if (results.length > 0) {
            const user = results[0];
            if (user.is_admin == 1) {
                return callback(null, true);
            } else {
                return callback(null, false);
            }
        } else {
            return callback(null, false);
        }
    });
}

exports.index = (req, res) => {
    const message = req.flash('message');
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/admin/login');
    }

    isAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası.');
        }

        if (isAdmin) {
            res.render('admin/adminindex', { message });
        } else {
            req.flash('message', 'Bu sayfayı görüntüleme yetkiniz yok.');
            res.redirect('/');
        }
    });
};

exports.getEditPost = (req, res) => {
    const postId = req.params.id;
    if (req.session.userId) {
        const sql = 'SELECT * FROM posts WHERE id = ?';
        db.query(sql, [postId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Sunucu hatası.');
            }
            if (results.length > 0) {
                const post = results[0];
                res.render('admin/adminedit-post', { post });
            } else {
                req.flash('message', 'Bu gönderiyi düzenleme yetkiniz yok.');
                res.redirect('/admin/posts');
            }
        });
    } else {
        res.redirect('/admin/login');
    }
};

exports.editPost = (req, res) => {
    const postId = req.params.id;
    const { title, content } = req.body;
    if (req.session.userId) {
            const updateSql = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
            db.query(updateSql, [title, content, postId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Sunucu hatası.');
                }
                req.flash('message', 'Gönderi başarıyla güncellendi.');
                res.redirect('/admin/posts');
            });
    } else {
        res.redirect('/admin/login');
    }
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
            if (bcrypt.compareSync(password, user.password) && user.is_admin == 1) {
                req.session.userId = user.id;
                req.flash('message', 'Giriş başarılı.');
                res.redirect('/admin/');
            }
            else if (user.is_admin == 0) {
                req.flash('message', 'Yetkili bir kullanıcı değilsiniz.')
                res.redirect('/admin/login')
            }
            else {
                req.flash('message', 'Geçersiz şifre.');
                res.redirect('/admin/login');
            } 
        } else {
            req.flash('message', 'Kullanıcı bulunamadı.');
            res.redirect('/admin/login');
        }
    });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

exports.getAllPosts = (req, res) => {
    const message = req.flash('message');
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/admin/login');
    }

    isAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası.');
        }

        if (isAdmin) {
            const sql = `
                SELECT posts.*, users.username 
                FROM posts 
                JOIN users ON posts.user_id = users.id
            `;
            db.query(sql, (err, results) => {
                if (err) throw err;
                results.forEach(post => {
                    post.created_at_formatted = format(new Date(post.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                });
                res.render('admin/adminposts', { posts: results, message });
            });
        } else {
            req.flash('message', 'Bu sayfayı görüntüleme yetkiniz yok.');
            res.redirect('/');
        }
    });
};

exports.getAllUsers = (req, res) => {
    const message = req.flash('message');
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/admin/login');
    }

    isAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası.');
        }

        if (isAdmin) {
            const sql = `
                SELECT * FROM users
            `;
            db.query(sql, (err, results) => {
                if (err) throw err;
                results.forEach(user => {
                    user.created_at_formatted = format(new Date(user.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                });
                res.render('admin/adminusers', { users: results, message });
            });
        } else {
            req.flash('message', 'Bu sayfayı görüntüleme yetkiniz yok.');
            res.redirect('/');
        }
    });
};

exports.deletePost = (req, res) => {
    const postId = req.params.id;

    const sqlDeleteComments = 'DELETE FROM comments WHERE post_id = ?';
    db.query(sqlDeleteComments, [postId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
        }
        const sqlGetPost = 'SELECT file_path FROM images WHERE post_id = ?';
        db.query(sqlGetPost, [postId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
            }

            if (results.length > 0) {
                const post = results[0];
                const imagePath = post.image_path;
                if (imagePath) {
                    const filePath = path.join(__dirname, '../uploads', imagePath);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Dosya silinirken hata oluştu:', err);
                        } else {
                            console.log('Dosya başarıyla silindi:', filePath);
                        }
                    });
                }
                const deletePostSql = 'DELETE FROM posts WHERE id = ?';
                db.query(deletePostSql, [postId], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
                    }

                    res.json({ success: true, message: 'Gönderi, ilgili resim ve yorumlar başarıyla silindi.' });
                });
            } else {
                const deletePostSql = 'DELETE FROM posts WHERE id = ?';
                db.query(deletePostSql, [postId], (err, results) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
                    }

                    res.json({ success: true, message: 'Gönderi, ilgili resim ve yorumlar başarıyla silindi.' });
                });
            }
        });
    });
};
exports.deleteComment = (req,res) => {
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

exports.deleteUser = (req, res) => {
    const userId = req.params.id;
    const sqlDeleteComments = 'DELETE FROM comments WHERE user_id = ?'
    db.query(sqlDeleteComments, [userId], (err, results) => {
        if(err){
            console.error(err);
            return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
        };
        const deletePostSql = 'DELETE FROM posts WHERE user_id = ?';
        db.query(deletePostSql, [userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
            }
            const deleteUserSql = 'DELETE FROM users WHERE id = ?';
            db.query(deleteUserSql, [userId], (err, results) => {
                if(err){
                    console.error(err);
                    return res.status(500).json({ success: false, message: 'Sunucu hatası.'});
                }
            })
        });
    })
};

exports.getAllComments = (req, res) => {
    const message = req.flash('message');
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/admin/login');
    }

    isAdmin(userId, (err, isAdmin) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Sunucu hatası.');
        }

        if (isAdmin) {
            const sql = `
                SELECT comments.*, users.username , posts.title AS post_title
                FROM comments 
                JOIN users ON comments.user_id = users.id
                JOIN posts ON comments.post_id = posts.id
            `;
            db.query(sql, (err, results) => {
                if (err) throw err;
                results.forEach(comment => {
                    comment.created_at_formatted = format(new Date(comment.created_at), 'd MMMM yyyy HH:mm', { locale: tr });
                });
                res.render('admin/admincomments', { comments: results, message });
            });
        } else {
            req.flash('message', 'Bu sayfayı görüntüleme yetkiniz yok.');
            res.redirect('/');
        }
    });
};