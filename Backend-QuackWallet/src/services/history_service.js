const connection = require('../config/db_config');

// Obtener historial de transferencias
exports.getTransferHistory = async (userId) => {
        const [rows] = await connection.execute(`
            SELECT DISTINCT t.* FROM Transacciones t
            JOIN Billeteras b ON t.ID_Billetera_Origen = b.ID_Billetera OR t.ID_Billetera_Destino = b.ID_Billetera
            WHERE b.ID_Usuario = ? AND t.Tipo_Transaccion = 'transferencia'
            `, [userId]);
        
        return rows
};

// Obtener historial de retiros
exports.getWithdrawalHistory = async (userId) => {
        const [rows] = await connection.execute(`
            SELECT DISTINCT t.* FROM Transacciones t
            JOIN Billeteras b ON t.ID_Billetera_Origen = b.ID_Billetera OR t.ID_Billetera_Destino = b.ID_Billetera
            WHERE b.ID_Usuario = ? AND t.Tipo_Transaccion = 'retiro'
        `, [userId]);
        
        return rows;
};

// Obtener historial de depósitos
exports.getDepositHistory = async (userId) => {
        const [rows] = await connection.execute(`
            SELECT DISTINCT t.* FROM Transacciones t
            JOIN Billeteras b ON t.ID_Billetera_Origen = b.ID_Billetera OR t.ID_Billetera_Destino = b.ID_Billetera
            WHERE b.ID_Usuario = ? AND t.Tipo_Transaccion = 'deposito'
            `, [userId]);
        
        return rows;
};

// Obtener todas las transacciones
exports.getAllTransactions = async (userId) => {
        const [rows] = await connection.execute(`
            SELECT DISTINCT t.* FROM Transacciones t
            JOIN Billeteras b ON t.ID_Billetera_Origen = b.ID_Billetera OR t.ID_Billetera_Destino = b.ID_Billetera
            WHERE b.ID_Usuario = ?
            `, [userId]);
        
        return rows;
};

//Finalizado