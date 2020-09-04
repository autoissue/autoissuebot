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



const parse = require('./bodyParser');
const gh = require('./ghIssueService');
const validate = require('./validate');
const outputKey = 'blockers';
const jsLog = (obj) => (JSON.stringify(obj, null, 2) );

const THIS_ISSUE = parseInt(context.payload.issue.number, 10);
debug(`THIS_ISSUE: ${THIS_ISSUE}`);



function getNextPage (octokit, { owner, repo}) {
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
  const parsed = parse.parse(this_body);
  const blockers = gh.getAllBlockerIssues(parsed);
  blockers.then(console.log); 
  console.log(`blocked: ${jsLog(blocker)}`);
  if (blockers.length == 0 ) {
    core.setOutput(outputKey, 'No blocking issues, this issue is now permanently closed');
    return;
  }
  //ok, cool
  console.log(`get status of blocker issues`)



  //then postComment

  const comment = gh.postComment(this_issue, octokit, context, allBlockers);
  core.setOutput(outputKey, comment);

}




async function run_blocks(github, this_issue) {
  const context = github.context;
  try {
    var allBlockers = Array();
    for await (const response of getNextPage(octokit, context)) {
      const blockers = validate(response, this_issue);
      allBlockers = allBlockers.concat(blockers); 
    }

    if(allBlockers.length) {
      allBlockers.sort((l, r) => l.number - r.number );
      const comment = gh.postComment(this_issue, octokit, context, allBlockers);
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


