# Hello world javascript action

on the issue.closed event this action scans the issue description & the comments and if there is any reference to an issue that blocks this one, it will undo reopen the issue

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/gha_close_blockern@v1
with:
  who-to-greet: 'Mona the Octocat'


