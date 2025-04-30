module.exports = (sequelize, DataTypes) => {
  const Sector = sequelize.define('Sector', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailComunitario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'email_comunitario',
    },
    senhaComunitaria: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'senha_comunitaria',
    },
  }, {
    tableName: 'sectors',
    timestamps: false,
  });

  return Sector;
};
