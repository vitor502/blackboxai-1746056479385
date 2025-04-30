const express = require('express');
const router = express.Router();
const { Ticket, TicketHistory, User } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// Create a new ticket (representative only)
router.post('/', authenticateToken, authorizeRoles('representante'), async (req, res) => {
  try {
    const { titulo, descricao, prioridade, sectorId } = req.body;
    const createdBy = req.user.id;

    const ticket = await Ticket.create({
      titulo,
      descricao,
      prioridade,
      status: 'Aberto',
      sectorId,
      createdBy,
      dataCriacao: new Date(),
      dataAtualizacao: new Date(),
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar chamado', error });
  }
});

// Get tickets for sector (communal login) with filters
router.get('/', authenticateToken, authorizeRoles('comunitario', 'admin'), async (req, res) => {
  try {
    const { status, prioridade, dataInicio, dataFim } = req.query;
    const sectorId = req.user.sectorId;

    const whereClause = { sectorId };

    if (status) whereClause.status = status;
    if (prioridade) whereClause.prioridade = prioridade;
    if (dataInicio || dataFim) {
      whereClause.dataCriacao = {};
      if (dataInicio) whereClause.dataCriacao[Op.gte] = new Date(dataInicio);
      if (dataFim) whereClause.dataCriacao[Op.lte] = new Date(dataFim);
    }

    const tickets = await Ticket.findAll({ where: whereClause, order: [['dataCriacao', 'DESC']] });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar chamados', error });
  }
});

// Update ticket status (communal login)
router.put('/:id/status', authenticateToken, authorizeRoles('comunitario', 'admin'), async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status, observacao } = req.body;
    const userId = req.user.id;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Chamado não encontrado' });

    if (ticket.sectorId !== req.user.sectorId && req.user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado ao chamado deste setor' });
    }

    const statusAnterior = ticket.status;
    ticket.status = status;
    ticket.dataAtualizacao = new Date();
    await ticket.save();

    await TicketHistory.create({
      ticketId,
      data: new Date(),
      statusAnterior,
      statusNovo: status,
      observacao,
      changedBy: userId,
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar status do chamado', error });
  }
});

// Get ticket history (communal login)
router.get('/:id/history', authenticateToken, authorizeRoles('comunitario', 'admin'), async (req, res) => {
  try {
    const ticketId = req.params.id;

    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ message: 'Chamado não encontrado' });

    if (ticket.sectorId !== req.user.sectorId && req.user.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado ao chamado deste setor' });
    }

    const history = await TicketHistory.findAll({
      where: { ticketId },
      order: [['data', 'DESC']],
      include: [{ model: User, attributes: ['id', 'nome', 'email'] }],
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico do chamado', error });
  }
});

module.exports = router;
