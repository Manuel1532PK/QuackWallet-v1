const connection = require('../config/db_config');

// Obtener saldo de la billetera del usuario
exports.getBalance = async (userId) => {
        const [rows] = await connection.execute(`
            SELECT Moneda, Saldo FROM Billeteras WHERE ID_Usuario = ?
         `, [userId]);
        
        return rows[0] || { Moneda: null, Saldo: 0 };
};

// Obtener todas las transacciones del usuario
exports.getAllTransactions = async (userId) => {
    const [rows] = await connection.execute(`
        SELECT DISTINCT t.* FROM Transacciones t
        JOIN Billeteras b ON t.ID_Billetera_Origen = b.ID_Billetera OR t.ID_Billetera_Destino = b.ID_Billetera
        WHERE b.ID_Usuario = ?
        `, [userId]);
    return rows;
}