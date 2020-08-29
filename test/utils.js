// NB: https://remarkablemark.org/blog/2016/08/20/arrow-functions-in-mocha/

const assert = require('chai').assert;
const u = require('../src/utils');


describe('blocked by:', () => {
  it('should parse multi-line multiple blocked by', () => {
    const body = `
    Marvelous commit message 
    Fixes https://gitlab.com/angelkenneth/issue-closing-sample/issues/11 and #15
    Blocked by https://gitlab.com/angelkenneth/issue-closing-sample/issues/11 #12
    Blocked by #12, #13, #15
    Blocked by: #22, #23, #25j    `
    assert.deepEqual(u.blocker_matches(body), []);
  })  
})





body="API container ticket.\n blocked by: #23, #31, #32, #33"
body="API container ticket.\n blocked by: #23"
body="API container ticket.\n blocked by: "
body="API container ticket."

body = "Fixes #23. Blocked by #31, #32, #33"
body = "Fixes #23. Blocked by #31 #32 #33"
body = "Fixes #23. blocked by: #31. blocked by: #32, blocked by: #33"

//single
body = 'blocked by: #31'



//multiple
body = "blocked by: #31. blocked by: #32, blocked by: #33"
body = "blocked by: #31, #32, #33"
body = "Blocked by: #31. blocked by: #32, blocked by: #33"


line = body

str = ml_body = `
Marvelous commit message 
Fixes https://gitlab.com/angelkenneth/issue-closing-sample/issues/11, #15
Blocked by https://gitlab.com/angelkenneth/issue-closing-sample/issues/11, #12
Blocked by #13
Blocked by: #13
Blocked by #12, #13, #15
Blocked by: #22, #23, #25
`
	describe('given "#https?://speakerdeck.com/.*#i"', function() {
		it('should match "https://speakerdeck.com/tootallnate/node-gyp-baynode-meetup-september-6-2012"', function() {
			var url =
				'https://speakerdeck.com/tootallnate/node-gyp-baynode-meetup-september-6-2012';
			var re = PCRE('#https?://speakerdeck.com/.*#i');
			assert(re.test(url));
		});
	});

