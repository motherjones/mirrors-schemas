#!/usr/bin/env nodejs

var path = require('path');
var argv = require('yargs')
    .usage('Validate a payload\'s schema\nUsage: $0 <schema name> <path to payload>')
    .argv;
var schemas = require('./schemas'); 

var tv4s = schemas.tv4s;
var schema_type = argv._[0];
var json_path = path.resolve(process.cwd(), argv._[1]);

var json = require(json_path);
console.log(tv4s.validateMultiple(json, argv._[0], true));
