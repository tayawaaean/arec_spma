const express = require('express');
const router = express.Router();
const pumpController = require('../controllers/pumpController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Add a pump (admin/superadmin only)
router.post('/', auth, authorize('admin', 'superadmin'), pumpController.addPump);

// Edit a pump (admin/superadmin only)
router.put('/:id', auth, authorize('admin', 'superadmin'), pumpController.editPump);

// Delete a pump (admin/superadmin only)
router.delete('/:id', auth, authorize('admin', 'superadmin'), pumpController.deletePump);

// List all pumps (any authenticated user)
router.get('/', auth, pumpController.listPumps);

// Get a single pump (any authenticated user)
router.get('/:id', auth, pumpController.getPump);

module.exports = router;