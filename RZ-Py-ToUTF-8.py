#! /usr/bin/env python
# -*- coding: utf-8 -*-

import os, sys, chardet;

#==== Function. ========================================================================================================

'''
  transform a text file encode from Big5 To UTF-8 and save as a new file.
  'FP' = File Path.
  'OE' = Origin Encode.
  'TM' = Test Mode.
  Return: 0 as OK, < 0 as error.
'''
def ToUTF8(FP, OE = '', TM = False):
  if not os.path.isfile(FP):
    return -1;

  FR = open(FP, 'r');
  Txt = FR.read();
  Ecd = OE;

  if len(OE) == 0:
    Ecd = chardet.detect(Txt)['encoding']; # 'Ecd' = Encode.

  print 'from ' + Ecd + ' to utf-8: ' + os.path.basename(FP),;
  if Ecd == 'utf-8':
    print " => no need to transform encoding.";
    return 1;
  print '';

  if TM is True:
    return 1;

  FR.seek(0);
  Txt = FR.read();
  Txt = unicode(Txt, Ecd, 'ignore').encode('utf-8', 'ignore');
  FR.close();

  P = FP.rfind('.'); # 'P' = Position.
  FP = FP[0:P] + '_utf8' + FP[P:];
  FW = open(FP, 'w');
  FW.write(Txt);
  FW.close();
  return 0;

#==== Main. ============================================================================================================

OptA = sys.argv[1:]; # 'OptA' = Option Array.
OL = len(OptA); # 'OL' = Option Length.

if OL == 0:
  print "please give a directory path.\n" \
        'Sample 1: ' + sys.argv[0] + " /home/test/\n" \
        'Sample 2: ' + sys.argv[0] + " /home/test/\n [Encode]" \
        'P.S. add keyword \'test\' in the end of command to make a test.';
  sys.exit();

DP = OptA[0]; # 'DP' = Directory Path.
OE = ''; # 'OE' = Origin Encode.
TM = False; # 'TM' = Test Mode.

if DP[-1] != '/':
  DP += '/';

if OL > 1 and len(OptA[1]) > 0:
  if OptA[1] == 'test':
    TM = True;
  else:
    OE = OptA[1];

if OL > 2 and OptA[2] == 'test':
  TM = True;

del OptA;

print '================================';

FA = os.listdir(DP); # 'FA' = File Array.
for V in FA:
  Rtn = ToUTF8(DP + V, OE, TM);
  if Rtn < 0:
    print 'Error: ' + str(Rtn) + ', ' + V;

print '';

if len(OE) > 0:
  print "ask encode transform from '" + OE + "'.";

if TM:
  print "in test mode, no files are really transformed.";

print '================================';

#=======================================================================================================================