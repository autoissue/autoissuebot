const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);

if ( !repoToken) { 
  core.setFailed('repo-token was not set');
}





const parse = issueParser('github', { actions: { blocks: ['blocks'] }});



function toInt(str) {
  return parseInt(str, 10);
}

const THIS_ID = toInt(context.payload.issue.number);

function filterBlockers(allIssues, THIS_ID) {
  const validBody = (issue) => { return issue.body !== '' } 
  const notThisIssue = (issue) => toInt(issue.number) !== THIS_ID;;
  const allowedCollaboratorTypes = (issue) => ['COLLABORATOR', 'CONTRIBUTOR', 'MEMBER', 'OWNER' ].includes(issue.author_association);

  const onlyBlockers = (issue) => {
    const parsedBody = parse(issue.body.trim().toLowerCase());
    const blockedIssueNum = toInt(parsedBody.actions.blocks[0].issue);
    return parsedBody.actions.blocks && blockedIssueNum  === THIS_ID;
  };
  //console.log(`allIssues : ${JSON.stringify(allIssues, null, 2)}`);

  return allIssues.filter(validBody).filter(notThisIssue).filter(allowedCollaboratorTypes).filter(onlyBlockers);
}

function postComment(blockers) {
    const blocker_str = blockers.map((blocker) => { return `#${blocker.number}` }).join(' ');
    const commentBody =`This issue cannot be closed at this time, it is dependent on the following issue(s): ${blocker_str}`;

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
      body: commentBody,
    });
  return commentBody;
}



async function run() {
  try {
    console.log(`THIS_ID: ${THIS_ID}`);
    const all = await getAllIssues();
    const sorted = all.sort((l, r) => l.number - r.number );

    const parameters = {
      state: 'open',
      owner:  context.repo.owner,
      repo:   context.repo.repo,
      //default: per_page: 30,
      per_page: 1, //for debug only
    };
    var blockers = [];
    for await (const response of octokit.paginate.iterator(octokit.issues.listForRepo, parameters)) {
      // do whatever you want with each response, break out of the loop, etc.
      //response.data.issues ? 
      console.log(`listForRepo response: ${JSON.stringify(response, null, 2)}`);
      //TODO:: filters & add to blockers
      //console.log(`allIssues: ${JSON.stringify(allIssues, null, 2)}`);
      //const blockers = filterBlockers(sorted, THIS_ID);
      //console.log(`blockers: ${JSON.stringify(blockers, null, 2)}`);
    }

    if(blockers.length == 0) {
      core.setOutput('blocking_issues', 'No blocking issues, this issue is now permanently closed');
      return;
    }
    
    const commentBody = postComment(blockers);
    core.setOutput('blocking_issues', commentBody);

  } catch (error) {
    core.setFailed(error.message);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
  }
}

run();
