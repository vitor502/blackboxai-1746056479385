const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Sector } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, tipo: user.tipo, sectorId: user.sectorId },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// Representative and Admin login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(401).json({ message: 'Senha inválida' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, nome: user.nome, tipo: user.tipo, sectorId: user.sectorId } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
});

// Sector communal login
router.post('/sector-login', async (req, res) => {
  const { emailComunitario, senhaComunitaria } = req.body;
  try {
    const sector = await Sector.findOne({ where: { emailComunitario } });
    if (!sector) return res.status(401).json({ message: 'Setor não encontrado' });

    const validPassword = await bcrypt.compare(senhaComunitaria, sector.senhaComunitaria);
    if (!validPassword) return res.status(401).json({ message: 'Senha inválida' });

    // Create a token with sector info and tipo 'comunitario'
    const token = jwt.sign(
      { sectorId: sector.id, tipo: 'comunitario' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, sector: { id: sector.id, nome: sector.nome, emailComunitario: sector.emailComunitario } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error });
  }
});

module.exports = router;
