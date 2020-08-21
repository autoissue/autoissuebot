## MVP FEATURES
- [X]  Able to handle issue.closed event
- [X]  Understand github repo/issue syntax
- [X]  Able to Parse issue description for 'blocks {other-issue}'  
- [X]  Able to scan all Issue comments for 'blocks {other-issue}'
- [X]  Able to check {other-issue} status = 'closed'
- [X]  Able to reopen issue if any dependent issues are open.

if issue-B 'blocks' issue-A, then issue-A cannot be closed if issue-B is still open.

if issue-C is 'blocked by' issue-B then issue C cannot be closed if issue-B is still open.
## V2
- [ ]  Able to scan issue comments for 'blocked by {issue}'   

#Notes:
  https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs
