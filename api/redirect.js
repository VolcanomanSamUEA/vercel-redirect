const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('./redirects.db', (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create the redirects table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS redirects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            count INTEGER DEFAULT 0
        )
    `);

    // List of URLs for redirection
    const urls = [
        "https://form.jotform.com/smitchinson/cove-b1",
        "https://form.jotform.com/smitchinson/cove-b2",
        "https://form.jotform.com/smitchinson/cove-b3",
        "https://form.jotform.com/smitchinson/cove-b4"
    ];

    // Populate the database with URLs if not already populated
    urls.forEach((url) => {
        db.run(`INSERT OR IGNORE INTO redirects (url, count) VALUES (?, 0)`, [url]);
    });
});

// Handle API requests
module.exports = (req, res) => {
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

                // Increment the redirect count for the selected URL
                db.run(`UPDATE redirects SET count = count + 1 WHERE id = ?`, [row.id], (updateErr) => {
                    if (updateErr) {
                        console.error('Failed to update count:', updateErr.message);
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                        return;
                    }

                    // Redirect the user to the selected URL
                    res.writeHead(302, { Location: row.url });
                    res.end();
                });
            }
        );
    });
};
