module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('representante', 'comunitario', 'admin'),
      allowNull: false,
    },
    sectorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Sectors',
        key: 'id',
      },
      field: 'sector_id',
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
