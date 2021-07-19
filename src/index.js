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



const { parse }= require('./bodyParser');
const gh = require('./ghIssueService');
const { SingleResponseData, FilterMultiIssueResponse, validate } = require('./validate');
const outputKey = 'blockers';
const jsLog = (obj) => (JSON.stringify(obj, null, 2) );

const THIS_ISSUE = parseInt(context.payload.issue.number, 10);
debug(`THIS_ISSUE: ${THIS_ISSUE}`);



function getNextPage (octokit, {owner, repo}) {
  const parameters = {
    state: 'open',
    owner,
    repo,
    per_page: perPage,
  };
  return octokit.paginate.iterator(octokit.issues.listForRepo, parameters);
}




async function run_blocked_by(github, this_issue) {
  const this_body = github.context.payload.issue.body;
  const parsed = parse(this_body);
  const context = github.context;
  const results = await gh.getAllBlockerIssues(octokit, context, parsed);

  const [ fulfilled, rejected ] = FilterMultiIssueResponse(results);

  if (rejected.length > 0) {
    const reasons = rejected.map((reqStatus, reason) => {
      return { reqStatus, name } = reason;
    });
    core.debug(`unable to get status on a few issues: ${jsLog(rejected)}`);
  }

  const openBlockers = _checkOpenBlockers(fulfilled);
  if (openBlockers.length <= 0 ) {
    core.setOutput(outputKey, 'No blocking issues, this issue is now permanently closed');
  }

  const comment = gh.postComment(octokit, openBlockers, this_issue, github.context.repo.owner, github.context.repo.repo );
  core.setOutput(outputKey, comment);
  console.log(`fulfilled: ${jsLog(fulfilled)}`);
}



function _checkOpenBlockers(fulfilled) {
  const openBlockers  = fulfilled.filter((blocker) => blocker.state === 'open');
  if ( fulfilled.length <= 0 || openBlockers.length <= 0 ) {
    return [];
  }
  return openBlockers.sort((l, r) => l.number - r.number)
}

async function run_blocks(github, this_issue) {
  const context = github.context;
  try {
    var openBlockers = Array();
    for await (const response of getNextPage(octokit, context)) {
      const blockers = validate(response, this_issue);
      openBlockers = openBlockers.concat(blockers);
    }

    if(openBlockers.length) {
      openBlockers = openBlockers.sort((l, r) => l.number - r.number );
      const comment = gh.postComment( octokit, openBlockers, this_issue, ...context);
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
  run_blocked_by(github, THIS_ISSUE);
} else {
  run_blocks(github, THIS_ISSUE);
}

/*
 github = require('../tests/github.object.json');
 this_body = this_issue_body(github);
 */


body = "blocked by #22, blocked by: #23, blocked by #24 \r\n\tblocked by #25, blocked by: #26, blocked by #27 \r\nblocked by #28, BLOCKED BY #29 \r\n";



