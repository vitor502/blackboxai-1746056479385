const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Sector } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Create a new sector (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { nome, emailComunitario, senhaComunitaria } = req.body;

    const hashedPassword = await bcrypt.hash(senhaComunitaria, 10);

    const sector = await Sector.create({
      nome,
      emailComunitario,
      senhaComunitaria: hashedPassword,
    });

    res.status(201).json(sector);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar setor', error });
  }
});

// Get all sectors (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const sectors = await Sector.findAll();
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar setores', error });
  }
});

// Update sector (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const sectorId = req.params.id;
    const { nome, emailComunitario, senhaComunitaria } = req.body;

    const sector = await Sector.findByPk(sectorId);
    if (!sector) return res.status(404).json({ message: 'Setor não encontrado' });

    sector.nome = nome || sector.nome;
    sector.emailComunitario = emailComunitario || sector.emailComunitario;
    if (senhaComunitaria) {
      sector.senhaComunitaria = await bcrypt.hash(senhaComunitaria, 10);
    }

    await sector.save();

    res.json(sector);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar setor', error });
  }
});

// Delete sector (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const sectorId = req.params.id;
    const sector = await Sector.findByPk(sectorId);
    if (!sector) return res.status(404).json({ message: 'Setor não encontrado' });

    await sector.destroy();
    res.json({ message: 'Setor deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar setor', error });
  }
});

module.exports = router;
