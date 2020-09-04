## MVP FEATURES
- [X]  Able to handle issue.closed event
- [X]  Understand github repo/issue syntax
- [X]  Able to Parse issue description for 'blocks {other-issue}'  
- [X]  Able to scan all Issue comments for 'blocks {other-issue}'
- [X]  Able to check {other-issue} status = 'closed'
- [X]  Able to reopen issue if any dependent issues are open.

if issue-B 'blocks' issue-A, then issue-A cannot be closed if issue-B is still open.
- [X]  Support 'blocked by: #13'
- [X]  Support 'blocked by: #12, blocked by #13, blocked by: #15'
- [X]  Support for 'blocked by: user/repo#issue'


## V2
- [ ]  Able to scan issue comments for 'blocked by {issue}'   
- [ ]  If commentor is an admin/moderator of repo.
#Notes:
  https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs
  https://docs.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords


