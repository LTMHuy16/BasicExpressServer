const express = require("express");
const router = express.Router();
const path = require("path");
const { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee } = require("../../controllers/employeeController");
const { verifyRoles } = require("../../middleware/verifyRole");
const { admin, user, editor } = require("../../config/roleList");

router
    .route("/")
    .get(getAllEmployees)
    .post(verifyRoles(admin, editor), createNewEmployee)
    .put(verifyRoles(admin, editor), updateEmployee)
    .delete(verifyRoles(admin), deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
