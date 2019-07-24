// here we'll get the report as a string then the code that calls this funciton will write to file. 
import * as fs from 'fs-extra';

// fetches file 
const ojr = /** @type {OJ.Result} */ (require('../../lighthouse-core/test/results/sample_v2.json'));
