module.exports = (sequelize, DataTypes) => {
    const Alimento = sequelize.define('Alimento', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    }, {
      tableName: 'alimento',
      timestamps: false,
    });

    return Alimento;
};