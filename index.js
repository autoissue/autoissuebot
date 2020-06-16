const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const issueParser = require('issue-parser');
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);

async function getAllIssues() {
  return await octokit.paginate(
    octokit.issues.listForRepo, {
      state: 'open',
      owner:  context.repo.owner,
      repo:   context.repo.repo,
    });
}

async function run() {
  try {
    const allIssues = await getAllIssues();
    const blockers = allIssues.filter((issue) => { //filter out self
      //console.log(`issuedata: ${JSON.stringify(issue, null, 2)}`);
      return issue.number !== context.payload.issue.number;
    }).filter((issue) => {
      console.log(`issue: ${JSON.stringify(issue, null, 2)}`);
      const parsedBody = parse(issue.body);
      console.log(`parsed body: ${JSON.stringify(parsedBody, null, 2)}`);
      return true;
    }); 
    console.log(`blockers: ${JSON.stringify(blockers, null, 2)}`);
    //core.setOutput("time", time);

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
