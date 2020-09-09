const issueParser = require('issue-parser'); 
const parse = issueParser('github', { actions: { blocks: ['blocks'], blocked: [ 'blocked by' ] }});
const _ = require('lodash');
const core = require('@actions/core');




const DEBUG = true; //core.isDebug();
const debug = core.debug;

const jsLog = (obj) => (JSON.stringify(obj, null, 2) );
const toInt = (str) => { return parseInt(str, 10)}





// STEP 2.
function PreFilteredIssues(issues, THIS_ID) {
  const hasValidBody = (issue) => (issue.body !== '' && issue.body.includes(THIS_ID)); 
  const isNotThisIssues = (issue) => toInt(issue.number) !== THIS_ID;
  const hasAllowedCollaboratorTypes = (issue) =>
    ([ 'COLLABORATOR', 'CONTRIBUTOR', 'MEMBER', 'OWNER' ]
      .includes(issue.author_association));

  return issues
    .filter(hasValidBody)
    .filter(isNotThisIssues)
    .filter(hasAllowedCollaboratorTypes)
    .map((issue) => ({ 
      ...issue,
      body: parse(issue.body), // STEP 3.
    }))
}




//TODO: after moving to typescript, use Pick<T,K> instead
// or maybe json -> typescript:interface?
//STEP 1.
const IssueFields = [
  'author_association',
  'body',
  'id',
  'number',
  'repository_url',
  'state',
  'title',
  //'user',
  //TODO:  we don't need all the user subkeys, this should work :( 
  // 'user.avatar_url',
  // 'user.gravatar_id',
  // 'user.id',
  // 'user.login',
  // 'user.repos_url',
  // 'user.type',
  // 'user.url',
  // user.node_id
];




function SingleResponseData({ status, value }) {
  console.log(`SingleResponseData: ${jsLog(value)}`);
  return {
    ..._.pick(value.data, IssueFields),
    status: value.status,
    ghApiResponseStatus: status,  
  };
}




function FailResponseData({ status, reason }) {
  return {
    status,
    reason: _.pick(reason, [ 'status', 'name', 'request', ]),
  };
}




function MultiResponseData(response) {
  return response.data.map(SingleResponseData);
}




function FilterMultiIssueResponse(allResponses) {
  const [ rejected, accepted ] = _.partition(allResponses.flat(), [ 'status', 'rejected' ]);
  return [ accepted.map(SingleResponseData), rejected.map(FailResponseData) ];
}




/**
 * STEPS:
 * 1. Only pull desired params from ResponseObject
 * 2. Filter issues that don't meet pre-conditions
 * 3. Run issue body through issue-parser
 * 4. filter out issues where issue.body.blockers !== THIS_ID 
**/
function validate(response, THIS_ID) {

  const doesBlockThisIssue = ((issue) => {
    //step 4 
    if (DEBUG) { 
      console.log(`issue: ${jsLog(issue)}`);
      debug(`debug|issue: ${jsLog(issue)}`);
    }
    const blockers = issue.body.actions.blocks;
    return blockers.reduce((arr, curr) => {
      if (DEBUG) { 
        console.log(`THIS: ${THIS_ID} | block-curr :${jsLog(curr)}`)
        debug(`THIS: ${THIS_ID} | block-curr :${jsLog(curr)}`);
      }
      return (toInt(curr.issue) === THIS_ID) ? arr.concat(curr) : arr
    }, []);
  });
  const issues = PreFilteredIssues(MultiResponseData(response), THIS_ID);
  return issues.filter(doesBlockThisIssue);
}

module.exports = { SingleResponseData, MultiResponseData, FailResponseData, FilterMultiIssueResponse, validate}; 

