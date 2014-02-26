var _ = require('lodash');
var schemas = require('./schemas');

var tv4s = schemas.tv4s;

// Tests for schemas
var component = {
    'uri': 'uri',
    'slug': 'component',
    'content_type': 'component',
    'schema_name': 'component',
    'metadata': {}
}
component.test = component;
component.test_list = [component, component];

exports.testComponentIsComponent = function(test) {
    test.expect(1);
    test.equal(tv4s.validateMultiple(component, schemas.componentSchema, true).errors.length, 0);
    test.done();
};
exports.testComponentIsNotAuthor = function(test) {
    test.expect(1);
    test.notEqual(tv4s.validateMultiple(component, schemas.authorSchema, true).errors.length, 0);
    test.done();
};
var image = _.merge({}, component, {
    'content_type': 'image/png',
    'uri': 'image/png'
});

var bad_content_type_image = _.merge({}, component, {
    'content_type': 'image_/png',
    'uri': 'image/png'
});

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
exports.testAuthorIsAuthor = function(test) {
    test.expect(1);
    test.equal(tv4s.validateMultiple(author, schemas.authorSchema, true).errors.length, 0);
    test.done();
};

exports.testImageIsImage = function(test) {
    test.expect(1);
    var valid = tv4s.validateMultiple(image, schemas.imageSchema, true);
    test.equal(valid.errors.length, 0, JSON.stringify(valid));
    test.done();
};

exports.testBadContentTypeImageFails = function(test) {
    test.expect(1);
    var valid = tv4s.validateMultiple(bad_content_type_image, schemas.imageSchema, true);
    test.equal(valid.errors.length, 1, JSON.stringify(valid));
    test.done();
};

var canon_image = _.merge({}, image, {
    'metadata': {
        'alt_text': 'alt',
        'license': 'CC',
        'attribution': 'test',
    },
    'byline': [
        author
    ]
});
exports.testCanonImageIsCanonImage = function(test) {
    test.expect(1);
    test.equal(tv4s.validateMultiple(canon_image, schemas.canonImageSchema, true).errors.length, 0);
    test.done();
};

exports.testCanonImageIsImage = function(test) {
    test.expect(1);
    test.equal(tv4s.validateMultiple(canon_image, schemas.imageSchema, true).errors.length, 0);
    test.done();
};

exports.testImageIsNotCanonImage = function(test) {
    test.expect(1);
    test.notEqual(tv4s.validateMultiple(image, schemas.canonImageSchema, true).errors.length, 0);
    test.done();
};



var article = _.merge({}, component, {
    'content_type': 'text/x-markdown',
    'metadata': {
        'title': 'Test',
        'description': 'dek'
    },
    'byline': [author], //maybe make just author optional for 1
    'master_image': canon_image
});
exports.testArticleIsArticle = function(test) {
    test.expect(1);
    test.equal(tv4s.validateMultiple(article, schemas.articleSchema, true).errors.length, 0);
    test.done();
};

var component_queue = _.merge({}, component, {
    'content_type': 'none',
    'uri': 'blah',
    'data_uri':  'blah',
    'members': [
	_.cloneDeep(image),
	_.cloneDeep(article),
	_.cloneDeep(canon_image)
    ]
});

exports.testComponentQueueIsComponentQueue = function(test) {
    test.expect(1);
    test.equal(tv4s.validateMultiple(component_queue, schemas.componentQueueSchema, true).errors.length, 0);
    test.done();
};
