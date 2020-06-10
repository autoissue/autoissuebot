## MVP FEATURES
- [ ]  Able to handle issue.closed event
- [ ]  Understand github repo/issue syntax
- [ ]  Able to Parse issue description for 'blocks {other-issue}'  
- [ ]  Able to scan all Issue comments for 'blocks {other-issue}'
- [ ]  Able to check {other-issue} status = 'closed'
- [ ]  Able to reopen Issue if any dependent issues are open.
- [ ]  Able to scan issue comments for 'blocked by {issue}'   
- [ ]  Track/count all watche repos on a per user basis
- [ ]  Charge user for all watched repos

if issue-B 'blocks' issue-A, then issue-A cannot be closed if issue-B is still open.

if issue-C is 'blocked by' issue-B then issue C cannot be closed if issue-B is still open.



## Programmer Tasks
- [X] Make AWS account
- [ ] AWS postgreSQL DDL
- [ ] List of registered orgs/users
- [ ]   1st level repos per user
- [ ]     scan closed issues in repo
- [ ]       scan issue description for 'blocks ${{ issue }}'  
- [ ]       scan comments for 'blocks ${{ issue }}'
- [ ]       Add/define synonyms for 'blocks', such as 'blocked by' 
-             'blocks' is a -> relation. 'blocked by' is <- relation.
- [ ] Reopen issue 
- [ ] Add gha_close_blocker to GitHub Actions Marketplace
- [ ] How to scan for blockers across repos (e.g. FE issue blocked by BE issue )
- [ ]   should/can lambda execute/call another lambda?
- [ ]  How to AWS/gh payments  
- [ ]  Calculate pricing structure  
- [ ] Cloudfront defs? 





