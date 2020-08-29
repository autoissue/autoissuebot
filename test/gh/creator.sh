
# case 1, closed/no blockers
# function start_case1() {
#   # new_issue "" ""
# }


# create 2 irrelevant tickets
# create parent
# create child
# create 2nd child
 fs

gh icr 
#case 2: 1 blocker
#case 3: 2 or more blockers


#case 4: multi-repo blockers?
# TODO: how to differentiate, decide that the multi-repo blocker is valid



gh alias set icrt 'issue create --title "$1" --body "$2" --assignee machinshin --label "$3"'


$ gh alias set --shell igrep 'gh issue list --label="$1" | grep $2'

gh alias set --shell icrt 'gh issue create --assignee machinshin --title "$1" --body "$2" --label "$3"'

20 gh icrt '1.0 cronjobs/deployment' ' body '
21 gh icrt  '3.0 docker & utils' '  body ' 
  
22   gh icrt '2 API' '  API container ticket' 'api'  
23   gh icrt    '2.1 /api/v1/users' ' , blocks #22' 'api'
24   gh icrt    '2.1.1 POST /api/v1/users' ', blocks #23' 'api'
25   gh icrt    '2.1.2 GET all /api/v1/users'  ', blocks #23' 'api'
26   gh icrt    '2.1.3 GET /api/v1/users/:id' ', blocks #23' 'api'
27   gh icrt    '2.1.4 /api/v1/users AUTH' ' auth stuff, blocks #23' 'api'
28   gh icrt    '2.1.5 Users login' 'route: /login, blocks #23' , 'api'
29     gh icrt      '2.1.4.1 JWT' 'lowest level ticket, blocks #28' 'api'
30     gh icrt      '2.1.4.1 cookie-session' 'lowest level ticket, blocks #28' 'api'
31   gh icrt  '2.4 /middleware' ' , blocks #22' 'api'
32   gh icrt  '2.2 /db' ' db container ticket, blocks #22' 'db'
33   gh icrt  '2.3 /services' ' services container ticket, blocks #22' 'services'


22
  blocked by #23, #31, #32, #33

23
  blocked by #24, #25, #26, #27, #28

28
  blocked by #29, #30




  




