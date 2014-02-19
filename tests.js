var _ = require('lodash');
var tv4 = require('tv4');
var schemas = require('./schemas');

// Tests for schemas
var component = {
    'slug': 'component',
    'content_type': 'component',
    'schema_name': 'component',
    'metadata': {}
}
component.test = component;
component.test_list = [component, component];
console.log(tv4.validateMultiple(component, schemas.componentSchema, true));
console.log(tv4.validateMultiple(component, schemas.authorSchema, true));
var image = _.merge({}, component, {
    'content_type': 'image/png',
})
var author = _.merge({}, component, {
    'slug': 'kevin-drum',
    'metadata': {
        'first_name': 'test',
        'last_name': 'test',
        'short_bio': 'test',
        'email': 'test',
        'twitter_user': 'test' ,
        'end_of_article_bio': 'test'
    },
    'photograph': image
});
console.log(tv4.validateMultiple(author, schemas.authorSchema, true));
console.log(tv4.validateMultiple(image, schemas.imageSchema, true));
var canon_image = _.merge({}, image, {
    'metadata': {
        'alt_txt': 'alt',
        'license': 'CC',
        'attribution': 'test',
    },
    'byline': [
        author
    ]
});
console.log(tv4.validateMultiple(canon_image, schemas.canonImageSchema, true));
var article = _.merge({}, component, {
    'content_type': 'text/x-markdown',
    'metadata': {
        'title': 'Test',
        'description': 'dek'
    },
    'byline': [author], //maybe make just author optional for 1
    'master_image': canon_image
});
console.log(tv4.validateMultiple(article, schemas.articleSchema, true));