# Dependent Issue Close-Blocker Bot 

This action runs on the issue.closed event and scans the repository for any issues that need to be finished/closed before closing the issue.


## Use Case:

> Be you: work with a team to write code for some software product and your team uses Github Issues for managing the development process.
> Be you: Have dozens, perhaps hundreds of issues in your backlog, and have a hard time managing that.

In this scenario how do you know how issue #217 is related to issue #175 and whether you should close #217?
Add this action to your repository, so when you close issue #217, we can scan the description of all open issues in the repository for the text "blocks #217"
Then if any matching issues are found we will reopen #217 and add a comment saying "This issue cannot be closed at this time, it is dependent on issue #175, #173". 


### `repo-token`

**Required** Github Repository Token.

### `per-page`

**Not Required** Configure the # of issues per page when making requests to github
  Default: 30
  Max: 100

## Outputs
### `blockers`
  List of issues this issue is dependent on
  blockers: "#1, #2, #3"

### Adds a comment to the re-opened issue
   ![Screenshot](/images/screenshot.png)

## Example Basic usage
```
uses: autoissue/autoissuebot@v1
with:
  repo-token: 'repository token'
```


## Example Advanced usage
```
uses: autoissue/autoissuebot@v1
with:
  repo-token: 'repository token'
  per_page: 50
```

