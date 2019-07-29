

const json2html = require('node-json2html');
const report = require('./report/temp.json');
// const transform = {'<>':'li', 'html':[
//   {'<>':'span', 'html':'${name} results:${results}'}
// ]}

// const t = {
//   'testSuite': {'<>': 'div', 'name': '${name}', 'html':function() {
//     return $.transform(
//       this.results,
//       transforms.child
//       )}
//   },
//   'child':{'<>':'span','html':'${name}'}
// };

const transforms = {
  '<>': 'h1', 'text': '${name}\n', 'html':function() {
    return json2html.transform(
      this.results,
      transforms.child
      )},
    'child':{'<>':'li', 'style': 'font-size:16px' ,'html':'${name} Passed: ${ok}'}
  }

const fs = require('fs');
console.log('report: ', report[0]);
var result = '';
var html = json2html.transform(report, transforms);
console.log('html: ', html);
fs.writeFileSync('./report/test-result.html', html);
