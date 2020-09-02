const issueParser = require('issue-parser'); 
const ip = issueParser('github', { actions: { blocks: ['blocks'], blocked: ['blocked by'] }});
const allSettled = require('promise.allsettled');
const _ = require('lodash');

const jsLog = (obj) => (JSON.stringify(obj, null, 2) );
function _no_empty (ch) { return ch  !== ''; };
function _linerizer (body) { return body.replace(/[\r\t]/g, ' ').split(/\n/).map((line) => line.trim()).filter(_no_empty) };
function parse(body) {
  const lines = _linerizer(body);
  return lines.map((line) => {
    const blocked_by = ip(line).actions.blocked; 
    //console.log(`blocked_by: ${jsLog(blocked_by)}`);
    if (blocked_by.length <= 0) {
      return [];
    }
    const blockers = blocked_by.map((block) => {
      if(block.slug) {
        const [ owner, repo ] = slug.split('/');
        return {
          owner,
          repo,
          issue_number: parseInt(block.issue, 10), 
        };
      }
      return {
        owner: undefined,
        repo: undefined,
        issue_number: parseInt(block.issue, 10), 
      }
    }) 
    return blockers;
  }).flat();
}





module.exports = parse;

 single_issue_body = 'blocked by: #31' 

