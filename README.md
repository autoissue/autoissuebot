# Dependent Issue Close-Blocker Bot 

This action runs on the issue.closed event and scans the repository for any issues that need to be finished/closed before closing the issue.


## Use Case:


> Be you: Work with a team to write code for some software product and your team uses Github Issues for managing the development process.
> Be you:  Have dozens, perhaps hundreds of issues in your backlog, and have a hard time managing that.


<p>
How you know, when deciding to close #217 that it's a bad idea because #175, and #173 aren't finished yet?
That's where this action enters the picture!
Add it to your repository, so when you close issue #217, it can scan the description of all open issues in the repository for the text "blocks #217"<br>
Then if those matching issues are found it will reopen #217 and add a comment that says <br>
</p>


> "This issue cannot be closed at this time, it is dependent on issue #175, #173"

# Inputs

### `repo-token`

<span style="color:red">**REQUIRED**</span> Github Repository Token.

### `per-page`

<span style="color:blue">**NOT Required**</span> Configure the # of issues per page when making requests to github
  Default: 30
  Max: 100

## Outputs
### `blockers`
  List of issues this issue is dependent on
  blockers: "#175, #173"

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

