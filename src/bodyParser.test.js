const parse = require('./bodyParser');


test('single_issue_body ', () => {
  body = 'blocked by: #31' 
  expect(parse(body)).toEqual([
    { owner: undefined, repo: undefined, issue_number: 31 }
  ]);
});


test('single issue other repo', () => {
  body = 'Blocked by  angelkenneth/issue-closing-sample/issues#11' 
  expect(parse(body)).toEqual([
    { owner: 'angelkenneth', repo: 'issue-closing-sample', issue_number: 11 }
  ]);
})

test('multi_line_body', () => {
  body = `
  Marvelous commit message 
  Fixes #11 and #15
  Blocked by #12, Blocked by: #13, Blocked By:  #15745
  Blocked by: #22,Blocked by: #23, Blocked by: #25
`;
expect(parse(body)).toEqual([
  { owner: undefined, repo: undefined, issue_number: 12 },
  { owner: undefined, repo: undefined, issue_number: 13 },
  { owner: undefined, repo: undefined, issue_number: 22 },
  { owner: undefined, repo: undefined, issue_number: 23 },
  { owner: undefined, repo: undefined, issue_number: 25 },
  { owner: undefined, repo: undefined, issue_number: 15745 },
])
})


test('multi_line_body2', () => {
  body = `
  Blocked by #12345, blocked by #1301, Blocked by #15745
  blocked by #15
  blocked by:      #22   , blocked by #23
`;

expect(parse(body)).toEqual([
  { owner: undefined, repo: undefined, issue_number: 15  },
  { owner: undefined, repo: undefined, issue_number: 22 },
  { owner: undefined, repo: undefined, issue_number: 23 },
  { owner: undefined, repo: undefined, issue_number: 1301  },
  { owner: undefined, repo: undefined, issue_number: 12345 },
  { owner: undefined, repo: undefined, issue_number: 15745 },
])
})


test('body_with_dups ', () => {
  body = `
  Blocked by: #22,blocked by #23,blocked by #25
  blocked by #22
`;
expect(parse(body)).toEqual([
  { owner: undefined, repo: undefined, issue_number: 22 },
  { owner: undefined, repo: undefined, issue_number: 23 },
  { owner: undefined, repo: undefined, issue_number: 25 },
])
})


test('multi_line_body_other_repo', () => {
  body = `
  Blocked by  angelkenneth/issue-closing-sample/issues#11, blocked by #12
  `;

expect(parse(body)).toEqual([
  { owner: 'angelkenneth', repo: 'issue-closing-sample', issue_number: 11 },
  { owner: undefined, repo: undefined, issue_number: 12 },
])

