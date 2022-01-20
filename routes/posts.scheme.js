var Joi = require('joi');

module.exports.postSchema = Joi.object({
    name:        Joi.string().max(30).required()
                    .messages({'string.max': `"name" should have a length less than 30`,}),
                    
    description: Joi.string().max(30).required()
                    .messages({'string.max': `"description" should have a length less than 30`,})
  });

module.exports.idScheme = Joi.number().integer();