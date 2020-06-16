const core = require('@actions/core');
const github = require('@actions/github');
const issueParser = require('issue-parser');



const context = github.context;
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);

const thisId = context.payload.issue.number;

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
      return issue.number !== thisId;
    }).some((issue) => {
      const parsedBody = parse(issue.body.toLowerCase());
      console.log(`parsed body: ${JSON.stringify(parsedBody, null, 2)}`);
      return parsedBody.actions.blocks && parsedBody.actions.blocks[0].issue === thisId; 
    }); 
    console.log(`blockers: ${JSON.stringify(blockers, null, 2)}`);
    if(blockers.length > 0) { 
      octokit.issues.update({
        owner:  context.repo.owner,
        repo:   context.repo.repo,
        issue_number:  thisId,
        state: 'open',
      })
    }
    //core.setOutput("time", time);

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
