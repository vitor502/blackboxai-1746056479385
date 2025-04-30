module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prioridade: {
      type: DataTypes.ENUM('Alta', 'Média', 'Baixa'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Aberto', 'Em andamento', 'Concluído', 'Cancelado'),
      allowNull: false,
      defaultValue: 'Aberto',
    },
    sectorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sectors',
        key: 'id',
      },
      field: 'sector_id',
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      field: 'criado_por',
    },
    dataCriacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'data_criacao',
    },
    dataAtualizacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'data_atualizacao',
    },
  }, {
    tableName: 'tickets',
    timestamps: false,
  });

  return Ticket;
};
