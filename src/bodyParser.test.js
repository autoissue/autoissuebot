const parse = require('./bodyParser');


test('single_issue_body ', () => {
   single_issue_body = 'blocked by: #31' 
  expect(parse(single_issue_body)).toEqual([
    { owner: undefined, repo: undefined, issue_number: 31 }
  ]);
});


multi_line_body = `
  Marvelous commit message 
  Fixes #11 and #15
  Blocked by #12, #13, #15745
  Blocked by: #22, #23, #25
`;

mlb_2 = `
  Blocked by #12345, blocked by #1301, Blocked by #15745
  Blocked by: #22, #23, #25
  blocked by #15
  blocked by:  #22, #23
`;

mlb_3_with_dups = `
  Blocked by: #22,blocked by #23,blocked by #25
  blocked by #22
`

multi_line_body_other_repo = `
  Blocked by  angelkenneth/issue-closing-sample/issues#11 #12
  Blocked by: angelkenneth/issue-closing-sample/issues#11 #12
  blocked by  angelkenneth/issue-closing-sample/issues#11, #12
  blocked by: angelkenneth/issue-closing-sample/issues#11, #12
`;


body = 'blocked by: #13,blocked by #14'





