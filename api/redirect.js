const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('./redirects.db', (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Set up the database on startup
db.serialize(() => {
    console.log('Setting up the database...');
    db.run(`
        CREATE TABLE IF NOT EXISTS redirects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            count INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error('Failed to create table:', err.message);
        } else {
            console.log('Table created or already exists.');
        }
    });

    const urls = [
        "https://form.jotform.com/smitchinson/cove-b1",
        "https://form.jotform.com/smitchinson/cove-b2",
        "https://form.jotform.com/smitchinson/cove-b3",
        "https://form.jotform.com/smitchinson/cove-b4"
    ];

    urls.forEach((url) => {
        db.run(`INSERT OR IGNORE INTO redirects (url, count) VALUES (?, 0)`, [url], (err) => {
            if (err) {
                console.error('Failed to insert URL:', err.message);
            } else {
                console.log(`Inserted URL: ${url}`);
            }
        });
    });
});

// Handle API requests
module.exports = (req, res) => {
    console.log('Handling API request...');
    db.serialize(() => {
        db.get(
            `SELECT id, url, count FROM redirects ORDER BY count ASC LIMIT 1`,
            (err, row) => {
                if (err) {
                    console.error('Database query failed:', err.message);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    return;
                }

                console.log(`Redirecting to: ${row.url}`);
                db.run(`UPDATE redirects SET count = count + 1 WHERE id = ?`, [row.id], (updateErr) => {
                    if (updateErr) {
                        console.error('Failed to update count:', updateErr.message);
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                        return;
                    }

                    res.writeHead(302, { Location: row.url });
                    res.end();
                });
            }
        );
    });
};
