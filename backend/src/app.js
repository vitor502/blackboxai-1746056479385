require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

const PORT = process.env.PORT || 4000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
