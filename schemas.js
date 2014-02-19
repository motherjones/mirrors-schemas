var _ = require('lodash');
var tv4 = require('tv4');

var stringSchema = {
    'type': 'string'
};
var componentSchema = {
    'title': 'base component schema',
    'type': 'object',
    'required': ['metadata', 'slug', 'content_type', 'schema_name'],
    'properties': {
        'slug': stringSchema,
        'content_type': stringSchema,
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

var imageSchema = _.merge({}, componentSchema, {
    'title': 'base image schema',
});

imageSchema.properties.content_type = ['image/png', 'image/gif', 'image/jpeg'];
imageSchema.properties.metadata.required = [];
imageSchema.properties.metadata.properties = {
    'alt_txt': stringSchema,
    'caption': stringSchema,
    'license': ['MIT', 'GPL', 'CC', 'PD'],
    'attribution': stringSchema //require if no byline on canonImage
};

var canonImageSchema = _.clone(imageSchema, isDeep=true);
canonImageSchema.properties.metadata.required.push('alt_txt', 'attribution', 'license');
_.merge(canonImageSchema,{
    'title': 'canon images Schema',
    'properties': {
        'byline': {
            'type': 'array',
            'items': { '$ref': 'author' }
        }
    }
});

var authorSchema = _.merge({}, componentSchema, {
    'title': 'authors schema',
    'photograph': { '$ref': 'image' }
});
authorSchema.required.push('photograph');
authorSchema.properties.metadata.required = [
    'first_name', 'last_name', 'short_bio', 'email', 'end_of_article_bio'];
authorSchema.properties.metadata.properties = {
    'first_name': stringSchema,
    'last_name': stringSchema,
    'short_bio': stringSchema,
    'email': stringSchema,
    'twitter_user': stringSchema,
    'end_of_article_bio': stringSchema
};

articleSchema = _.merge({}, componentSchema, {
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
        }
    }
});
articleSchema.required.push('master_image', 'byline');
var tv4s = tv4.freshApi();
tv4s.addSchema('component', componentSchema);
tv4s.addSchema('image', imageSchema);
tv4s.addSchema('author', authorSchema);
tv4s.addSchema('canonImage', canonImageSchema);
tv4s.addSchema('article', articleSchema);

exports.tv4s = tv4s;
exports.stringSchema = stringSchema;
exports.componentSchema = componentSchema;
exports.imageSchema = imageSchema;
exports.canonImageSchema = canonImageSchema;
exports.authorSchema = authorSchema;
exports.articleSchema = articleSchema;
