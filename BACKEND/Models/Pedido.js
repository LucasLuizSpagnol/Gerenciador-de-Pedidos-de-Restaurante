module.exports = (sequelize, DataTypes) => {
    const Pedido = sequelize.define('Pedido', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_usuario: { 
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'usuario', 
                key: 'id'
            }
        },
        data_pedido: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'Pendente',
        },
        valor_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        
    }, {
        tableName: 'pedido', 
        timestamps: false, 
        freezeTableName: true, 
    });

    return Pedido;
};
