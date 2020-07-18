import * as core from '@actions/core'
import issueParser = require('issue-parser');
import github = require('@actions/github');

const parse = issueParser('github', { actions: { blocks: ['blocks'] }});
const context = github.context;
const repoToken = core.getInput('repo-token');
const octokit = github.getOctokit(repoToken);





function toInt(str: string) {
  return parseInt(str, 10);
}




//GIVEN: issue.body = "blocks #7. blocks #3", THIS_ID = 7
//THEN method returns [7], meaning the specified issue does have a blocker on
//THIS_ID
//GIVEN issue.body = "blocks #3, blocks #5", THIS_ID = 7
//THIS returns [], as none of the blockers in `issue` are THIS_ID

function issue_blockers_not_this(issue_body: string, this_id: number) {
  const parsed = parse(issue_body);
  return parsed.actions.blocks.map((bl: any) => toInt(bl.issue)).filter((issue_num: number) => issue_num === this_id);
}





function applyFilters(issues: any, THIS_ID: number) {
  const hasValidBody = (issue:any ) => { return issue.body !== '' } 
  const isNotThisIssues = (issue:any ) => toInt(issue.number) !== THIS_ID;;
  const hasAllowedCollaboratorTypes = (issue:any ) => ['COLLABORATOR', 'CONTRIBUTOR', 'MEMBER', 'OWNER' ].includes(issue.author_association);

  const filterInBlockers = (issue:any ) => {
    const pBody = parse(issue.body.trim().toLowerCase());
    pBody.actions.blocks[0].issue = toInt(pBody.actions.blocks[0].issue);
    console.log(`issue: ${JSON.stringify(issue, null, 2)}`);
    console.log(`pBody: ${JSON.stringify(pBody, null, 2)}`);
    const blockedIssues =  pBody.actions.blocks.map((bl: any) => toInt(bl.issue)).filter(THIS_ID);
    return pBody.actions.blocks && blockedIssueNum  === THIS_ID;
  };
  //console.log(`issues : ${JSON.stringify(issues, null, 2)}`);

  return issues.filter(hasValidBody).filter(isNotThisIssues).filter(hasAllowedCollaboratorTypes).filter(filterInBlockers);
}






function postComment(context: any, blockers: any) {
  const blocker_str = blockers.map((blocker: any) => { return `#${blocker.number}` }).join(' ');
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










async function run(): Promise<void> {
  try {
    if ( !repoToken) { 
      core.setFailed('repo-token was not set');
      process.exit(1);
    }

    const THIS_ID = toInt(context.payload.issue.number);
    console.log(`THIS_ID: ${THIS_ID}`);


    var allBlockers = [];
    //const respones = Array.from(getNextPage(context));
    // console.log(`respones - len: ${respones.length}`);
    // console.log(`r0 : ${JSON.stringify(respones[0], null, 2)}`);
    
    for await (const response of getNextPage(context)) {
      // console.log(`listForRepo response: ${JSON.stringify(response, null, 2)}`);
      //TODO:: filters & add to blockers
      const issuesThisResp  = response.data;
      const blockersThisResp = applyFilters(issuesThisResp); 
      allBlockers.concat(blockersThisResp); 
      console.log(`issuesThisResp.len : ${issuesThisResp.length}`);
      console.log(`blockersThisResp.len : ${blockersThisResp.length}`);
    }
   
    if(allBlockers.length == 0) {
      core.setOutput('blocking_issues', 'No blocking issues, this issue is now permanently closed');
      console.log('No blocking issues, this issue is now permanently closed');
      process.exit(0);
      return;
    }
    allBlockers.sort((l, r) => l.number - r.number );
    console.log(`all blockers: ${JSON.stringify(allBlockers, null, 2)}`);
    const comment = postComment(context, allBlockers);
    core.setOutput('blocking_issues', comment);

  } catch (error) {
    core.setFailed(error.message);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    process.exit(1);
  }
}

run();
