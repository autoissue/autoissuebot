# Issue Blocker Bot 

This action runs on the issue.closed event and will scan all other issues and if it determines that an issue blocks this one, it will reopen it.

So, there you are.

## Inputs

### `repo-token`

**Required** Github Repository Token.

### `per-page`

**Not Required** the # of responses when we make a request to github.listForRepo.
  Default: 30
  Max: 100

## Outputs
### `blocking_issues`
  List of issues this issue is dependent on
  blocking_issues: "#1, #2, #3"

### Adds a comment to the re-opened issue
   ![Screenshot](/images/screenshot.png)

## Example usage
```
uses: autoissue/autoissuebot@v1
with:
  repo-token: 'repository token'
  per_page: 50
```

