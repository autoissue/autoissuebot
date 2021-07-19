const allSettled = require('promise.allsettled');
const jsLog = (obj) => (JSON.stringify(obj, null, 2) );
const _ = require('lodash');

const { ResponseData, FailResponseData } = require('./validate');



function getIssue(octokit, { owner, repo, issue_number }) {
  return octokit.issues.get({
    owner,
    repo,
    issue_number
  });
}




/**
 *
 * @param octokit github.octokit object
 * @param context github.context object
 * @param {Object[]} issues Array of blocking issues
 * @param issues[].owner owner, if undefined = get from context
 * @param issues[].repo repo, if undefined = get from context
 * @param issues[].issue_number
 **/
function getAllBlockerIssues(octokit, context, issues) {
  //console.log(`issues: ${jsLog(issues)}`);
  return allSettled(issues.map((issue) => {
    return getIssue(octokit, {
      ...issue,
      ...{ owner: context.repo.owner,
          repo:  context.repo.repo,
      }
    })
  }));
}

//.then((results) => {

function postComment(octokit, blockers, issue, owner, repo) {
  //if (DEBUG) { debug(`postComment: ${blockers}`)}
  const blocker_str = blockers.map((blocker) => { return `#${blocker.number}` }).join(', ');
  const comment =`This issue cannot be closed at this time, it is dependent on the following issue(s): ${blocker_str}`;
  console.log(`comment: ${jsLog(comment)}`)
  octokit.issues.update({
    owner,
    repo,
    issue_number:  issue,
    state: 'open',
  });
  octokit.issues.createComment({
    owner,
    repo,
    issue_number:  issue,
    body: comment,
  });
  return comment;
}




module.exports = {
  getIssue,
  getAllBlockerIssues,
  postComment,
}
