
console.log('script.js.....');
const json2html = require('node-json2html');
const report = require('./report/temp.json');
const fs = require('fs');
const path = require('path');
console.log('getting template from: ', path.resolve(__dirname, './report/static/template.html'));
console.log('dirname:', __dirname);
var template = fs.readFileSync(path.resolve(__dirname, './report/static/template.html'), 'utf8');

const transforms = {
  '<>': 'h1', 'text': '${name}\n', 'html':function() {
    return json2html.transform(
      this.results,
      transforms.child
      )},
    'child':{'<>':'li', 'style': 'font-size:16px' ,'html':'${name} Passed: ${ok}'}
  }

console.log('making html....');
// var result = '';
var html = json2html.transform(report, transforms);
const result = template.replace('HTMLHERE', html);
console.log('__dirname: ', __dirname);
console.log('path resolve: ', path.resolve(__dirname, './report/static/template.html'));
fs.writeFileSync(path.resolve(__dirname, './report/static/test-result.html'), result);
console.log('done!');
