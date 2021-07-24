const issueParser = require('issue-parser');
const ip = issueParser('github', { actions: { blocks: ['blocks'], blocked: ['blocked by'] }});
const _ = require('lodash');


const jsLog = (obj) => (JSON.stringify(obj, null, 2) );
function _no_empty (ch) { return ch  !== ''; };
function _linerizer (body) { return body.replace(/[\r\t]/g, ' ').split(/\n/).map((line) => line.trim()).filter(_no_empty) };

function _flatten_sort(arr) {
  const flat_sort = arr.flat().sort((l, r) =>  l.issue_number - r.issue_number);
  return _.sortedUniqBy(flat_sort, function (o) { return o.issue_number });
}




function _parse_all_blocked_by(line) {
  const blocked_by = ip(line).actions.blocked;
  //console.log(`line: ${jsLog(line)}`);
  //console.log(`blocked_by: ${jsLog(blocked_by)}`);
  if (blocked_by.length <= 0) {
    return [];
  }
  const blockers = blocked_by.map((block) => {
    if(block['slug']) {
      const [ owner, repo ] = block['slug'].split('/');
      return {
        owner,
        repo,
        issue_number: parseInt(block.issue, 10),
      };
    }
    return {
      owner: '',
      repo: '',
      issue_number: parseInt(block.issue, 10),
    }
  });
  return blockers;
}

function parse(body) {
  const lines = _linerizer(body);
  return _flatten_sort(lines.map(_parse_all_blocked_by));
}


module.exports = {
  parse,
  _parse_all_blocked_by,
}


