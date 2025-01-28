const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database
const db = new sqlite3.Database('./redirects.db');

// Set up the database table and initial data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS redirects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            count INTEGER DEFAULT 0
        )
    `);

    const urls = [
        "https://form.jotform.com/smitchinson/cove-b1",
        "https://form.jotform.com/smitchinson/cove-b2",
        "https://form.jotform.com/smitchinson/cove-b3",
        "https://form.jotform.com/smitchinson/cove-b4"
    ];

    // Insert URLs if they do not already exist
    urls.forEach((url) => {
        db.run(
            `INSERT OR IGNORE INTO redirects (url, count) VALUES (?, 0)`,
            [url]
        );
    });
});

// Handle redirection
module.exports = (req, res) => {
    db.serialize(() => {
        // Fetch the URL with the least count
        db.get(
            `SELECT id, url, count FROM redirects ORDER BY count ASC LIMIT 1`,
            (err, row) => {
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                    return;
                }

                // Increment the count for the selected URL
                db.run(
                    `UPDATE redirects SET count = count + 1 WHERE id = ?`,
                    [row.id],
                    (updateErr) => {
                        if (updateErr) {
                            console.error(updateErr);
                            res.statusCode = 500;
                            res.end('Failed to update count');
                            return;
                        }

                        // Redirect to the selected URL
                        res.writeHead(302, { Location: row.url });
                        res.end();
                    }
                );
            }
        );
    });
};
