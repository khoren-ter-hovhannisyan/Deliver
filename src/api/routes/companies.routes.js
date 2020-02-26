const { Router } = require('express');
const { getAllCompanies ,loginCompany, getCompanyById , createCompany} = require('../handlers/companies.handlers');

const router = Router();

router.get('/companies', getAllCompanies);
router.post('/sign-up-company', createCompany);
router.post('/login-company',loginCompany)

module.exports = router;
