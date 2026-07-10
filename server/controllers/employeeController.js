const employeeService = require('../services/employeeService');

const getAllEmployees = (req, res) => {
  try {
    const employees = employeeService.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEmployees,
};