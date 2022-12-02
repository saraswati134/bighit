'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    getTasksById: async ctx => {
        // const id = ctx.params.id;
        const { taskId } = ctx.params;
       
        console.log('TaskId',taskId);
        const entity = await strapi.query('task').findOne({ id: taskId });
        console.log(entity)
      if(entity){
        return entity;
      }else {
        return "No data found";
      }
        
    },
    updatetaskbyId: async ctx => {
      let {taskId} = ctx.params;
      console.log('context params',taskId);
      const entity = await strapi.query('task').update({id : taskId} ,{ is_complete : true  });;
      return entity;
    },
    updateMultipleTask :async ctx => {
      let {fields} = ctx.request.body;
      console.log('fields', fields);
      const data=  await Promise.all(fields.map(async(ele) =>{
        const entity = await strapi.query('task').update({id : ele} ,{ is_complete : true  });;
        return entity;
      }))
      console.log("Data here is:", data)
      return data;
    
    },
};
