const { Router } = require('express')
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  delCompany,
  //updateCompany,
} = require('../handlers/companies.handlers')
const checkAuth = require('../middleware/check-auth')

const router = Router()

router.get('/companies', getAllCompanies)
router.get('/companies/:id', getCompanyById)
router.post('/sign-up-company', createCompany)
router.delete('/companies/:id', delCompany)
//router.put('/companies/:id', updateCompany)

module.exports = router
