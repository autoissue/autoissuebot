## MVP FEATURES
- [X]  Able to handle issue.closed event
- [X]  Understand github repo/issue syntax
- [X]  Able to Parse issue description for 'blocks {other-issue}'  
- [X]  Able to scan all Issue comments for 'blocks {other-issue}'
- [X]  Able to check {other-issue} status = 'closed'
- [X]  Able to reopen issue if any dependent issues are open.
- [ ]  Support 'blocked by: #13'
- [ ]  Support 'blocked by: #12, #13, #15'

if issue-B 'blocks' issue-A, then issue-A cannot be closed if issue-B is still open.

if issue-C is 'blocked by' issue-B then issue C cannot be closed if issue-B is still open.
## V2
- [ ]  Support for 'blocked by: user/repo#issue'
- [ ]  Support for 'blocked by: user/repo#issue, #, #'
- [ ]  Support for 'blocked by: #, #, user/repo#issue, #'

#Notes:
  https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs
  https://docs.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords

