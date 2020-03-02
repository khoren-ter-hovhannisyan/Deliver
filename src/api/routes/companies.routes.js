const { Router } = require("express");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  delCompany
} = require("../handlers/companies.handlers");

const router = Router();

router.get("/companies", getAllCompanies);
router.get("/companies/:id", getCompanyById);
router.post("/sign-up-company", createCompany);
router.delete("/company/:id", delCompany);

module.exports = router;
