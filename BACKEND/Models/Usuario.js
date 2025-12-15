module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      login: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      adm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
      funcionario: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      }
    }, {
      tableName: 'usuario',
      timestamps: false
    });

    return Usuario; 
};