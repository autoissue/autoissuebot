const issueParser = require('issue-parser'); 
const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);

if ( !repoToken) { 
  core.setFailed('repo-token was not set');
  process.exit(1);
}





function toInt(str) {
  return parseInt(str, 10);
}

const THIS_ID = toInt(context.payload.issue.number);





function filterNonBlockers(allIssues, THIS_ID) {
  const validBody = (issue) => { return issue.body !== '' } 
  const notThisIssue = (issue) => toInt(issue.number) !== THIS_ID;;
  const allowedCollaboratorTypes = (issue) => ['COLLABORATOR', 'CONTRIBUTOR', 'MEMBER', 'OWNER' ].includes(issue.author_association);

  const onlyBlockers = (issue) => {
    const pBody = parse(issue.body.trim().toLowerCase());
    console.log(`issue: ${JSON.stringify(issue, null, 2)}`);
    console.log(`pBody: ${JSON.stringify(pBody, null, 2)}`);
    const blockedIssueNum = toInt(pBody.actions.blocks[0].issue);
    return pBody.actions.blocks && blockedIssueNum  === THIS_ID;
  };
  //console.log(`allIssues : ${JSON.stringify(allIssues, null, 2)}`);

  return allIssues.filter(validBody).filter(notThisIssue).filter(allowedCollaboratorTypes).filter(onlyBlockers);
}





function postComment(blockers) {
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



async function run() {
  try {
    console.log(`THIS_ID: ${THIS_ID}`);

    const getNextPage = () => {
      const parameters = {
        state: 'open',
        owner:  context.repo.owner,
        repo:   context.repo.repo,
        //default: per_page: 30,
        per_page: 1, //for debug only
      };
      return octokit.paginate.iterator(octokit.issues.listForRepo, parameters);
    };

    var allBlockers = [];
    for await (const response of getNextPage()) {
      // console.log(`listForRepo response: ${JSON.stringify(response, null, 2)}`);
      //TODO:: filters & add to blockers
      const issuesThisResp  = response.data;
      const blockersThisResp = filterNonBlockers(issuesThisResp); 
      allBlockers.concat(blockersThisResp); 
      //console.log(`allIssues: ${JSON.stringify(allIssues, null, 2)}`);
    }

    if(allBlockers.length == 0) {
      core.setOutput('blocking_issues', 'No blocking issues, this issue is now permanently closed');
      process.exit(0);
      return;
    }
    allBlockers.sort((l, r) => l.number - r.number );
    console.log(`all blockers: ${JSON.stringify(allBlockers, null, 2)}`);
    const comment = postComment(allBlockers);
    core.setOutput('blocking_issues', comment);

  } catch (error) {
    core.setFailed(error.message);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    process.exit(1);
  }
}

run();
