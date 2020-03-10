const { Router } = require('express')

const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  delCompany,
  updateCompany,
} = require('../handlers/companies.handlers')
const checkAuth = require('../middleware/check-auth.middleware')

const router = Router()

router.get('/companies', checkAuth, getAllCompanies)
router.get('/companies/:id', checkAuth, getCompanyById)
router.post('/company', checkAuth, createCompany)
router.delete('/companies/:id', checkAuth, delCompany)
router.put('/companies/:id', checkAuth, updateCompany)

module.exports = router
