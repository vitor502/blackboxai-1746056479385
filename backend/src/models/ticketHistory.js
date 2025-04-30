module.exports = (sequelize, DataTypes) => {
  const TicketHistory = sequelize.define('TicketHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tickets',
        key: 'id',
      },
      field: 'chamado_id',
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    statusAnterior: {
      type: DataTypes.ENUM('Aberto', 'Em andamento', 'Concluído', 'Cancelado'),
      allowNull: false,
      field: 'status_anterior',
    },
    statusNovo: {
      type: DataTypes.ENUM('Aberto', 'Em andamento', 'Concluído', 'Cancelado'),
      allowNull: false,
      field: 'status_novo',
    },
    observacao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    changedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      field: 'alterado_por',
    },
  }, {
    tableName: 'ticket_histories',
    timestamps: false,
  });

  return TicketHistory;
};
