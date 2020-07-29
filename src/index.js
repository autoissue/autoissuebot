const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);
const validate = require('./validate');

const THIS_ID = parseInt(context.payload.issue.number, 10);
console.log(`THIS_ID: ${THIS_ID}`);





function postComment(context, blockers) {
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
    //default: per_page: 30,
    per_page: 1, //for debug only
  };
  return octokit.paginate.iterator(octokit.issues.listForRepo, parameters);
}



const jsLog = (obj) => (JSON.stringify(obj, null, 2) );

async function run() {
  try {
    if (!repoToken) { 
      core.setFailed('repo-token was not set');
      process.exit(-1);
    }


    var allBlockers = Array();
    for await (const response of getNextPage(context)) {
      const blockers = validate(response, THIS_ID);
      console.log(`run-blockers: ${jsLog(blockers)}`);
      allBlockers = allBlockers.concat(blockers); 
    }

    console.log(`all blockers: ${jsLog(allBlockers)}`);
    if(allBlockers.length) {
      allBlockers.sort((l, r) => l.number - r.number );
      const comment = postComment(context, allBlockers);
      core.setOutput('blocking_issues', comment);
      return;
    }
    core.setOutput('blocking_issues', 'No blocking issues, this issue is now permanently closed');
    console.log('No blocking issues, this issue is now permanently closed');
  } catch (error) {
    core.setFailed(error.message);
    console.log(`error: ${jsLog(error)}`);
    process.exit(-1);
  }
}

run();
