# Issue Blocker Bot 

This action runs on the issue.closed event and will scan all other issues and if it determines that an issue blocks this one, it will reopen it.

## Inputs

### `repo-token`

**Required** Github Repository Token.

## Outputs
  blocking_issues: "#1, #2, #3"

### `blocking_issues`

List of issues this issue is dependent on

## Example usage
```
uses: autoissue/autoissuebot@v1
with:
  repo-token: 'repository token'
```

