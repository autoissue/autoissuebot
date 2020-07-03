# Hello world javascript action

on the issue.closed event this action scans the issue description & the comments and if there is any reference to an issue that blocks this one, it will undo reopen the issue

## Inputs

### `repo-token`

**Required** Github Repository Token.

## Outputs
  blocking_issues: [ "#1", "2", "#3"]

### `blocking_issues`

List of issues this issue is dependent on

## Example usage

uses: autoissue/autoissuebot@v1
with:
  repo-token: 'repository token'


