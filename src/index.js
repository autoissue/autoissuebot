const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const DEBUG = true; //core.isDebug();
const debug = core.debug;
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);
const perPage = parseInt(core.getInput('per-page'));
const mode = core.getInput('mode');


if (!repoToken) { 
  core.setFailed('repo-token was not set');
  process.exit(-1);
}



const bodyParser = require('./bodyParser');
const gh = require('./ghIssueService');
const validate = require('./validate');
const outputKey = 'blockers';
const jsLog = (obj) => (JSON.stringify(obj, null, 2) );

const THIS_ISSUE = parseInt(context.payload.issue.number, 10);
debug(`THIS_ISSUE: ${THIS_ISSUE}`);



function getNextPage (octokit, context) {
  const parameters = {
    state: 'open',
    owner:  context.repo.owner,
    repo:   context.repo.repo,
    per_page: perPage, 
  };
  return octokit.paginate.iterator(octokit.issues.listForRepo, parameters);
}




async function run_blocks(github) {
  const context = github.context;
  try {
    var allBlockers = Array();
    for await (const response of getNextPage(octokit, context)) {
      const blockers = validate(response, THIS_ISSUE);
      allBlockers = allBlockers.concat(blockers); 
    }

    if(allBlockers.length) {
      allBlockers.sort((l, r) => l.number - r.number );
      const comment = gh.postComment(THIS_ISSUE, octokit, context, allBlockers);
      core.setOutput(outputKey, comment);
      return;
    }
    if (DEBUG) {
      debug('No blocking issues, this issue is now permanently closed');
    }
    core.setOutput(outputKey, 'No blocking issues, this issue is now permanently closed');
  } catch (error) {
    if (DEBUG) {
      debug(`error: ${jsLog(error)}`);
      console.log(`log:error: ${jsLog(error)}`)
    }
    core.setFailed(error.message);
    process.exit(-1);
  }
}

if (mode === 'blocked by') {
  run_blocked_by(github);
} else {
  run_blocks(github);
}

/*
 github = require('../tests/github.object.json');
 this_body = this_issue_body(github);
*/


/**
 *
 * @param octokit github.octokit object
 * @param {Object[]} issues Array of blocking issues
 * @param issues[].owner owner, undefined = get from context
 * @param issues[].repo repo, undefined = get from context
 * @param issues[].issue_number
 **/

function run_blocked_by(github) {
  const extract_issue_body = (github) => (github.context.payload.issue.body);
  this_body = extract_issue_body(github)
  parsed = bodyParser.parse(this_body);
  blockers = bodyParser.getAllBlockerIssues(parsed);
  
  console.log(`blocked: ${jsLog(blocker)}`);

}

