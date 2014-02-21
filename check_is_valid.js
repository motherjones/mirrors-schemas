#!/usr/bin/env nodejs

var path = require('path');
var argv = require('yargs').argv;
var schemas = require('./schemas'); 

var tv4s = schemas.tv4s;
console.log(argv._);
var json = require(path.resolve(process.cwd(), argv._[0]));
console.log(tv4s.validateMultiple(json, schemas.articleSchema, true));
