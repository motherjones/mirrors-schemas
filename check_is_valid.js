#!/usr/bin/env nodejs

var path = require('path');
var argv = require('yargs').argv;
var schemas = require('./schemas'); 

var tv4s = schemas.tv4s;
var json = require(path.resolve(process.cwd(), argv._[1]));
console.log(tv4s.validateMultiple(json, argv._[0], true));
