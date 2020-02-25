const { Router } = require('express');
const { getAllCompanies , getCompanyById , postCompany} = require('../handlers/companies.handlers');

const router = Router();

router.get('/companies', getAllCompanies);
router.post('/sign-up-company', postCompany);

module.exports = router;
