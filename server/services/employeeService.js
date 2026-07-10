const { employees } = require('../data/mock');

const getAllEmployees = () => {
    return employees;
};

const getEmployeeById = (id) => {
    return employees.find(emp => emp.id === id);
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
};