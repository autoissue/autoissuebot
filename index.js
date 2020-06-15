const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const issueParser = require('issue-parser');
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);


/*
const issueComments = octokit.issues.listComments({
  owner, repo, issue_number
});
*/
async function run() {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = github.context.payload;
    //console.log(`The event payload: ${JSON.stringify(payload, null, 2)}`);

    //octokit.paginate(
    const issues = octokit.issues.listForRepo({
      state: 'open',
      owner:  github.context.payload.repository.owner.id,
      repo:   github.context.payload.repository.full_name,
    });  
    console.log(`issues: ${JSON.stringify(issues, null, 2)}`);

    //core.setOutput("time", time);
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
