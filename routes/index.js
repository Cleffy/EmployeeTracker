const router = require('express').Router();

const departments = require('./departments');
const roles = require('./roles');
const employees = require('./employees');

// Create route for unspecified request
router.use((request, response) => {
    response.status(404).end();
});

router.use('/departments', departments);
router.use('/roles', roles);
router.use('/employees', employees);

module.exports = router;