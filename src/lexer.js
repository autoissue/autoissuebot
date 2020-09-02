const _ = require('lodash');
const TestCases = require('./lexer_test_cases.json');


function _no_empty (ch) { return ch  !== ''; };
function _linerizer (body) { return body.toLowerCase().split(/\n/).filter(_no_empty) };
function _extractor (line) {
  line = line.trim();
  const re = /^blocked\s+by\:?\s+(?<issues>.*)$/gi;
  matches = Array.from(line.matchAll(re));
  if (!matches || matches.length === 0) {
    console.log(`line:[${line}]`)
    return ''; // not what we're interested in, so eat it
  }
  //console.log(matches.groups);
  return matches.map((match) => { return match.groups.issues; });
}

function validate (body) {
  return  _linerizer(body).filter(_no_empty).map(_extractor).flat().filter(_no_empty);
}


const Tokens = {
  HASH: 1, 
  SLASH: 2, 
  SPACE: 3, 
  COMMA: 4,
  INTEGER: 5,
}

const TokenTypes = {
  '#': Tokens.HASH,
  '/': Tokens.SLASH,
  ' ': Tokens.SPACE,
  ',': Tokens.COMMA,
  '_': Tokens.INTEGER,
}



function lexer(line) {
  const toIntNode = (issue) => ({ token: Tokens.INTEGER, ch: parseInt( issue, 10) });
  //const
  //console.log(`line: ${line}`);
  let lexemes = line.split('');
  let lexicals = [];
  let issue = ''
  let listLexemes = [];

  for (const ch of lexemes) {
    //console.log(`char: ${ch}`)
    if (ch === '#') {
      console.log(`char(hash): ${ch}`)
      listLexemes.push({ token: Tokens.HASH, ch });
    } else if (ch.match(/\d/)) {
      issue += ch;
    } else if (ch === ',' ) {
      if (issue.length > 0) {
        listLexemes.push(toIntNode(issue))
        issue = '';
      }
      listLexemes.push({ token: Tokens.COMMA, ch });
    } else if (ch === ' ') {
      console.log(`char(space): ${ch}`)
      if (issue.length > 0) {
        listLexemes.push(toIntNode(issue))
        issue = '';
      }
      listLexemes.push({ token: Tokens.SPACE, ch });
    } else {
      console.log(`[line: ${line}] unknown char: ${ch}`)
    }
  }
  if (issue.length > 0) {
    listLexemes.push(toIntNode(issue))
    issue = '';
  }
  return listLexemes;
}
/***  do we need this much work? 
 *
    console.log(`------ ch: ${ch}   ------` );
 ***/


function scan_line(valid_lines) {
  return valid_lines.map((line) => { return lexables(line) });
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

body = line = '#13, #14' 

multi_line_body = `
  Marvelous commit message 
  Fixes #11 and #15
  Blocked by #12, #13, #15745
  Blocked by: #22, #23, #25
`;

mlb_2 = `
  Blocked by #12, blocked by #13, Blocked by  #15745
  Blocked by: #22, #23, #25
  blocked by #15
  blocked by:  #22, #23
`;

mlb_3_with_dups = `
  Blocked by: #22, #23, #25
  blocked by #22
`




multi_line_body_other_repo = `
  Blocked by  angelkenneth/issue-closing-sample/issues#11 #12
  Blocked by: angelkenneth/issue-closing-sample/issues#11 #12
  blocked by  angelkenneth/issue-closing-sample/issues#11, #12
  blocked by: angelkenneth/issue-closing-sample/issues#11, #12
`;


body = 'blocked by: #13, #14'
  
/*
 L = require('./src/lexer')
  lexd = L.validate(body)
  scan_line(lexd)
  line = lexd[0]
  scan_line(lexd)
  * */


function pipe(arrOfFuncs, value) {
  return arrOfFuncs.reduce((accum, fn) => {
    return fn(accum) || fn(value);
  }, "");
}



const capitalize = (str) => str.toUpperCase();
const addLowerCase = (str) => str + str.toLowerCase();
const repeat = (str) => str + str;
const capAddlowRepeat = [capitalize, addLowerCase, repeat];
console.log(pipe(capAddlowRepeat, "cat"));



