const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Sector } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Create a new user (admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { nome, email, senha, tipo, sectorId } = req.body;

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await User.create({
      nome,
      email,
      senha: hashedPassword,
      tipo,
      sectorId,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.findAll({ include: Sector });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { nome, email, senha, tipo, sectorId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    user.nome = nome || user.nome;
    user.email = email || user.email;
    if (senha) {
      user.senha = await bcrypt.hash(senha, 10);
    }
    user.tipo = tipo || user.tipo;
    user.sectorId = sectorId || user.sectorId;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário', error });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    await user.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário', error });
  }
});

module.exports = router;
