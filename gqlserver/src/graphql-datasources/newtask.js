const { DataSource } = require("apollo-datasource")
const DataLoader = require("dataloader")

class NewTaskDS extends DataSource {
    constructor({service,cacheKeyBase}) {
        super();
        this.cacheKeyBase = cacheKeyBase;
        this.service = service;
        this.loader = new DataLoader(ids => new Promise(async (resolve,reject) => {
            let results = await service.getByIds(ids)
            return resolve(
                ids.map((id) => results.find(r => r.id == id))
            )
        }))
    }

    initialize({ context, cache } = {}) {
        this.context = context;
        this.cache = cache;
    }
    //didEncounterError(error) { ...  }
    cacheKey(id) {
        return `${this.cacheKeyBase}:${id}`;
    }

    async get(params) {
        var cacheKey = params ? JSON.stringify(params) : 'noparams'
        cacheKey = `${this.cacheKeyBase}:${cacheKey}`

        const cacheDoc = await this.cache.get(cacheKey)
        if (cacheDoc) {
            return JSON.parse(cacheDoc);
        }

        const doc = await this.service.get(params)
        this.cache.set(cacheKey, JSON.stringify(doc), { ttl: 3 })

        return doc;
    }

    async getById(id, { ttlInSeconds } = {ttlInSeconds:3600}) {
        if(!id || id == 0)
            return null;

        const cacheDoc = await this.cache.get(this.cacheKey(id))
        if (cacheDoc) {
            return JSON.parse(cacheDoc);
        }

        const doc = await this.loader.load(id);
        if (ttlInSeconds) {
            this.cache.set(this.cacheKey(id), JSON.stringify(doc), { ttl: ttlInSeconds })
        }

        return doc;
    }

    async set(data, { ttlInSeconds } = {ttlInSeconds:3600}) {
        var doc = {}

        if (data.id) {
            doc = await this.service.patch(data)
        }
        else {
            doc = await this.service.set(data)
        }

        if (! doc.err && ttlInSeconds) {
            this.cache.set(this.cacheKey(doc.id), JSON.stringify(doc), { ttl: ttlInSeconds })
        }

        return doc
    }

    async del(id,params) {
        var doc = await this.service.del(id,params)

        return doc;
    }

    async getByEmpId(empId, params={}) {
        console.log("employee Id in new task is", empId)
        console.log("Paramaters in new task are", params);
        var cacheKey = params ? JSON.stringify(params) : 'noparams'
        cacheKey = `employee:${this.cacheKeyBase}:${cacheKey}`
        console.log("CacheKey value in dept", cacheKey)

        const cacheDoc = await this.cache.get(cacheKey)
        if (cacheDoc) {
            console.log('CachecDoc', cacheDoc)
            return JSON.parse(cacheDoc);
        }
        console.log("Params value", params)

        const doc = await this.service.get({
            ...params,
            "employee.id": empId
        })

        console.log("doc values in dept", doc);

        this.cache.set(cacheKey, JSON.stringify(doc), { ttl: 3 })

        return doc;
    }

    async getByDeptId(deptId, params={}) {
        console.log("department Id in new task is", deptId)
        console.log("Paramaters in new task are", params);
        var cacheKey = params ? JSON.stringify(params) : 'noparams'
        cacheKey = `department:${this.cacheKeyBase}:${cacheKey}`
        console.log("CacheKey value in dept", cacheKey)

        const cacheDoc = await this.cache.get(cacheKey)
        if (cacheDoc) {
            console.log('CachecDoc', cacheDoc)
            return JSON.parse(cacheDoc);
        }
        console.log("Params value", params)

        const doc = await this.service.get({
            ...params,
            "department.id": deptId
        })

        console.log("doc values in new task", doc);

        this.cache.set(cacheKey, JSON.stringify(doc), { ttl: 3 })

        return doc;
    }
}

exports.NewTaskDS = NewTaskDS;
