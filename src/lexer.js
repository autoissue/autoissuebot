const _ = require('lodash');
const TestCases = require('./lexer_test_cases.json');


function _no_empty (ch) { return ch  !== ''; };
function _linerizer (body) { return body.toLowerCase().split(/\n/).filter(_no_empty) };

//^blocked\s+by\:?\s+(?<issues>.*)$
function _extractor (line) {
  re = /^blocked\s+by\:?\s+(?<issues>.*)$/gi
  matches = Array.from(line.matchAll(re));
  if (!matches || matches.length === 0) {
    //console.log(`line: ${line}`)
    return ''; // not what we're interested in, so eat it
  }
  //console.log(matches.groups);
  return matches.map((match) => { return match.groups.issues; });
}

function validate (body) {
  return  _linerizer(body).filter(_no_empty).map(_extractor).flat().filter(_no_empty)
}


const Tokens = {
  HASH: 1, 
  SLASH: 2, 
  SPACE: 3, 
  COMMA: 4, 
}

const TokenTypes = {
  '#': Tokens.HASH,
  '/': Tokens.SLASH,
  ' ': Tokens.SPACE,
  ',': Tokens.COMMA,
}


function lexer(line) {

  const
  lexemes = line.split('');
  lexicals = [];
  const re_digit = /\d/;
  integer = '' 
  lexemes.forEach((ch) => {
    if (TokenTypes[ch]) {
      lexicals.push({ type: Tokens[TokenTypes[ch]], ch })
    }
    else if (digit = ch.match(re_digit)) {
      console.log(`digit: ${digit}`);
      integer = integer.concat(digit);
    } else {
      console.log("something else: ${ch}")
    }
  })

  /*
  /lexemes.map((ch) => {

    TokenTypes[ch]


    )
  })
  */

}


function validator_tests() {

  return
  TestCases.reduce ((acc, aCase) => {
    //console.log(`input: ${aCase.input}, aCase: ${aCase}`);
    const actual = validate(aCase.input);
      if( _.isEqual(actual, aCase.expected)) {
        return acc;
      } else {
        console.log(`!equal?!: expected: [${aCase.expected}], actual: [${actual}]`)
        return acc.concat(`failed: description: [${aCase.description}], input: [${aCase.input}]`);
      }
  }, []);
}

validator_tests();

module.exports = { lexer, validate, _linerizer, _no_empty, _extractor, }

multi_line_body = `
Marvelous commit message 
Fixes https://gitlab.com/angelkenneth/issue-closing-sample/issues/11 and #15
Blocked by https://gitlab.com/angelkenneth/issue-closing-sample/issues/11 #12
Blocked by #12, #13, #15
Blocked by: #22, #23, #25
`
  
body = "blocked by: #13, #14"
/*
 L = require('./lexer')
  lexd = L.validate(body) 
  line = lexd[0]
  * */



