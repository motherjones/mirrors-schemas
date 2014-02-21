#!/usr/bin/env nodejs

var argv = require('yargs').argv;
var schemas = require('./schemas'); 

var tv4s = schemas.tv4s;
console.log(argv._);
var json = require(argv._[0]);
console.log(tv4s.validateMultiple(json, schemas.articleSchema, true));
