const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testCourses() {
    try {
        console.log('Testing courses query...');
        const res = await pool.query('SELECT * FROM courses WHERE is_premium = FALSE ORDER BY id ASC');
        console.log('Found courses:', res.rows.length);
        console.log('First course:', res.rows[0]);

        console.log('\nTesting challenges query...');
        const res2 = await pool.query('SELECT * FROM challenges WHERE is_premium = FALSE ORDER BY id ASC');
        console.log('Found challenges:', res2.rows.length);
        console.log('First challenge:', res2.rows[0]);

    } catch (err) {
        console.error('Query error:', err.message);
        if (err.hint) console.log('Hint:', err.hint);

        try {
            console.log('\nChecking table structure for courses...');
            const struct = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses'");
            console.log('Columns:', struct.rows);
        } catch (e) {
            console.error('Could not get structure:', e.message);
        }
    } finally {
        await pool.end();
    }
}

testCourses();
