const core = require('@actions/core');
const github = require('@actions/github');
const issueParser = require('issue-parser');



const context = github.context;
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);

const thisId = context.payload.issue.number;

if ( !repoToken) { 
  core.setFailed('repo-token was not set');
}

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
    console.log(`thisId: ${thisId}`);
    console.log(`allIssues : ${JSON.stringify(allIssues, null, 2)}`);
    const blockers = allIssues
    //filter out self
      .filter((issue) => { return issue.number !== thisId; })
      .filter((issue) => {
      console.log(`issue body: ${issue.body}`);
      const parsedBody = parse(issue.body.toLowerCase());
      console.log(`parsed body: ${JSON.stringify(parsedBody, null, 2)}`);
      return parsedBody.actions.blocks && parsedBody.actions.blocks[0].issue !== thisId; 
    }); 
    console.log(`blockers: ${JSON.stringify(blockers, null, 2)}`);
    if(blockers.length == 0) {
      core.setOutput('blocking_issues', 'No blocking issues, this issue is now permanently closed');
      return;
    }

    const blocker_str = blockers.map((blocker) => { return `#${blocker.number}` })
    octokit.issues.update({
      owner:  context.repo.owner,
      repo:   context.repo.repo,
      issue_number:  thisId,
      state: 'open',
    });
    octokit.issues.createComment({
      owner:  context.repo.owner,
      repo:   context.repo.repo,
      issue_number:  thisId,
      body: `This issue cannot be closed at this time, it is dependent on the following issue(s): ${blocker_str}`,
    });
    core.setOutput('blocking_issues', blocker_str);
  } catch (error) {
    core.setFailed(error.message);
  }

}

run();
