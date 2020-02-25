const { Router } = require('express');
const { getAllCompanies , getCompanyById , createCompany} = require('../handlers/companies.handlers');

const router = Router();

router.get('/companies', getAllCompanies);
router.post('/sign-up-company', createCompany);

module.exports = router;
