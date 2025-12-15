const sequelize = require('../Config/Conection');
const { DataTypes } = require('sequelize');

const UsuarioModelDef = require('./Usuario');
const PedidoModelDef = require('./Pedido');
const AlimentoModelDef = require('./Alimento');
const AcompanhamentoModelDef = require('./Acompanhamento');
const ItemPedidoModelDef = require('./ItemPedido');

// 3. Inicializa os Modelos (CHAMANDO CADA FUNÇÃO)
// As variáveis agora contêm os OBJETOS do Modelo Sequelize prontos para associação.
const Usuario = UsuarioModelDef(sequelize, DataTypes);
const Pedido = PedidoModelDef(sequelize, DataTypes);
const Alimento = AlimentoModelDef(sequelize, DataTypes);
const Acompanhamento = AcompanhamentoModelDef(sequelize, DataTypes);
const ItemPedido = ItemPedidoModelDef(sequelize, DataTypes);

// Usuário (1) para Pedidos (M)
Usuario.hasMany(Pedido, {
  foreignKey: 'id_usuario',
  as: 'pedidos' 
});
Pedido.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario' 
});

// Pedido (1) para ItemPedido (M)
Pedido.hasMany(ItemPedido, {
  foreignKey: 'id_pedido',
  as: 'itens', 
  onDelete: 'CASCADE'
});
ItemPedido.belongsTo(Pedido, {
  foreignKey: 'id_pedido',
  as: 'pedido'
});

// Alimento (1) para ItemPedido (M)
Alimento.hasMany(ItemPedido, {
  foreignKey: 'id_alimento',
  as: 'itens_principais'
});
ItemPedido.belongsTo(Alimento, {
  foreignKey: 'id_alimento',
  as: 'alimento'
});

// Acompanhamento (1) para ItemPedido (M)
Acompanhamento.hasMany(ItemPedido, {
  foreignKey: 'id_acompanhamento',
  as: 'itens_acompanhamento'
});
ItemPedido.belongsTo(Acompanhamento, {
  foreignKey: 'id_acompanhamento',
  as: 'acompanhamento'
});

module.exports = {
  sequelize,
  Usuario,
  Pedido,
  Alimento,
  Acompanhamento,
  ItemPedido
};