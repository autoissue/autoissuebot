
cr_multi_blocked_by_comma_body="API container ticket.\n blocked by: #23, #31, #32, #33"
cr_multi_blocked_by_no_comma_body="API container ticket.\n blocked by: #23 #31 #32 #33"
no_issue_link_body="API container ticket.\n blocked by: "
no_ticket_links_body="API container ticket."
multi_blocked_by_comma_body = "Fixes #23. Blocked by #31, #32, #33"
multi_blocked_by_no_comma_body = "Fixes #23. Blocked by #31 #32 #33"
body = "Fixes #23. blocked by: #31. blocked by: #32, blocked by: #33"

single_issue_body = 'blocked by: #31'
multi_line_body = `
Marvelous commit message 
Fixes https://gitlab.com/angelkenneth/issue-closing-sample/issues/11 and #15
Blocked by https://gitlab.com/angelkenneth/issue-closing-sample/issues/11 #12
Blocked by #12, #13, #15
Blocked by: #22, #23, #25
`
no_blocked_by_body = "Fixes #23";
cr_multi_liner_body="API container ticket.\n blocked by: #23"

function parse_single_line(line) {
  const BL = 'blocked by';
  const DELIM = ':';
  const ERR = -1;

  idx = line.indexOf(BL);
  if (idx === ERR)  { return []; }
  let issues = line.slice(idx + BL.length).trim()
  if (issues[0] === DELIM) { issues = issues.slice(1).trim() }

  if (!issues.includes(',')) {
    return  [ parse_single_issue_ref(issues) ];
  }

  return issues.split(',').map((is) => {
    return parse_single_issue_ref(is);
  })
}

function multi_blocker_matches(body) {
  const re = /^(w+\s+)*blocked by\:?(\s+#\d+)(,?\s+#\d+)*/gim;
  const re_str = '/^(w+\s+)*blocked by\:?(\s+#\d+)(,?\s+#\d+)*/gim';
  const ma = Array.from(body.matchAll(re))
  return ma; 
}

re = /^blocked\s+by\:?\s+(.*)$/gi

function parse_body(body) {



}




function blocked_by(octokit, { owner, repo, issue_number } ) {
  const this_issue = await octokit.issues.get({
    owner, 
    repo,
    issue_number,
  });
  b = this_issue.body 
  blockers =  parse(b).actions['blocked by'];

  if (blockers.length === 0 ) {
    return [];
  }

  return blockers.map((bl) => {
    return parseInt(bl.issue, 10); 
  }).map((issue_number) => {


  })

  blockers.map((bl) => (parseInt(bl.issue, 10)))
}

function single_blocker_matches(body) {
  const re = /(w?\s*)*blocked by\:?(?<issue>(#\d+))/gi;
  const ma = Array.from(body.matchAll(re));
  console.log(`ma: ${JSON.stringify(ma)}`);
  return ma;
  //issue = (ma[0].groups.issue).trim()
}



function strip_multi_line(str) {
  const lines = str.split('\n').filter((line) => { return line !== '' });
  mla = lines.map((line) => { return single_blocker_matches(line) }).filter((group) => { return group.length !== 0; }).flat();
  return mla.map((el) => {
    console.log(`el: ${JSON.stringify(el, null)}`)
    return parseInt( el.groups.issue.trim(), 10); 
  })
}


function cleanup_multi_line(str) {
  const clean = (str) => {
    return str.split('\n').filter((line) => { return line !== '' }).map((l) => { return l.toLowerCase(); });
  }
  const lines = clean(str); 
  return lines.map((line) => {
    issues = parse_single_line(line);
  })
}




function parse_single_issue_ref(issue) {
  //console.log(`issue: ${issue}`)
  const re = /#(\d+)/;
  let issue_num = issue.match(re)[0].slice(1);
  issue_num = parseInt(issue_num, 10);
  return issue_num;
}





/* 
 * function blocked_by_status(blockers) {
 *   return Promise.allSettled(
 *     blockers.map((blocker) => {
 *
 *     })
 *   )
 * }
 *  */

// re = /blocked by:?(\s*(#\d+),?\s*)+/gim
// re = new RegExp(/blocked by:?((\s*(#\d+)),?\s*)*/, 'gim')
// re = /blocked by\:?(?:\s*)((\#\d+),?)*/gim


let regexp = /(\w+\.)+\w+/g;

ma = Array.from(body.matchAll(re))
  

matchAll = body.matchAll(re)

blockerMatches(body)






module.exports = { parse_body, tests }
