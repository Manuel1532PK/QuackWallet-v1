const cardService = require('../services/card_service');
const historyService = require('../services/history_service');

exports.getReport = async (req, res) => {
    try {
        const userId = req.params.userId;

        const cards = await cardService.listCards(userId);

        const cardsTotal = cards.reduce((s, c) => s + Number(c.Saldo || 0), 0);
        const cardsBreakdown = cards.map((c) => ({
            nombre: c.Nombre,
            lastFour: c.Numero ? c.Numero.slice(-4) : '****',
            saldo: Number(c.Saldo || 0),
            porcentaje: cardsTotal > 0 ? ((Number(c.Saldo || 0) / cardsTotal) * 100).toFixed(1) : '0',
        }));

        const [deposits, withdrawals, transfers] = await Promise.all([
            historyService.getDepositHistory(userId),
            historyService.getWithdrawalHistory(userId),
            historyService.getTransferHistory(userId),
        ]);

        const totalIngresos = deposits.reduce((s, t) => s + Number(t.Monto_Transaccion || 0), 0);
        const totalGastos = withdrawals.reduce((s, t) => s + Number(t.Monto_Transaccion || 0), 0);
        const totalTransferencias = transfers.reduce((s, t) => s + Number(t.Monto_Transaccion || 0), 0);

        const allTransactions = [...deposits, ...withdrawals, ...transfers];

        const monthlyMap = {};
        allTransactions.forEach((tx) => {
            const d = new Date(tx.Fecha_Transaccion);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyMap[key]) monthlyMap[key] = { ingresos: 0, gastos: 0, transferencias: 0 };
            if (tx.Tipo_Transaccion === 'deposito') {
                monthlyMap[key].ingresos += Number(tx.Monto_Transaccion) || 0;
            } else if (tx.Tipo_Transaccion === 'retiro') {
                monthlyMap[key].gastos += Number(tx.Monto_Transaccion) || 0;
            } else if (tx.Tipo_Transaccion === 'transferencia') {
                monthlyMap[key].transferencias += Number(tx.Monto_Transaccion) || 0;
            }
        });

        const monthlyData = Object.entries(monthlyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-6)
            .map(([key, val]) => ({
                mes: key,
                ingresos: val.ingresos,
                gastos: val.gastos,
                transferencias: val.transferencias,
            }));

        res.status(200).json({
            cardsTotal,
            cardsCount: cards.length || 0,
            cardsBreakdown,
            totalIngresos,
            totalGastos,
            totalTransferencias,
            monthlyData,
        });
    } catch (error) {
        console.error('Error en reporte:', error);
        res.status(500).json({ message: 'Error al generar reporte', error: error.message });
    }
};
