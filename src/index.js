const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const DEBUG = core.isDebug();
const debug = core.debug;
const repoToken = core.getInput('repo-token');
const perPage = parseInt(core.getInput('per-page'));
const mode = core.getInput('mode');



if (!repoToken) { 
  core.setFailed('repo-token was not set');
  process.exit(-1);
}



const outputKey = 'blockers';
const jsLog = (obj) => (JSON.stringify(obj, null, 2) );

const THIS_ID = parseInt(context.payload.issue.number, 10);
debug(`THIS_ID: ${THIS_ID}`);





const octokit = github.getOctokit(repoToken);
const { validate_blocks, validate_blocked_by, blocked_by_issues } = require('./utils');




function postComment(context, blockers) {
  if (DEBUG) { debug(`postComment: ${blockers}`)}
  const blocker_str = blockers.map((blocker) => { return `#${blocker.number}` }).join(' ');
  const comment =`This issue cannot be closed at this time, it is dependent on the following issue(s): ${blocker_str}`;

  octokit.issues.update({
    owner:  context.repo.owner,
    repo:   context.repo.repo,
    issue_number:  THIS_ID,
    state: 'open',
  });
  octokit.issues.createComment({
    owner:  context.repo.owner,
    repo:   context.repo.repo,
    issue_number:  THIS_ID,
    body: comment,
  });
  return comment;
}




function getNextPage (context) {
  const parameters = {
    state: 'open',
    owner:  context.repo.owner,
    repo:   context.repo.repo,
    per_page: perPage, 
  };
  return octokit.paginate.iterator(octokit.issues.listForRepo, parameters);
}






async function run_blocked_by(context) {
  try {
    const blockers = blocked_by_issues(ocotokit, {
      owner:  context.repo.owner,
      repo: context.repo.repo,
      issue_number: THIS_ID,
    });

    ;
    for await (const reponse of getNextPage(context)) {
      const blockers = validate(response, THIS_ID);
      allBlockers = allBlockers.concat(blockers); 
    }
    if(allBlockers.length) {
      allBlockers.sort((l, r) => l.number - r.number );
      const comment = postComment(context, allBlockers);
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


async function run_blocks() {
  try {
    var allBlockers = Array();
    for await (const response of getNextPage(context)) {
      const blockers = validate_blocks(response, THIS_ID);
      allBlockers = allBlockers.concat(blockers); 
    }

    if(allBlockers.length) {
      allBlockers.sort((l, r) => l.number - r.number );
      const comment = postComment(context, allBlockers);
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
  run_blocked_by();
} else {
  run_blocks();
}
