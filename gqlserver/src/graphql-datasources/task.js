const { BaseDS } = require('./base')

class TaskDS extends BaseDS {
    constructor(taskOpts) {
        super(taskOpts)
    }

    async getByEmpId(empId, params={}) {
        console.log("employee Id here is", empId)
        console.log("PAramaters are", params);
        var cacheKey = params ? JSON.stringify(params) : 'noparams'
        cacheKey = `employee:${this.cacheKeyBase}:${cacheKey}`
        console.log("CacheKey value in task", cacheKey)

        const cacheDoc = await this.cache.get(cacheKey)
        if (cacheDoc) {
            console.log("cahe here is", cacheDoc)
            return JSON.parse(cacheDoc);
        }

        const doc = await this.service.get({
            ...params,
            "employee.id": empId
        })

        console.log("doc values in tasks  are", doc);

        this.cache.set(cacheKey, JSON.stringify(doc), { ttl: 3 })

        return doc;
    }
    async getByDeptId(deptId, params={}) {
        console.log("Department Id here is", deptId)
        var cacheKey = params ? JSON.stringify(params) : 'noparams'
        cacheKey = `department:${this.cacheKeyBase}:${cacheKey}`

        const cacheDoc = await this.cache.get(cacheKey)
        if (cacheDoc) {
            console.log("CacheDoc  here is", cacheDoc)
            return JSON.parse(cacheDoc);
        }

        const doc = await this.service.get({
            ...params,
            "department.id": deptId
        })

        this.cache.set(cacheKey, JSON.stringify(doc), { ttl: 3 })

        return doc;
    }
}

exports.TaskDS = TaskDS;
