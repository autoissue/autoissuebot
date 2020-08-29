const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});



//const issueParser = require('issue-parser'); 
//const parse = issueParser('github', { actions: { blocks: ['blocks'] }});


/*

blankBody = ""
withSlug = "owner/repo#7"
mentionSingleIssue = "#7"
singleBlockerBody = "for debug purposes. blocks #7 "
multipleWithBlocksThis = "blocks #7, blocks #4"
blocksMultipleNotThis = "blocks #5, blocks #8"
singleBlocksNotThis = "blocks #8"
blockerSingleOtherRepoThis = "blocks owner/repo#7"
blockerSingleOtherRepoNotThis = "blocks owner/repo#3" 
blockerMultipleOtherRepoThis =  "blocks owner/repo#7"
blockerMultipleOtherRepoThis = "blocks owner/repo#3, blocks owner/repo#7"
blockerMultipleOtherRepoNotThis = "blocks owner/repo#3, blocks owner/repo#2"







pSingle = parse(singleBlockerBody)
p2  = parse(multipleWithBlocksThis)
p3   = parse(blocksMultipleNotThis)
p4  = parse(singleBlocksNotThis)
p5 = parse(blockerOtherRepoThis)
p6 = parse(blockerOtherRepoNotThis)
*/
