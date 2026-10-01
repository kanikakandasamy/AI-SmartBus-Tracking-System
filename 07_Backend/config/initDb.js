const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function initDatabase() {
    console.log("🔄 Initializing AI Smart Bus Database...");
    
    // Connect to MySQL server without specific database first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306,
        multipleStatements: true
    });

    try {
        const sqlFilePath = path.join(__dirname, "../../02_Database/init_db.sql");
        const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

        console.log("📦 Executing SQL schema and seed data...");
        await connection.query(sqlContent);
        console.log("✅ Database and tables initialized successfully with seed data!");
    } catch (err) {
        console.error("❌ Error running database init script:", err.message);
        throw err;
    } finally {
        await connection.end();
    }
}

if (require.main === module) {
    initDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

module.exports = initDatabase;
