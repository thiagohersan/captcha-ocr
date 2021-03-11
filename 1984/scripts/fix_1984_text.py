#!/usr/bin/env python

from re import match
from os import listdir, makedirs
from os.path import isfile, exists, join, dirname, realpath

mydir = dirname(realpath(__file__))
myoutpath = join(mydir, '..', 'out')

if not exists(myoutpath):
  makedirs(myoutpath)

for part in range(1,4):
  myinpath = join(mydir, '..', 'part-0' + str(part))

  ins = [f for f in listdir(myinpath) if (isfile(join(myinpath, f)) and f.startswith('part'))]
  ins.sort()

  for fname in ins:
    fpath = join(myinpath, fname)
    with open(fpath) as fpi:
      lines = fpi.readlines()
      thisPart = ''

      for l in lines:
        if ((l.rstrip().endswith(".") or
             l.rstrip().endswith(":") or
             l.rstrip().endswith("!") or
             l.rstrip().endswith("?") or
             l.rstrip().endswith(".'") or
             l.rstrip().endswith("!'") or
             l.rstrip().endswith("?'") or
             l.rstrip().endswith("-'") or
             l.rstrip().endswith("----"))
            and len(l) < 74):
          l += '\n'
        elif (match('chapter [0-9]+', l.lower())):
          l = '<div class="chapter">' + l.rstrip() + '</div>\n'
        elif (match('part [otfsen]', l.lower())):
          l = '<div class="part">' + l.rstrip() + '</div>\n'
        elif (l.rstrip() == ''):
          l = l
        else:
          l = l.rstrip() + ' '

        thisPart += l

      with open(join(myoutpath, 'out_' + fname.replace('.txt', '.html')), 'w') as fpo:
        fpo.write(thisPart)
