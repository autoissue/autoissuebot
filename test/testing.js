/*
const responses = require('./responses.json');

const _ = require('lodash');
const issueParser = require('issue-parser'); 
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const THIS_ID = 7;

response0 = responses[0]
response1 = responses[1]
response2 = responses[2]


validate = require('../src/validate');

var allBlockers = [];
//[9] blocks 7
b0 = validate(response0, THIS_ID)
//[8] blocks 7
b1 = validate(response1, THIS_ID)
// []
b2 = validate(response2, THIS_ID)
allBlockers.concat()
/*
 * SCENARIOS:
 * THIS_ID = 7
 * 'blocks #7'
 * 'blocks #2'
 * 'blocks #2, blocks #5'
 * 'blocks #2, blocks #7'
**/


/*blockingBody = { body: 'blocks #7'}
noBlock  = { body: 'blocks #2'}
multiBody  = { body: 'blocks #5, blocks #6'}
multiBodyBlocking  = { body: 'blocks #3, blocks #7'}


bb = xParse(blockingBody.body, THIS_ID);
mb = xParse(multiBody.body, THIS_ID);
mbb = xParse(multiBodyBlocking.body, THIS_ID);
nb = xParse(noBlock.body, THIS_ID);

*/




