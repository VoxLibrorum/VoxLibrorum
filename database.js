const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite Database
// This will create a file named 'vox_archive.sqlite' in your project root
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'vox_archive.sqlite'),
    logging: false // Set to console.log to see raw SQL queries
});

module.exports = sequelize;
