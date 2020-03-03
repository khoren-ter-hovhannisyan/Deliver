const { Router } = require("express");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  delCompany,
  updateCompany,
} = require("../handlers/companies.handlers");

const router = Router();

router.get("/companies", getAllCompanies);
router.get("/companies/:id", getCompanyById);
router.post("/sign-up-company", createCompany);
router.delete("/company/:id", delCompany);
router.put("/company/:id", updateCompany)

module.exports = router;
