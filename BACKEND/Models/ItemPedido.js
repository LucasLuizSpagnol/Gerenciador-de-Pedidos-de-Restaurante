module.exports = (sequelize, DataTypes) => {
    const ItemPedido = sequelize.define('ItemPedido', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_pedido: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_alimento: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        qtd_alimento: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true, 
        },
        id_acompanhamento: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        qtd_acompanhamento: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true, 
        },
    }, {
        // Opções do Modelo
        tableName: 'item_pedido',
        timestamps: false,
        freezeTableName: true,
    });
    
    return ItemPedido;
};