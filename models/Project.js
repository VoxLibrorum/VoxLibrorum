const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.STRING, // We use custom IDs like 'salt-line'
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    resources_json: {
        type: DataTypes.TEXT, // Storing large JSON array of resources for now
        defaultValue: '[]',
        get() {
            const rawValue = this.getDataValue('resources_json');
            return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
            this.setDataValue('resources_json', JSON.stringify(value));
        }
    },
    ai_context: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ownerId: {
        type: DataTypes.UUID,
        allowNull: true // For now optional, until we force auth everywhere
    }
});

module.exports = Project;
