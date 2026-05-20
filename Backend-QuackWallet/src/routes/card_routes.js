const express = require('express');
const router = express.Router();
const cardController = require('../controllers/card_controller');

router.post('/create/:userId', cardController.addCard);
router.get('/user/:userId', cardController.listCards);
router.get('/user/:userId/inactive', cardController.listInactiveCards);
router.put('/:cardId/update', cardController.updateCard);
router.put('/:cardId/reactivate', cardController.reactivateCard);
router.delete('/:cardId/delete', cardController.deleteCard);;

module.exports = router;