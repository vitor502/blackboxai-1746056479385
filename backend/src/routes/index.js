const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const ticketRoutes = require('./tickets');
const userRoutes = require('./users');
const sectorRoutes = require('./sectors');

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/users', userRoutes);
router.use('/sectors', sectorRoutes);

module.exports = router;
