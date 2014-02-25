#!/usr/bin/env nodejs

var path = require('path');
var argv = require('yargs')
    .usage('Validate a payload\'s schema\nUsage: $0 <schema name> <path to payload>')
    .argv;
var schemas = require('./schemas'); 
var exec = require('child_process').exec, child;

var tv4s = schemas.tv4s;
var schema_type = argv._[0];
var json_path = path.resolve(process.cwd(), argv._[1]);

child = exec('cat ' + json_path + ' | json_pp', function (err, stdout, stderr) {
    if ( err !== null ) {
	console.error(err.Error);
    } else {
	var json = require(json_path);
	console.log(tv4s.validateMultiple(json, schema_type, true));
    }
});


