const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const issueParser = require('issue-parser');
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);


async function run() {
  try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = github.context.payload;
    console.log(`context: ${JSON.stringify(context, null, 2)}`);
    //console.log(`repo info: ${JSON.stringify(payload.repository, null, 2)}`);

    //octokit.paginate(
    const issues = await octokit.issues.listForRepo({
      state: 'open',
      owner:  context.repo.owner,
      repo:   context.repo.repo,
    });  
    console.log(`issues: ${JSON.stringify(issues, null, 2)}`);
    //core.setOutput("time", time);
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
