
const {BaseDS} = require('./base');
const {TaskDS} = require('./task');
const {NewTaskDS} = require('./newtask');
const {DepartmentDS} = require('./department');
const Strapi = require('lib/strapi')

module.exports = () => {
  return {
    employees: new BaseDS({
      service: new Strapi('employees'),
      cacheKeyBase: "employees"
    }),
    tasks: new TaskDS({
      service: new Strapi('tasks'),
      cacheKeyBase: "tasks"
    }),
    newtasks: new NewTaskDS({
      service: new Strapi('tasks'),
      cacheKeyBase: "newtasks"
    }),
    departments: new DepartmentDS({
      service: new Strapi('departments'),
      cacheKeyBase: "departments"
    }),
  }
}
