const { Router } = require('express');
const { getAllCompanies , getCompanyById } = require('../handlers/companies.handlers');

const router = Router();

//router.get('/companies', getAllCompanies());

module.exports = router;
