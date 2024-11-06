const mysql = require('mysql');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'blogdb'
});

db.connect(function(err) {
    if (err) throw err;
    console.log("db aktif");
});

function deleteOldBackup(backupDirectory) {
    fs.readdir(backupDirectory, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            if (path.extname(file) === '.sql') {
                const filePath = path.join(backupDirectory, file);
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                    console.log(`Eski yedek dosyası silindi: ${filePath}`);
                });
            }
        });
    });
}

function backupDatabase() {
    const backupDirectory = './backups';
    const backupFile = `${backupDirectory}/backup_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.sql`;

    deleteOldBackup(backupDirectory);

    const command = `mysqldump --user=${db.config.user} --password=${db.config.password} --host=${db.config.host} ${db.config.database} > ${backupFile}`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Yedekleme başarısız oldu: ${err.message}`);
            return;
        }
        console.log(`Veritabanı başarıyla yedeklendi: ${backupFile}`);
    });
}

cron.schedule('45 18 * * *', () => {
    console.log("Yedekleme işlemi başlatılıyor...");
    backupDatabase();
});

module.exports = db;
