#!/usr/bin/env python

from re import match, split
from os import listdir, makedirs
from os.path import isfile, exists, join, dirname, realpath

mydir = dirname(realpath(__file__))
myoutpath = join(mydir, '..', 'out')

if not exists(myoutpath):
  makedirs(myoutpath)

myinpath = join(mydir, '..')
fpath = join(myinpath, '1984_en.txt')

lines = []

with open(fpath) as fpi:
  text = (fpi.read()
          .replace('\r\n', ' ')
          .replace('\n', ' ')
          .replace('    ', ' ')
          .replace('   ', ' ')
          .replace('  ', ' ')
          .replace('--', ', '))

  words = text.strip().split(' ')

  word_idx = 0
  thisPhrase = ''

  while(words[word_idx] != 'PART'):
    word_idx += 1

  while(word_idx < len(words)):
    thisPhrase += words[word_idx] + ' '

    if(len(thisPhrase) > 40):
      lines.append(thisPhrase.strip())
      thisPhrase = ''
    word_idx += 1

  if(len(thisPhrase) > 0):
    lines.append(thisPhrase.strip())


with open(join(myoutpath, 'out_' + '1984_en.js'), 'w') as fpo:
  fpo.write('const phrases1984 = [\n')
  for l in lines:
    fpo.write('  \'' + l.replace('\'', '\\\'') + '\',\n')
  fpo.write('];\n')
