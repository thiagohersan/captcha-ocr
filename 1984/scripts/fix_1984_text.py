#!/usr/bin/env python

from re import match
from os import listdir
from os.path import isfile, join, dirname, realpath

mydir = dirname(realpath(__file__))

for part in range(1,4):
  mypath = join(mydir, '..', 'part-0' + str(part))
  ins = [f for f in listdir(mypath) if (isfile(join(mypath, f)) and f.startswith('part'))]
  ins.sort()

  for fname in ins:
    fpath = join(mypath, fname)
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
        elif (match('chapter [0-9]+', l.lower()) or
              match('part [otfsen]', l.lower()) or
              (l.rstrip() == '')):
          l = l
        else:
          l = l.rstrip() + ' '

        thisPart += l

      with open(join(mypath, 'out_' + fname), 'w') as fpo:
        fpo.write(thisPart)

