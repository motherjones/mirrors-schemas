var _ = require('lodash');
var tv4 = require('tv4');

var stringSchema = {
    'id': 'stringSchema',
    'type': 'string'
};

var slugSchema = {
    'id': 'slugSchema',
    'type': 'string'
};

var uriSchema = {
    'id': 'uriSchema',
    'type': 'string'
};

var emailSchema = {
    'id': 'emailSchema',
    'type': 'string'
};

var componentSchema = {
    'id': 'component',
    'title': 'base component schema',
    'type': 'object',
    'required': ['metadata', 'slug', 'content_type', 'schema_name', 'uri'],
    'properties': {
	    'uri': stringSchema,
	    'data_uri': stringSchema,
        'slug': slugSchema,
        'content_type': _.clone(stringSchema),
        'schema_name': stringSchema, 
        'metadata': {
            'type': 'object',
            'properties': [],
            'required': [],
        },
    },
    'additionalProperties': {
        'anyOf': [{'$ref': 'component'}, {
            'type': 'array',
            'items': {
                '$ref': 'component'
            }
        }]
    }
};
componentSchema.extend = function(schema) {
    return _.merge({}, this, schema, function(a, b) {
          return _.isArray(a) ? a.concat(b) : undefined;
    });
};

console.log(componentSchema);
var imageSchema = componentSchema.extend({
    'id': 'image',
    'title': 'base image schema', 
    'properties': {
        'content_type': {
            'type': 'string',
            'pattern': 'image/png|image/gif|image/jpeg'
        },
        'metadata': {
            'properties': {
                'alt_text': stringSchema,
                'caption': stringSchema,
                'license': ['MIT', 'GPL', 'CC', 'PD', '??'],
                'attribution': stringSchema //require if no byline on canonImage
            }
        }
    }
});
console.log(imageSchema);
console.log(stringSchema);
var canonImageSchema = imageSchema.extend({
   'id': 'canonImage',
   'title': 'canon images Schema',
    'properties': {
        'metadata': {
            'required': ['alt_text', 'attribution', 'license']
        },
        'byline': {
            'type': 'array',
            'items': { '$ref': 'author' }
        }
    }
})

var authorSchema = _.merge({}, componentSchema, {
    'id': 'author',
    'title': 'authors schema',
    'photograph': { '$ref': 'image' }
});

authorSchema.properties.metadata.required = [
    'first_name', 'last_name', 'short_bio', 'email', 'end_of_article_bio'];
authorSchema.properties.metadata.properties = {
    'first_name': stringSchema,
    'last_name': stringSchema,
    'short_bio': stringSchema,
    'email': emailSchema,
    'twitter_user': stringSchema,
    'end_of_article_bio': stringSchema
};

articleSchema = _.merge({}, componentSchema, {
    'id': 'article',
    'title': 'article Schema',
    'properties': {
        'content_type': ['text/x-markdown'], //?include html or make legacy class
        'master_image': { '$ref': 'canonImage'},
        'byline': {
            'type': 'array',
            'items': { '$ref': 'author' }
        },
        'metadata': {
            'properties': {
                'title': stringSchema,
                'description': stringSchema
            }
        },
	'photos': {
	    'type': 'array',
	    'items': { '$ref': 'canonImage'},
	}
    }
});
articleSchema.required.push('master_image', 'byline');

var componentQueueSchema = _.merge({}, componentSchema, {
    'id': 'componentQueue',
    'title': 'component queue schema',
    'properties': {
	'content_type': ['none'],
    }
});
componentQueueSchema.required.push('members');

var tv4s = tv4.freshApi();
tv4s.addSchema(componentSchema);
tv4s.addSchema(imageSchema);
tv4s.addSchema(authorSchema);
tv4s.addSchema(canonImageSchema);
tv4s.addSchema(articleSchema);
tv4s.addSchema(componentQueueSchema);

exports.tv4s = tv4s;

exports.stringSchema = stringSchema;
exports.slugSchema = slugSchema; 
exports.uriSchema = uriSchema;
exports.emailSchema = emailSchema;

exports.componentSchema = componentSchema;
exports.imageSchema = imageSchema;
exports.canonImageSchema = canonImageSchema;
exports.authorSchema = authorSchema;
exports.articleSchema = articleSchema;
exports.componentQueueSchema = componentQueueSchema;
