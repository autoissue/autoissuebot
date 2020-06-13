const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;

/*
const issueComments = octokit.issues.listComments({
  owner, repo, issue_number
});
*/

try {
  const repoToken = core.getInput('repo-token');
  const octokit = github.getOctokit(repoToken);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, null, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}


