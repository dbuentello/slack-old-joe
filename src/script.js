

const json2html = require('node-json2html');
const report = require('./report/temp.json');

const transforms = {
  '<>': 'h1', 'text': '${name}\n', 'html':function() {
    return json2html.transform(
      this.results,
      transforms.child
      )},
    'child':{'<>':'li', 'style': 'font-size:16px' ,'html':'${name} Passed: ${ok}'}
  }

const fs = require('fs');
var result = '';
var html = json2html.transform(report, transforms);
fs.writeFileSync('./src/reporttest-result.html', html);
