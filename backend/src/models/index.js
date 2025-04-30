const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Sector = require('./sector')(sequelize, Sequelize);
db.Ticket = require('./ticket')(sequelize, Sequelize);
db.TicketHistory = require('./ticketHistory')(sequelize, Sequelize);

// Associations
db.Sector.hasMany(db.User, { foreignKey: 'sectorId' });
db.User.belongsTo(db.Sector, { foreignKey: 'sectorId' });

db.Sector.hasMany(db.Ticket, { foreignKey: 'sectorId' });
db.Ticket.belongsTo(db.Sector, { foreignKey: 'sectorId' });

db.User.hasMany(db.Ticket, { foreignKey: 'createdBy' });
db.Ticket.belongsTo(db.User, { foreignKey: 'createdBy' });

db.Ticket.hasMany(db.TicketHistory, { foreignKey: 'ticketId' });
db.TicketHistory.belongsTo(db.Ticket, { foreignKey: 'ticketId' });

db.User.hasMany(db.TicketHistory, { foreignKey: 'changedBy' });
db.TicketHistory.belongsTo(db.User, { foreignKey: 'changedBy' });

module.exports = db;
