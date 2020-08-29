#!/usr/bin/env python

import logging
#  from sh import gh
import sh 


logging.basicConfig(level=logging.INFO)


def main():
    
    print(sh.gh.issue.list)


    #  cmd = "gh issue list"
    #  returned_value = subprocess.call(cmd, shell=True)  # returns the exit code in unix
    #  print('returned value:', returned_value)
    #
    #  # returns output as byte string
    #  returned_output = subprocess.check_output(cmd)
    #
    #  # using decode() function to convert byte string to string
    #  print('version:', returned_output.decode("utf-8"))



if (__name__ == "main"):
    main()




