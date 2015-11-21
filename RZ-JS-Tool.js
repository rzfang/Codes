'use strict';

//==== Other Tool Function =============================================================================================

/* Combine the seconde object into first object.
  'BsObj' = Base Object.
  'ExtObj' = Extend Object.
  'Md' = Mode, 0: Union mode in default, 1: Intersection mode.
  Return: new object after combined, or null as error. */
function ObjectCombine (BsObj, ExtObj, Md)
{
  if (typeof BsObj !== 'object' || typeof ExtObj !== 'object')
  { return null; }

  if (typeof Md !== 'number')
  { Md = 0; }

  var RstObj = {};

  for (var i in BsObj)
  { RstObj[i] = BsObj[i]; }

  if (Md === 0)
  {
    for (var i in ExtObj)
    { RstObj[i] = ExtObj[i];}
  }
  else
  {
    for (var i in ExtObj)
    {
      if (typeof RstObj[i] === 'undefined')
      { continue; }

      RstObj[i] = ExtObj[i];
    }
  }

  return RstObj;
}

/* make a random number in the range.
  'Min' = minimum number.
  'Max' = maximum number.
  'Dcm' = Decimal. optional, default 0. give -1 to keep original decimal.
  Return: random number in the range, or 0 as error. */
function RandomRange (Min, Max, Dcm)
{
  if (typeof Min !== 'number' || typeof Max !== 'number')
  { return 0; }

  if (typeof Dcm !== 'number')
  { Dcm = 0; }

  if (Min > Max || Max < Min)
  {
    var T = Min;

    Min = Max;
    Max = T;
  }

  var Dst =  Max - Min, // 'Dst' = Distance.
      Nbr = Math.random() * Dst + Min;

  if (Dcm === 0)
  { Nbr = Math.floor(Nbr); }
  else if (Dcm > 0)
  {
    var Pow = Math.pow(10, Dcm);

    Nbr = Math.floor(Nbr * Pow) / Pow;
  }

  return Nbr;
}


/* make a Random Sequence.
  'Lth' = Length.
  'Dst' = Distance between units before and after.
  'St' = Start.
  Return: Array of random Sequence. */
function RandomSequence(Lth, St = 0, Dst = 1)
{
  var A = []; // 'A' = Array.

  for (var i = 0; i < Lth; i++)
  { A[i] = St + (i * Dst); }

  for (var i = 0; i < Lth; i++)
  {
    for (j = (i + 1); j < Lth; j++)
    {
      var R = Math.floor(Math.random() * Lth),
          T = A[i];

      A[i] = A[R];
      A[R] = T;
    }
  }

  return A;
}

//==== Text Tool Function ==============================================================================================

function Trim (Str)
{
  return Str.replace(/^\s+|\s+$/g, '');
}

/* check if 'Str' is matched with rule 'Ptn' of regular expression.
  'Ptn' = Pattern, can be a RegExp object, or a string.
  'Str' = String for testing.
  Return: true / false of rule match. */
function RECheck (Ptn, Str)
{
  if ((typeof Ptn != 'function' && //for chrome, a RegExp is a function.
      typeof Ptn != 'object' && typeof Ptn != 'string') || typeof Str != 'string')
  { return false; }

  var RE = new RegExp(Ptn);

  return RE.test(Str);
}

/* find all substr matched the regular expression pattern.
  'Ptn' = Pattern, can be a RegExp Object, or a String.
  'Str' = String for testing.
  'ExtOpt' = Extra option, ex: 'g' or 'gi'...
  Return: array of match, [] as error. */
function REMatch (Ptn, Str, ExtOpt)
{
  if ((typeof Ptn != 'function' && //for chrome, a RegExp is a function.
      typeof Ptn != 'object' && typeof Ptn != 'string') || typeof Str != 'string')
  { return []; }

  if (typeof ExtOpt !== 'string')
  { ExtOpt = ''; }

  var RE = new RegExp(Ptn, ExtOpt),
      Mch = Str.match(RE),
      Rst = [];

  if (typeof Mch !== 'object' || Mch === null)
  { return []; }

  if (typeof Mch[1] === 'string')
  { Rst = Mch; }
  else
  { Rst.push(Mch[0]); }

  return Rst;
}

/* test if a string is a TimeStamp.
  'TmStr' = String.
  Return: true | false.
  Need: RECheck(). */
function IsTimeStamp (TmStr)
{
  if (typeof TmStr !== 'string' || TmStr.length === 0)
  { return false; }

  return RECheck(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, TmStr);
}

/* check if a string is in URL format.
    'TstStr' = Test String.
    Return: true or false.
    Need: RECheck(). */
function IsURL (TstStr)
{
    if (typeof TstStr !== 'string' || TstStr.length === 0)
    { return false; }

    return RECheck(/^https?:\/\/.+/, TstStr);
}

/* test if a string is a E-Mail.
  'Str' = String.
  Return: true | false.
  Need: RECheck(). */
function IsEMail (Str)
{
  return RECheck(/^[\w.]+@.{2,16}\.[0-9a-z]{2,3}$/, Str);
}

/* Pad Characters into a string.
  'Str' = String.
  'Lth' = Length. minimum length of string should be padding to.
  'Chr' = Character. optional, default '0';
  'Sd' = Side. optional, default 'l'. 'l'|'L': left padding, 'r'|'R': right padding.
  Return: string after handle. */
function CharPad (Str, Lth, Chr, Sd)
{
  if (typeof Str !== 'string')
  { Str = Str.toString(); }

  if (typeof Lth !== 'number' || Lth < 2 || Str.length >= Lth)
  { return Str; }

  if (typeof Chr !== 'string' || Chr.length === 0)
  { Chr = '0'; }

  if (typeof Sd !== 'string')
  { Sd = 'l'; }
  else
  {
    Sd = Sd.toLowerCase();

    if (Sd !== 'l' && Sd !== 'r')
    { return Str; }
  }

  var PN = Lth - Str.length, // 'PN' = Padding Number.
      PS = ''; // 'PS' = Padding String.

  for (PS = ''; PS.length < PN; PS += Chr);

  if (Sd === 'l')
  { Str = PS + Str; }
  else
  { Str += PS; }

  return Str;
}

/* get a Data String by giving Second number.
  'Scd' = Second, float to include millisecond.
  'Fmt' = Format.
    0: YYYY-MM-DD HH:II:SS.CCC+ZZ. (default)
    1: YYYY-MM-DD HH:II:SS.CCC+ZZ (W).
    2: YYYYMMDDHHIISS.
  Return: datatime string.
  Need: CharPad(). */
function Second2Datetime (Scd, Fmt)
{
  var Dt = new Date(Scd * 1000), // 'Dt' = Date.
      DtStr = '',
      TZOM = Dt.getTimezoneOffset(), // 'TZOM' = Time Zone Offset Minute.
      TZOH = TZOM / 60; // 'TZOH' = Time Zone Offset Hour.

  Scd = parseFloat(Scd);

  if (typeof Fmt !== 'number')
  { Fmt = 0; }
  Fmt = parseInt(Fmt, 10);

  TZOH = (TZOH > 0 ? '-' : '+') + CharPad(Math.abs(TZOH), 2);

  switch (Fmt)
  {
    case 1:
      Dt.setMinutes(Dt.getMinutes() - TZOM);

      DtStr = Dt.toJSON().substr(0, 19).replace('T', ' ');
      break;

    case 2:
      DtStr = '' + Dt.getFullYear() + CharPad((Dt.getMonth() + 1), 2) + CharPad(Dt.getDate(), 2) +
              CharPad(Dt.getHours(), 2) + CharPad(Dt.getMinutes(), 2) + CharPad(Dt.getSeconds(), 2);
      break;

    case 0:
    default:
      DtStr = Dt.getFullYear() + '-' + CharPad((Dt.getMonth() + 1), 2) + '-' + CharPad(Dt.getDate(), 2) + ' ' +
              CharPad(Dt.getHours(), 2) + ':' + CharPad(Dt.getMinutes(), 2) + ':' + CharPad(Dt.getSeconds(), 2) + '.' +
              CharPad(Dt.getMilliseconds(), 3) + TZOH;
  }

  return DtStr;
}

/* convert CSS Color index from hex to RGBA format.
  'Str' = color string in hex format.
  Return: CSS color code with RGBA format. */
function Color16ToRGBA (Str)
{
  if (Str.charAt(0) === '#')
  { Str = Str.substr(0); }

  var Clr = 'rgba(255, 255, 255, 1.0)';

  if (Str.length < 6)
  {
    var R = parseInt(Str.charAt(0) + '0', 16).toString(),
        G = parseInt(Str.charAt(1) + '0', 16).toString(),
        B = parseInt(Str.charAt(2) + '0', 16).toString();
  }
  else
  {
    var R = parseInt(Str.substr(0, 2), 16).toString(),
        G = parseInt(Str.substr(2, 2), 16).toString(),
        B = parseInt(Str.substr(4, 2), 16).toString();
  }
  Clr = 'rgba(' + R + ', ' + G + ', ' + B + ', 1)';

  return Clr;
}

/* convert CSS Color code from RGB to hex format.
  'R' = Red color value.
  Return: CSS color code with hex format. */
function ColorRGBTo16 (R, G, B)
{
  console.log(parseInt(R, 10).toString(16));
  R = CharPad(parseInt(R, 10).toString(16), '0', 2, 'l');
  G = CharPad(parseInt(G, 10).toString(16), '0', 2, 'l');
  B = CharPad(parseInt(B, 10).toString(16), '0', 2, 'l');
  return '#' + R + G + B;
}

/* count a String Length, chinese word count as 2 because of full-width.
  'Str' = String passing in.
  Return: string length.*/
function StringLength (Str)
{
  if (typeof Str !== 'string')
  { return 0; }

  /*==== version 1. ====*/

  // var C = 0;
  // var SL = Str.length;
  // for (var i = 0; i < SL; i++)
  // {
    // var Chr = Str.charCodeAt(i);
    // if (Chr < 32 || Chr > 126)
    // { C++; }
  // }

  // return Str.length + C;

  /*==== version 2. ====*/

  var Lth = Str.length + Str.split(/[\u4e00-\u9a05]/).length - 1;

  return Lth;
}

/* substr in 'full-width as 2' mode.
  'Str' = String.
  'Ofst' = Offset of substring.
  'Lmt' = Limit of substring.
  Return: fixed substring.
  Reference:
    http://www.unicode.org/Public/5.0.0/ucd/Blocks.txt
    http://blog.xuite.net/chocopie0226/programerJava/224245060-Regular+Expression
    [\u0800-\u4E00]   (日文)
    [\u4E00-\u9fa5]   (中文)
    [\u9fa5-\uFFFF]   (韓文或其他)
    [\u0080-\uFFFF]   中日韓3byte以上的字符
    [\uFF00-\uFFFF]   全形符號
    [\uFE30-\uFFA0]   全形字母數字
    [^\uFF00-\uFFFF]  全形字
    [^\x00-\xff]      全形字 */
function SubStrFx (Str, Ofst, Lmt)
{
  var Rst = '',
      C = 0,
      i;

  if (typeof Str !== 'string')
  { Str = Str.toString(); }

  if (typeof Ofst !== 'number' || Ofst < 0)
  { Ofst = 0; }

  if (typeof Lmt !== 'number' || Lmt < 1)
  { Lmt = Str.length; }

  Str = Str.substr(Ofst, Lmt);

  for (i = 0; C < Lmt; i++)
  {
    Rst += Str.charAt(i);

    if (Str.charCodeAt(i) > 0xff) // a character out of ASCII is full-width.
    { ++C; }
    ++C;
  }

  return Rst;
}


function D2H (D)
{
  return D.toString(16);
}

function H2D (H)
{
  return parseInt(H, 16);
}

/* Base64 Encode.
  'UTF8' = UTF8 boolean flag. optional.
  Return: encode string, or empty string as error.
  Need: CharPad(); */
function Base64Encode (Str, UTF8)
{
  var KM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', // 'KM' = Key Map.
      BS = '', // 'BS' = Binary String.
      PS = '', // 'PS' = Pad String.
      B64S = ''; // 'B64S' = Base64 String.

  if (typeof UTF8 !== 'boolean')
  { UTF8 = false; }

  for (var i in Str)
  {
    var TN = Str.charCodeAt(i); // 'TN' = Temp unicode Number.

    BS += (UTF8 ? Uni2UTF8(TN) : CharPad(TN.toString(2), 16, '0', 'l'));
  }

  var PN = BS.length % 6; // 'PN' = Pad Number.

  if (PN > 0)
  {
    var TPS = '';

    PN = (6 - PN) / 2;

    while (PN-- > 0)
    {
      TPS += '00';
      PS += '=';
    }

    BS += TPS;
  }

  var C = BS.length;

  for (var i = 0; i < C; i += 6)
  {
    var TS = BS.substr(i, 6), // 'TS' = Translate String.
        DN = 0, // 'DN' = Decimal Number.
        DS = ''; // 'DS' = Decimal String.

    if (TS.substr(0, 1) === '1')
    { DN += 32; }

    if (TS.substr(1, 1) === '1')
    { DN += 16; }

    if (TS.substr(2, 1) === '1')
    { DN += 8; }

    if (TS.substr(3, 1) === '1')
    { DN += 4; }

    if (TS.substr(4, 1) === '1')
    { DN += 2; }

    if (TS.substr(5, 1) === '1')
    { DN += 1; }

    B64S += KM.substr(DN, 1);
  }

  B64S += PS;

  return B64S;

  /* convert Unicode number to be UTF-8 number in binary string.
    'UN' = Unicode Number.
    Return: binary string. */
  function Uni2UTF8(UN)
  {
    if (typeof UN !== 'number')
    { return ''; }

    var BS = UN.toString(2),
        TS = '';

    if (UN < 128)
    { BS = CharPad(BS, 8, '0', 'l'); }
    else if (UN >= 128 && UN <= 2047)
    {
      TS = CharPad(BS, 11, '0', 'l');
      BS = '110' + TS.substr(0, 5) + '10' + TS.substr(5);
    }
    else if ((UN >= 2048 && UN <= 55295) || (UN >= 57344 && UN <= 65535))
    {
      TS = CharPad(BS, 16, '0', 'l');
      BS = '1110' + TS.substr(0, 4) + '10' + TS.substr(4, 6) + '10' + TS.substr(10, 6);
    }
    else if (UN >= 65536 && UN <= 1114111)
    {
      TS = CharPad(BS, 21, '0', 'l');
      BS = '11110' + TS.substr(0, 3) + '10' + TS.substr(3, 6) + '10' + TS.substr(9, 6) + '10' + TS.substr(15, 6);
    }

    return BS;
  }
}

/* Base64 Decode.
  'UTF8' = UTF8 boolean flag. optional.
  Return: encode string, or empty string as error.
  Need: CharPad(); */
function Base64Decode (Str, UTF8)
{
  var KM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=', // 'KM' = Key Map.
      BS = ''; // 'BS' = Binary String.

  if (typeof UTF8 !== 'boolean')
  { UTF8 = false; }

  Str = Str.replace(/=+$/, '');

  var C = Str.length; // 'C' = Count.

  for (var i = 0; i < C; i++)
  {
    var TBS = CharPad(KM.indexOf(Str.substr(i, 1)).toString(2), 8, '0', 'l');

    BS += TBS.substr(2, 6);
  }

  return UTF8 ? Bin2TxtUTF8(BS) : Bin2Txt(BS);

  function Bin2Txt(BinStr)
  {
    var RT = '', // 'RT' = Result Text.
        L = BinStr.length; // 'L' = Length.

    for (var i = 0; i < L; i += 16)
    { RT += String.fromCharCode(parseInt(BinStr.substr(i, 16), 2)); }

    return RT;
  }

  function Bin2TxtUTF8(BinStr)
  {
    var RT = '', // 'RT' = Result Text.
        L = BinStr.length; // 'L' = Length.

    for (var i = 0; i < L; i += 8)
    {
      var TBS = BinStr.substr(i, 8); // 'TBS' = Temp Binary String.

      if (TBS.substr(0, 1) === '0')
      {
        var TN = parseInt(TBS, 2); // 'TN' = Text Number.

        if (TN > 0)
        { RT += String.fromCharCode(TN); }
      }
      else if (TBS.substr(0, 5) === '11110') // 4 byte.
      {
        TBS = BinStr.substr(i + 5, 3) + BinStr.substr(i + 10, 6) + BinStr.substr(i + 18, 6) + BinStr.substr(i + 26, 6);
        RT += String.fromCharCode(parseInt(TBS, 2));
        i += 24;
      }
      else if (TBS.substr(0, 4) === '1110') // 3 byte.
      {
        TBS = BinStr.substr(i + 4, 4) + BinStr.substr(i + 10, 6) + BinStr.substr(i + 18, 6);
        RT += String.fromCharCode(parseInt(TBS, 2));
        i += 16;
      }
      else if (TBS.substr(0, 3) === '110') // 2 byte.
      {
        TBS = BinStr.substr(i + 3, 5) + BinStr.substr(i + 10, 6);
        RT += String.fromCharCode(parseInt(TBS, 2));
        i += 8;
      }
    }

    return RT;
  }
}

/* parse bytes number to be normailize size string.
  'Byte' = file size, should be a number.
  Return: size string. */
function FileSizeNormalize (Byte)
{
  if (typeof Byte !== 'number')
  { Byte = parseInt(Byte, 10); }

  if (isNaN(Byte) || Byte < 0)
  { return '???'; }

  var UntA = ['KB', 'MB', 'GB'];

  for (var i = UntA.length; i > 0; i--)
  {
    var Cmp = Math.pow(2, i * 10);

    if (Byte > Cmp)
    {
      Byte = Math.round(Byte / Cmp * 100) / 100;
      return Byte.toString() + ' ' + UntA[i - 1];
    }
  }

  return Byte + ' Bytes';
}

/* encode/decode HTML special chars.
  'Txt' = Text to parse.
  'Flg' = encode/decode Flag. true: encode | false: decode.
  Return: parsed string, or '' as error. */
function HTMLSpecialCharsEnDeCode (Txt, Flg)
{
  if (typeof Txt !== 'string' || typeof Flg !== 'boolean')
  { return ''; }

  if (Flg)
  {
    return Txt.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }
  else
  {
    return Txt.replace(/&amp;|&#0?38;/g, '&')
              .replace(/&lt;|&#0?60;/g, '<')
              .replace(/&gt;|&#0?62;/g, '>')
              .replace(/&quot;|&#0?34;/g, '"')
              .replace(/&#0?39;/g, '\'');
  }
}

/* transform traditional text to be HTML code for convenient render & read.
  'Txt' = Text string.
  Return: HTML string for render. */
function TextToHTML (Txt)
{
  if (typeof Txt !== 'string' || Txt.length === 0)
  { return Txt; }

  Txt = Txt.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>');

  return Txt;
}

//==== Web/HTML Tool Function ==========================================================================================

function ChangeImage (ID, Img) //換圖.
{
  var Obj = document.getElementById(ID);

  Obj.src = Img;
}

/* add a 'style' tag into 'head' tag of the HTML DOM tree to register some CSS rules.
  'CSSStr' = CSS String.
  'ID' = element 'style' ID. optional. give to skip if style exist.
  Return: 0 as OK, < 0 as error. */
function CSSAdd (CSSStr, ID)
{
  if (typeof CSSStr !== 'string' || CSSStr.length === 0)
  { return -1; }

  if (typeof ID === 'string' && ID.length > 0)
  {
    if (document.getElementById(ID))
    { return 1; }
  }
  else
  { ID = ''; }

  var Stl = document.createElement('style'), // 'Stl' = Style.
      TxtNd = document.createTextNode(CSSStr); // 'TxtNd' = CSS Text Node.

  if (ID.length > 0)
  { Stl.id = ID; }

  Stl.type = 'text/css';

  if (Stl.styleSheet) // for IE hack.
  { Stl.styleSheet.cssText = TxtNd.nodeValue; }
  else
  { Stl.appendChild(TxtNd); }

  document.getElementsByTagName('head')[0].appendChild(Stl);

  return 0;
}

/* Set Cookie.
  'Nm' = Name.
  'V' = Value.
  'Exp' = Expires time in seconds. give negative number to remove target cookie.
  'Pth' = Path. optional.
  'Dmn' = Domain. optional.
  Return: 0 as OK, < 0 as error. */
function CookieSet (Nm, V, Exp, Pth, Dmn)
{
  if (typeof Nm !== 'string' || typeof V === 'undefined' || V === null || typeof Exp !== 'number' || Exp === null)
  { return -1; }

  var Dt = new Date();

  Dt.setTime(Dt.getTime() + (Exp * 1000));

  var Str = Nm + '=' + encodeURIComponent(V) + ';expires=' + Dt.toUTCString() + ';';

  if (typeof Pth === 'string' && Pth.length > 0)
  { Str += 'path=' + Pth + ';'; }

  if (typeof Dmn === 'string' && Dmn.length > 5)
  { Str += 'domain=' + Dmn + ';'; }

  document.cookie = Str;

  return 0;
}

/* parse Cookie Parameters in a object.
  'Ky' = Key name of cookie. optional, give to return it only.
  Return: object. */
function CookieParam (Ky)
{
  var CSA = document.cookie.split(';'), // 'CSA' = Cookie String Array.
      CO = {};

  for (var i in CSA)
  {
    var T;

    if (!CSA.hasOwnProperty(i))
    { continue; }

    T = CSA[i].replace(/^\s+|\s+$/g, '').split('='); // trim each data.

    CO[T[0]] = decodeURIComponent(T[1]);
  }

  if (Ky && typeof Ky === 'string')
  {
    for (var i in CO)
    {
      if (!CO.hasOwnProperty(i))
      { continue; }

      if (i === Ky)
      { return CO[i]; }
    }

    return null;
  }

  return CO;
}

/* turn to another page. give empty string to reload current page.
  'URL' = URL to go. optional, default ''. */
function PageTurn (URL)
{
  if (typeof URL !== 'string')
  { return 0; }

  if (URL.length > 0)
  { window.location = URL; }
  else
  { window.location.reload(true); }
}

function HideOrShow (ID) //隱藏或開啟.
{
  var Obj = document.getElementById(ID);

  Obj.style.display = Obj.style.display !== 'block' ? 'block' : 'none';
}

/* get the Window View Size.
  Return: [W, H]. */
function WindowViewSize ()
{
  var Sz = [0, 0];

  if (document.documentElement)
  { Sz = [document.documentElement.clientWidth, document.documentElement.clientHeight]; }
  else if (window.innerWidth && window.innerHeight)
  { Sz = [window.innerWidth, window.innerHeight]; }

  return Sz;
}

/* Pop a convenient window. */
function WindowPop (URL)
{
  window.open(URL);
}

/* Get now Page Name without parent directories.
  Return: page name, maybe empty string as index.php, index.html, etc. */
function PageNameGet ()
{
  var PthA = window.location.pathname.split('/');

  return PthA[PthA.length - 1];
}

/* Deny web page embeded into another page by frame or iframe. */
function EmbedDeny ()
{
  if (top != self)
  { window.location.href = 'about:blank'; }
}

/* make a AJAX request.
  'Info' = AJAX Info object, key-value pairs.
  Return: XMLHttpRequest object. or null as error. */
function AJAX (Info)
{
  var DftInfo = {'URL': '',
                 'Data': {},
                 'Files': {},
                 'Err': function(Sts){}, // Error callback function. optional. 'Sts' = HTTP Status code.
                 'OK': function(RpsTxt, Sts){}}; // OK callback function. optional. 'RpsTxt' = Response Text, 'Sts' = HTTP Status code.

  if (typeof Info.URL !== 'string' || Info.URL === '' || typeof Info.Data !== 'object' || Info.Data.length === 0)
  { return null; }

  Info.Mthd = Info.Mthd === 'POST' ? 'POST' : 'GET'; // Method. can only be 'GET'|'POST'. optional, default 'GET'.
  Info.Auto = (typeof Info.Auto === 'boolean') ? Info.Auto : true; // Auto start, give false to control manually be return object. optional, default true.
  Info.Bfr = (typeof Info.Bfr === 'function') ? Info.Bfr : function(){}; // Before callback function. optional.
  Info.Err = (typeof Info.Err === 'function') ? Info.Err : DftInfo.Err;
  Info.OK = (typeof Info.OK === 'function') ? Info.OK : DftInfo.OK;
  Info.End = (typeof Info.End === 'function') ? Info.End : function(){};
  Info.Pgs = (typeof Info.Pgs === 'function') ? Info.Pgs : function(){}; // Progress callback function. optional.

  var FmData = new FormData(),
      XHR = new XMLHttpRequest();

  for (var k in Info.Data)
  { FmData.append(k, Info.Data[k]); }

  if (typeof Info.File === 'object' && Info.File !== null)
  {
    for (var k in Info.File)
    { FmData.append(k, Info.File[k]); }
  }

  XHR.Go = function(){ XHR.send(FmData); };
  XHR.onreadystatechange = StateChange;
  XHR.upload.onprogress =  function(Evt){ Info.Pgs(Evt.loaded, Evt.total, Evt); };

  // XHR.overrideMimeType('text/xml');
  XHR.open(Info.Mthd, Info.URL);
  XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // to use AJAX way.

  if (Info.Auto)
  { XHR.send(FmData); }

  return XHR;

  function StateChange()
  {
    switch (this.readyState)
    {
      case 0:
        Info.Bfr();
        break;

      case 1:
      case 2:
      case 3:
        break;

      case 4:
        if (this.status === 200)
        { Info.OK(this.responseText, this.status); }
        else
        { Info.Err(this.status); }

        Info.End();
        break;
    }
  }
}

function URLParameters ()
{
  var PrmStr = window.location.search, // 'PrmStr' = Parameters String.
      URLPrms = {};

  if (PrmStr.length > 0)
  {
    var TmpA0 = PrmStr.substr(1).split('&');

    for (var i = 0; i < TmpA0.length; i++ )
    {
      var TmpA1 = TmpA0[i].split('=');

      console.log(TmpA1);

      URLPrms[TmpA1[0]] = (TmpA1.length < 2) ? true : TmpA1[1];
    }


    return URLPrms;
  }
}

function SubmitByJs (DataObj, URL, Mthd)
{
  URL = 'service_test.php';

  if (typeof DataObj !== 'object' || DataObj === null || typeof URL !== 'string' || URL.length === 0)
  { return -1; }

  Mthd = typeof Mthd !== 'string' ? '' : Mthd.toUpperCase();

  if (Mthd !== 'GET')
  { Mthd = 'POST'; }

  var Fm = document.createElement('form');

  Fm.setAttribute('action', URL);
  Fm.setAttribute('method', Mthd);

  document.getElementsByTagName('body')[0].appendChild(Fm);

  FormInputArrayBuild(Fm, DataObj, 'JSON');

  Fm.submit();

  return 0;

  function FormInputArrayBuild(Fm, ArrObj, Nm)
  {
    var Tp = typeof ArrObj;

    if (typeof Fm !== 'object' || Fm === null || Tp === 'undefined' ||
       typeof Nm !== 'string' || Nm.length === 0)
    { return 0; }

    if (Tp === 'number' || Tp === 'string' || ArrObj === null)
    {
        var Ipt = document.createElement('input');

        Ipt.setAttribute('type', 'hidden');
        Ipt.setAttribute('name', Nm);
        Ipt.setAttribute('value', ArrObj);

        Fm.appendChild(Ipt);

        return 0;
    }

    for (var i in ArrObj)
    {
        FormInputArrayBuild(Fm, ArrObj[i], Nm + '[' + i + ']');
    }
  }
}

/*
  'ImgURL' = Image URL.
  'Clbk' = Callback.
    Clbk(Cvs), 'Cvs' = Canvas element object.
  'Rng' = 5; // 'Rng' = Range of blur. optional, default 4. */
function ImageBlur (ImgURL, Clbk, Rng)
{
  var Img;

  if (!ImgURL || typeof ImgURL !== 'string' || typeof Clbk !== 'function')
  { return; }

  if (!isNaN(Rng) || Rng < 0)
  { Rng = 4; }

  Img = new Image();
  Img.onload = CanvasUse;
  Img.src = ImgURL;

  return;

  function CanvasUse ()
  {
    var Cvs = document.createElement('canvas'),
        Ctx,
        ImgData,
        NewImgData;

    Cvs.width = this.naturalWidth;
    Cvs.height = this.naturalHeight;
    Ctx = Cvs.getContext('2d');

    Ctx.drawImage(Img, 0, 0);

    ImgData = Ctx.getImageData(0, 0, Cvs.width, Cvs.height);
    NewImgData = new Uint8ClampedArray(ImgData.data);

    for (var i = 0; i < ImgData.data.length; i += 4)
    {
      var t = i >>> 2;
      var NowXY = [t % ImgData.width, parseInt(t / ImgData.width, 10)],
          PxlLth = 0,
          NewPxl = [0, 0, 0, 255];

      for (var j = Rng * -1; j <= Rng; j++)
      {
        for (var k = Rng * -1; k <= Rng; k++)
        {
          var PxlSk = ImgDataPixelSeek(ImgData, NowXY[0] + j, NowXY[1] + k); // 'PxlSk' = Pixel Seeking.

          if (!PxlSk)
          { continue; }

          PxlLth++;
          NewPxl[0] += ImgData.data[PxlSk];
          NewPxl[1] += ImgData.data[PxlSk + 1];
          NewPxl[2] += ImgData.data[PxlSk + 2];
        }
      }

      NewImgData[i] = parseInt(NewPxl[0] / PxlLth, 10);
      NewImgData[i + 1] = parseInt(NewPxl[1] / PxlLth, 10);
      NewImgData[i + 2] = parseInt(NewPxl[2] / PxlLth, 10);
    }

    ImgData.data.set(NewImgData);
    Ctx.putImageData(ImgData, 0, 0);

    Clbk(Cvs);
  }

  /*
    ImgData: ImageData object from canvas.
    Return: seeking index, or null. */
  function ImgDataPixelSeek (ImgData, X, Y)
  {
    var SeekingXY;

    if (!(ImgData instanceof ImageData) || typeof X !== 'number' || typeof Y !== 'number')
    { return null; }

    if (X < 0 || Y < 0 || X > (ImgData.width - 1) || Y > (ImgData.height - 1))
    { return null; }

    return (Y * ImgData.width << 2) + (X << 2);
  }
}

//==== JQuery Function =================================================================================================

/* Show element by selector.
  'Obj' = Object.
  'Tp' = animation Type.
  Need: JQuery API. */
function Show (Obj, Tp)
{
  if ( Tp < 0 || Tp > 3)
    Tp = 0;

  switch (Tp)
  {
    case 1:
      $(Obj).show('normal');
      break;

    case 2:
      $(Obj).fadeIn('normal');
      break;

    case 3:
      $(Obj).slideDown('normal');
      break;

    case 4:

    default:
      $(Obj).show();
  }

  return 0;
}

/* Hide element by selector.
  'Obj' = Object.
  'Tp' = animation Type.
  Need: JQuery API. */
function Hide (Obj, Tp)
{
  if ( Tp < 0 || Tp > 3)
    Tp = 0;

  switch (Tp)
  {
    case 1:
      $(Obj).hide('normal');
      break;

    case 2:
      $(Obj).fadeOut('normal');
      break;

    case 3:
      $(Obj).slideUp('normal');
      break;

    case 4:

    default:
      $(Obj).hide();
  }

  return 0;
}

/* Hide Or Show the element object by selector of jquery.
  'OS' = Element Object or JQuery Selector.
  Need: JQuery API.
  Return: 0 as good, or < 0 as error. */
function HideOrShow (OS)
{
  if (typeof OS == 'undefined')
    return -1;

  $(OS).toggle();

  return 0;
}

/*
  'ImgURL' = Image URL.
  'Clbk' = Callback.
    Clbk(Cvs), 'Cvs' = Canvas element object.
  'Rng' = 5; // 'Rng' = Range of blur. optional, default 4. */
function ImageBlur (ImgURL, Clbk, Rng) {
  var CanvasUse,
      Img;

  if (!ImgURL || typeof ImgURL !== 'string' || typeof Clbk !== 'function')
  { return; }

  if (!isNaN(Rng) || Rng < 0)
  { Rng = 5; }

  CanvasUse = function ()
    {
      var A = new Date(),
          B;

      var Cvs = document.createElement('canvas'),
          Ctx,
          ImgData,
          NewImgData,
          MaxX,
          MaxY,
          OldBf32, // 'OldBf32' = old 32 bits unit buffer.
          NewBf32,
          i;

      Cvs.width = this.naturalWidth;
      Cvs.height = this.naturalHeight;
      Ctx = Cvs.getContext('2d');

      Ctx.drawImage(Img, 0, 0);

      ImgData = Ctx.getImageData(0, 0, Cvs.width, Cvs.height);
      MaxX = ImgData.width - 1;
      MaxY = ImgData.height - 1;
      OldBf32 = new Uint32Array(ImgData.data.buffer);
      NewBf32 = new Uint32Array(ImgData.width * ImgData.height);
      i = OldBf32.length - 1;

      do
      {
        var R = 0,
            G = 0,
            B = 0,
            PxlLth = 0,
            NowX = i % ImgData.width,
            NowY = i / ImgData.width | 0,
            j;

        for (j = Rng * -1; j <= Rng; j++)
        {
          var X = NowX + j,
              k;

          for (k = Rng * -1; k <= Rng; k++)
          {
            var Y = NowY + k,
                PxlSk = (X < 0 || Y < 0 || X > MaxX || Y > MaxY) ? -1 : (Y * ImgData.width + X), // 'PxlSk' = Pixel after Seeking.
                OldPxl;

            if (PxlSk === -1)
            { continue; }

            OldPxl = OldBf32[PxlSk];
            R += OldPxl & 0x000000ff; // R
            G += (OldPxl & 0x0000ff00) >>> 8; // G
            B += (OldPxl & 0x00ff0000) >>> 16; // B
            PxlLth++;
          }
        }

        NewBf32[i] =
          (R / PxlLth | 0) +
          ((G / PxlLth | 0) << 8) +
          ((B / PxlLth | 0) << 16) +
          0xff000000;
      }
      while (i--);

      NewImgData = new Uint8ClampedArray(NewBf32.buffer);

      ImgData.data.set(NewImgData);
      Ctx.putImageData(ImgData, 0, 0);

      B = new Date();

      console.log([A, B, B.getTime() - A.getTime()]);

      Clbk(Cvs);
    };

  Img = new Image();
  Img.onload = CanvasUse;
  Img.src = ImgURL;
}

//==== jQuery Independent Module ==============================================================================================

/* set all element matched with given CSS selector string to be Button0 objects,
   even if the object is not created yet.
  'CSSS' = CSS Selector string.
  Return: 'Button0' element JQuery objects, or null.
  Need: JQuery API, CSSAdd(). */
function Button0 (CSSS)
{
  if (typeof CSSS !== 'string')
  {
    alert('Set \'Button0\' object failed. Please check out passing values.');
    return null;
  }

  CSSS = Trim(CSSS);

  var CSSStr = "\n" + CSSS +
               ' { display: inline-block; min-width: 20px; padding: 1px 3px; border: 1px solid #c0c0c0; ' +
                  'border-radius: 3px; vertical-align: top; cursor: pointer; color: #404040; ' +
                  'background-image: -webkit-linear-gradient(#90c0f0, #e0f0f0); ' +
                  'background-image: linear-gradient(0deg, #90c0f0, #e0f0f0); }' +
               "\n" + CSSS + ':hover' +
               ' { background-image: -webkit-linear-gradient(#b0d0f0, #f0f0ff); ' +
                  'background-image: linear-gradient(0deg, #b0d0f0, #f0f0ff); }' +
               "\n" + CSSS + ':active' +
               ' { color: #808080; padding: 2px 3px 0px 3px; ' +
                  'background-image: -webkit-linear-gradient(#f0f0ff, #b0d0f0); ' +
                  'background-image: linear-gradient(0deg, #f0f0ff, #b0d0f0); }' +
               "\n" + CSSS + '.Lock' +
               ' { color: #f0f0f0; padding: 1px 3px; cursor: default; ' +
                  'background-image: -webkit-linear-gradient(#808080, #f0f0f0); ' +
                  'background-image: linear-gradient(0deg, #808080, #f0f0f0); }' +"\n";

  CSSAdd(CSSStr, 'Button0');

  $('body').on('mouseenter', CSSS, function(Evt){ Initialize(Evt.currentTarget); })
           .on('focus', CSSS, function(Evt){ Initialize(Evt.currentTarget); })
           .find(CSSS).each(function(){ Initialize(this); });

  return 0;

  function Initialize(Obj)
  {
    if (typeof Obj.LckFlg === 'boolean')
    { return; }

    $(Obj).attr('autocomplete', 'off');

    Obj.LckFlg = false; // 'LckFlg' = Locked Flag.
    Obj.Lock = Lock;
    Obj.Unlock = Unlock;
  }

  function Lock()
  {
    if (this.LckFlg)
    { return; }
    this.LckFlg = true;

    $(this).addClass('Lock')
           .prop('disabled', true);
  }

  function Unlock()
  {
    if (!this.LckFlg)
    { return; }
    this.LckFlg = false;

    $(this).removeClass('Lock')
           .prop('disabled', false);
  }
}

/* set a Tab Box.
  'BxOS' = Box as a DOM Object, or a JQuery Selector, must be a container.
  'TbCSSS' = Tab CSS Selector.
  'PrmIdx' = Prime Index. optional, default 0.
  'TbSwF(OO, NO)' = Tab Switch Function. optional.
    'OO' = Old tab JQuery Object.
    'NO' = Now tab JQuery Object.
  'HshKy' = Hash Key string.
  Return: Tab Box JQuery object, or null as error.
  Need: CSSAdd function.
  Notice: tab name is decide by attribute data-tab-name, name or the index of the tab themself. */
function TabBox (BxOS, TbCSSS, PrmIdx, TbSwF, HshKy)
{
  if (typeof BxOS === 'undefined' || typeof TbCSSS !== 'string')
  {
    alert('Tab Bx initialize failed.');
    return null;
  }

  if (typeof PrmIdx !== 'number' || PrmIdx < 0)
  { PrmIdx = 0; }

  if (typeof TbSwF !== 'function')
  { TbSwF = function(OO, NO){}; }

  var Bx = $(BxOS).data('IdxRcd', [-1, -1]),
      CtxAJO = $(TbCSSS),
      TbTlt = $('<li/>'),
      CSSStr = '';

  var TbBx = Bx.prepend('<ul/>')
               .children('ul:first');

  CSSStr = BxOS + " > ul { margin: 0px; padding: 0px; }\n" +
           BxOS + ' > ul > li { display: inline-block; position: relative; margin: 0px 2px; padding: 2px 2px 0px 2px; ' +
                               'border: 1px solid rgba(160, 160, 160, 0,9); border-bottom: 0px; vertical-align: bottom; ' +
                               "cursor: pointer; }\n" +
           BxOS + " > ul > li.PckTb { top: 1px; font-size: 20px; }\n" +
           TbCSSS + ' { display: none; min-height: 100px; border-width: 1px; }';

  CSSAdd(CSSStr);

  if (typeof HshKy !== 'string' || HshKy.length === 0)
  {
    CtxAJO.each(function(Idx)
      {
        var This = $(this),
            TbNmA = [This.data('tabName'), This.attr('name')];

        var Tb = TbTlt.clone()
                      .text(TbNmA[0] ? TbNmA[0] : (TbNmA[1] ? TbNmA[1] : Idx.toString()))
                      .appendTo(TbBx);
      });

    TbBx.on('click', '>  li', ClickToTabSwitch);
  }
  else
  {
    var Hsh = window.location.hash.replace(/^#/, ''),
        RE = new RegExp(HshKy + '\\d+,?', 'g'),
        MchA = Hsh.match(RE);

    if (MchA !== null)
    {
      MchA = MchA[MchA.length - 1].match(/\d+/);
      PrmIdx = parseInt(MchA[0], 10);
    }

    CtxAJO.each(function(Idx)
      {
        var This = $(this),
            TbNmA = [This.data('tabName'), This.attr('name')];

        var Tb = TbTlt.clone()
                      .text(TbNmA)
                      .attr('name', HshKy + Idx.toString())
                      .appendTo(TbBx);
      });

    TbBx.on('click', '> span', HashToTabSwitch);
    $(window).on('hashchange', HashTrigger);
  }

  TabSwitch(TbBx.children('li:eq(' + PrmIdx + ')'));

  return Bx;

  function ClickToTabSwitch(Evt)
  {
    TabSwitch($(this));
  }

  function HashToTabswitch(Evt)
  {
    var This = $(this),
        Idx = This.index(),
        Hsh = window.location.hash.replace(/^#/, '');

    if (Hsh.length === 0)
    {
      window.location = '#' + HshKy + Idx.toString();

      return 0;
    }

    var RE = RegExp(HshKy + '\\d+,?', 'g'),
        MchA = Hsh.match(RE);

    if (MchA !== null)
    { Hsh = Hsh.replace(RE, ''); }

    if (Hsh.length > 0)
    { window.location = '#' + Hsh.replace(/,$/, '') + ',' + HshKy + Idx.toString(); }
    else
    { window.location = '#' + HshKy + Idx.toString(); }
  }

  function HashTrigger(Evt)
  {
    var Hsh = window.location.hash.replace(/^#/, '');

    if (Hsh.length === 0)
    {
      TabSwitch(TbBx.children(':first'));

      return 0;
    }

    var RE = RegExp(HshKy + '\\d+,?', 'g'),
        MchA = Hsh.match(RE),
        Idx = 0;

    if (MchA !== null)
    { Idx = parseInt(MchA[MchA.length - 1].match(/\d+/), 10); }

    TabSwitch(TbBx.children(':eq(' + Idx.toString() + ')'));
  }

  function TabSwitch(JO)
  {
    var This = JO,
        Idx = This.index(),
        Rcd = Bx.data('IdxRcd');

    if (Rcd[1] === Idx)
    { return 0; }

    var NO = This,
        OO = NO.siblings('.PckTb').removeClass('PckTb');

    NO.addClass('PckTb');

    Rcd[0] = Rcd[1];
    Rcd[1] = Idx;

    Bx.data('IdxRcd', Rcd);
    CtxAJO.eq(Rcd[1]).show();

    if (Rcd[0] >= 0)
    { CtxAJO.eq(Rcd[0]).hide(); }

    TbSwF(OO, NO);
  }
}

/* set a HTML element to be a Item Lister object.
  'BxOS' = Box DOM Object, JQuery Selector.
  'URL' = service URL.
  'Lmt' = Limit number of one page, give < 1 as no limit.
  'Data' = post Data, a JSON.
  'OneItmF(OneData, Idx)' = One Item build Function.
    'OneData' = One Data from server.
    'Idx' = Index of Data.
    Return: DOM to append to 'BxOS' DOM.
  'SkpIdxFlg' = Skip page Index Flag, optional, give true to skipping build page index tags.
  'IdxCls' = Index Class. optional. give empty array to skip page index tags builded.
    'IdxCls[0]' = normal class name, give non-string to ignore this state setting.
    'IdxCls[1]' = disable class name, give non-string to ignore this state setting.
  'AftItmsF(Cnt, Data)' = After Items build Function. optional
    'Cnt' = Count of data.
    'Data' = origin Data array.
  Return: JQuery object of 'BxOS'.
  Need: ObjectCombine(). */
function ItemList (BxOS, URL, Lmt, Data, OneItmF, IdxCls, AftItmsF)
{
  if (typeof BxOS === 'undefined' || typeof URL !== 'string' || isNaN(Lmt) || typeof Data !== 'object' ||
     typeof OneItmF !== 'function')
  {
    alert('Create a \'ItemList\' failed. Please check out passing values.');
    return null;
  }

  Lmt = parseInt(Lmt, 10);
  if (Lmt < 1)
  { Lmt = 0; }

  var Bx = $(BxOS),
      BxDOM = Bx.get(0),
      NwPg = 0,
      PgTgRng = 2,
      TtlCnt = 0,
      MxPg = 0;

  BxDOM.PageGet = OnePageList;
  BxDOM.Recount = TotalCount;
  BxDOM.LimitSet = LimitSet;

  TotalCount(function(){ OnePageList(NwPg); });

  if (typeof IdxCls === 'object' && IdxCls.length > 0)
  {
    Bx.on('click', 'div:last-child > span', function(Evt)
        {
          var This = $(Evt.currentTarget),
              Idx = This.attr('name');

          if (Idx < 0 || Idx > MxPg)
          { return 0; }

          if (typeof Idx !== 'undefined')
          { OnePageList(Idx); }
        });
  }

  return Bx;

  function OnePageList(Pg)
  {
    if (isNaN(Pg))
    { return 0; }

    if (typeof Pg === 'string')
    { Pg = parseInt(Pg, 10); }

    var PstData = ObjectCombine(Data, {'Lmt': Lmt, 'Ofst': (Pg * Lmt)}); // 'PstData' = Post Data.

    $.ajax(
      {
        'type': 'POST',
        'dataType': 'json',
        'timeout' : 20000,
        'url': URL,
        'data': PstData,
        // 'beforeSend': function(JQXHR, Set){},
        // 'error' : function(JQXHR, TxtSt, ErrThr){},
        // 'complete' : function(JQXHR, TxtSt){},
        'success': function(Rtn, TxtSt, JQXHR)
          {
            if (Rtn.Index != 0)
            {
              alert(Rtn.Index + ', ' + Rtn.Message);
              return 0;
            }

            NwPg = Pg;
            Bx.empty();

            for (var i in Rtn.Extend)
            { Bx.append(OneItmF(Rtn.Extend[i], i)); }

            PageIndexBuild();

            if (typeof AftItmsF === 'function')
            { AftItmsF((typeof Rtn.Extend === 'undefined') ? 0 : Rtn.Extend.length, Rtn.Extend); }
          }
      });
  }

  /* Count Total number.
    'AftF' = After Function, called after TotalCount() finished. optional. */
  function TotalCount(AftF)
  {
    var PstData = ObjectCombine(Data, {'Cnt': 1, 'Lmt': 0, 'Ofst': 0}); // 'PstData' = Post Data.

    $.ajax(
      {
        'type': 'POST',
        'dataType': 'json',
        'timeout' : 20000,
        'url': URL,
        'data': PstData,
        // 'beforeSend': function(JQXHR, Set){},
        // 'error' : function(JQXHR, TxtSt, ErrThr){},
        // 'complete' : function(JQXHR, TxtSt){},
        'success': function(Rtn, TxtSt, JQXHR)
          {
            if (Rtn.Index != 0)
            {
              alert(Rtn.Index + ', ' + Rtn.Message);
              return 0;
            }

            TtlCnt = isNaN(Rtn.Extend) ? Rtn.Extend.length : Rtn.Extend;
            MxPg = Math.ceil(TtlCnt / Lmt) - 1;

            if (Rtn.Extend == 0)
            {
              PageIndexBuild();
              return 0;
            }

            if (typeof AftF === 'function')
            { AftF(); }
          }
      });
  }

  /* Reset Limit.
    'NwLmt' = New Limit.
    Return: real setting limit. or original limit without change. */
  function LimitSet(NwLmt)
  {
    if (typeof NwLmt !== 'number' || NwLmt < 1)
      return Limit;

    if (NwLmt > 99)
      NwLmt = 99;

    Lmt = NwLmt;

    return Lmt;
  }

  function PageIndexBuild()
  {
    var IdxLst = $('<div/>').appendTo(Bx),
        TC = ['', '']; // 'TC' = Temptory Class.

    if (typeof IdxCls !== 'object' || IdxCls.length === 0)
    { return 0; }

    IdxLst.css({'textAlign': 'center', 'marginTop': 10});

    if (typeof IdxCls[0] === 'string' && IdxCls[0].length > 0)
    { TC[0] = IdxCls[0]; }

    if (typeof IdxCls[1] === 'string' && IdxCls[1].length > 0)
    { TC[1] = IdxCls[1]; }

    /*==== first & prev page tag. ====*/

    $('<span/>').addClass(NwPg > 0 ? TC[0] : TC[1])
                .attr({'name': NwPg > 0 ? 0 : -1, 'title': 1})
                .text('╠')
                .appendTo(IdxLst); // first page.

    $('<span/>').addClass(NwPg == 0 ? TC[1] : TC[0])
                .attr({'name': NwPg - 1})
                .text('◁')
                .appendTo(IdxLst); // prev page.

    /*==== now page tag. ====*/

    var Nw = $('<span/>').addClass(TC[1])
                         .text(NwPg + 1)
                         .appendTo(IdxLst); // 'Nw' = Now page.

    /*==== last & next page tag. ====*/

    $('<span/>').addClass(NwPg == MxPg ? TC[1] : TC[0])
                .attr({'name': NwPg + 1})
                .text('▷')
                .appendTo(IdxLst); // next page.

    $('<span/>').addClass(NwPg < MxPg ? TC[0] : TC[1])
                .attr({'name': NwPg < MxPg ? MxPg : (MxPg + 1), 'title': MxPg + 1})
                .text('╣')
                .appendTo(IdxLst); // last page.

    /*==== prev page tags. ====*/

    var EndRng = PgTgRng,
        Bgn = NwPg - PgTgRng,
        End = NwPg;

    if (Bgn < 0)
    {
      EndRng += (Bgn * -1);
      Bgn = 0;
    }

    for (var i = Bgn; i < End; i++) // prev range page tags.
    {
      $('<span/>').addClass(TC[0])
                  .attr({'name': i})
                  .text(i + 1)
                  .insertBefore(Nw);
    }

    /*==== next page tags. ====*/

    // Bgn = NwPg + PgTgRng;
    Bgn = NwPg + EndRng;
    End = NwPg;

    if (Bgn > MxPg)
    { Bgn = MxPg; }

    for (var i = Bgn; i > End; i--)
    {
      $('<span/>').addClass(TC[0])
                  .attr({'name': i})
                  .text(i + 1)
                  .insertAfter(Nw);
    }
  }
}

/*
  'BxOS' = Box as a DOM Object, or a JQuery Selector, must be a container.
  'OneItmCrt' = One Item Create. function, optional.
  'Cln' = Clean, to clean old list. boolean, optional, default true.
  'AftItmsCrt' = After Items Create. function, optional.
  Return: Box DOM object, or null as error. */
function ItemList2 (BxOS, URL, Data, OneItmCrt, Cln, AftItmsCrt)
{
  var Bx,
      BxDOM;

  if (Is.Undefined(BxOS) || !Is.String(URL) || !Is.Object(Data) || !Is.Function(OneItmCrt))
  {
    console.log('create a \'ItemListV2\' failed. please check out passing values.');

    return null;
  }

  Bx = $(BxOS);

  if (!Bx.length)
  { return null; }

  if (!Is.Number(Data.Lmt) || Data.Lmt < 0)
  { Data.Lmt = 10; }

  if (!Is.Number(Data.Ofst) || Data.Ofst < 0)
  { Data.Ofst = 0; }

  BxDOM = Bx[0];
  BxDOM.URL = URL;
  BxDOM.Data = Data;
  BxDOM.Cln = Is.Boolean(Cln) ? Cln : true;
  BxDOM.NowPage = parseInt(BxDOM.Data.Ofst / BxDOM.Data.Lmt, 10);
  BxDOM.PageGet = PageGet;
  BxDOM.NowPageGet = function () { return this.NowPage; };
  BxDOM.OneItemCreate = OneItmCrt;
  BxDOM.AfterItemsCreate = AftItmsCrt || function () {};

  return BxDOM;

  /*
    'Pg' = Page. optional, default is next page.
    Need: function ObjectCombine. */
  function PageGet(Pg)
  {
    var self = this;

    if (!Is.Number(Pg))
    { Pg = this.NowPage + 1; }

    $.ajax(
      {
        'type': 'POST',
        'dataType': 'json',
        'timeout' : 20000,
        'url': this.URL,
        'data': this.Data,
        // 'beforeSend': function(JQXHR, Set){},
        'error' : function (JQXHR, TxtSt, ErrThr) {},
        // 'complete' : function(JQXHR, TxtSt){},
        'success': function (Rtn, TxtSt, JQXHR)
          {
            var Bx;

            if (Rtn.Index != 0 || !Is.Array(Rtn.Extend))
            {
              alert(Rtn.Index + ', ' + Rtn.Message);

              return;
            }

            Bx = $(self);

            if (self.Cln)
            { Bx.empty(); }

            for (var i = 0; i < Rtn.Extend.length; i++)
            { Bx.append(self.OneItemCreate(Rtn.Extend[i], i)); }

            self.Data.Ofst += self.Data.Lmt;
            self.NowPage = Pg;

            self.AfterItemsCreate(Rtn.Extend.length, Rtn.Extend);
          }
      });
  }
}

/* create a 'Frame' object.
  'PrtOS' =  Parent DOM Object or JQuery Selector.
  'W' = frame Width.
  'H' = frame Height.
  'CtxLdF' = Context Load Function. return DOM to inserted to frame.
  'CSSCls' = CSS Class name.
  'Ttl' = Title. optional.
  'SltBldB' = Silent Build Bool. optional, default false.
  Return: 'Frame' element JQuery object.
  Need: JQuery API, CSSAdd(). */
function Frame (PrtOS, W, H, CtxLdF, CSSCls, Ttl, SltBldB)
{
  var FIBCID = 'FrmIcnBtn'; // 'FIBCID' = Frame Icon Button Class ID.

  if ($('#' + FIBCID).length === 0)
  {
    var II = {'X': 3, 'Y': 2, 'W': 20, 'H': 20}; // 'II' = Icon image Info.

    /*==== component 'Frame' ====*/

    var CSSS = '.' + CSSCls + " > div:first-child { " +
               " padding: 1px 5px; border-radius: 5px 5px 0px 0px; font-size: 18px; border-bottom-width: 1px; " +
               " background-image:         linear-gradient(to bottom, rgba(200, 240, 255, 1), rgba(240, 248, 255, 0.9)); " +
               " background-image: -webkit-linear-gradient(top, rgba(200, 240, 255, 1), rgba(240, 248, 255, 0.9)); }\n" +
               '.' + CSSCls + " { border-width: 1px; border-radius: 5px; box-shadow: -1px 1px 2px; }\n" +
               '.' + CSSCls + " > div:nth-child(2) { padding: 5px; background-color: rgba(240, 240, 240, 0.9); }\n" +
               '.' + CSSCls + " > div:nth-child(3) { padding: 1px 3px; border-top-width: 1px; border-radius: 0px 0px 5px 5px; background-color: rgba(248, 248, 255, 0.9); }\n" +
               '.' + CSSCls + " .FIB { display: inline-block; min-width: 24px; min-height: 24px; margin-left: 3px; border: 1px solid #a0a0a0; border-radius: 3px; background-color: #f0f8ff; box-shadow: 1px -1px 5px #c8f0ff inset; background-image: url(image/frame_icon.png); cursor: pointer; }\n" +
               '.' + CSSCls + " .FIB:hover { color: #ff0000; border-color: #ff0000; }\n" +
               '.' + CSSCls + ' .FIB_Close          { background-position: ' + (II.X)             + 'px ' + (II.Y)                  + "px; }\n" +
               '.' + CSSCls + ' .FIB_Close:hover    { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y - 1)              + "px; }\n" +
               '.' + CSSCls + ' .FIB_Close:active   { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + 1)              + "px; }\n" +
               '.' + CSSCls + ' .FIB_Max            { background-position: ' + (II.X)             + 'px ' + (II.Y + II.H * -1)      + "px; }\n" +
               '.' + CSSCls + ' .FIB_Max:hover      { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + II.H * -1 - 1)  + "px; }\n" +
               '.' + CSSCls + ' .FIB_Max:active     { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + II.H * -1 + 1)  + "px; }\n" +
               '.' + CSSCls + ' .FIB_Resize         { background-position: ' + (II.X)             + 'px ' + (II.Y + II.H * -2)      + "px; }\n" +
               '.' + CSSCls + ' .FIB_Resize:hover   { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + II.H * -2 - 1)  + "px; }\n" +
               '.' + CSSCls + ' .FIB_Resize:active  { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + II.H * -2 + 1)  + "px; }\n" +
               '.' + CSSCls + ' .FIB_Move           { background-position: ' + (II.X)             + 'px ' + (II.Y + II.H * -3)      + "px; }\n" +
               '.' + CSSCls + ' .FIB_Move:hover     { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + II.H * -3 - 1)  + "px; }\n" +
               '.' + CSSCls + ' .FIB_Move:active    { background-position: ' + (II.X + II.W * -1) + 'px ' + (II.Y + II.H * -3 + 1)  + "px; }\n";

    CSSAdd(CSSS, FIBCID);
  }

  if (typeof PrtOS === 'undefined' || typeof W !== 'number' || typeof H !== 'number' || typeof CtxLdF !== 'function' ||
     typeof CSSCls !== 'string' || CSSCls.length === 0)
  {
    alert('Create a \'Frame\' object failed. Please check out passing values.');
    return null;
  }

  if (typeof SltBldB !== 'boolean')
  { SltBldB = false; }

  var Ctnr = $(PrtOS), // 'Ctnr' = Container.
      TgtRtg = {'X': 0, 'Y': 0, 'W': 0, 'H': 0}, // 'TgtRtg' = Target frame Rectangle. use to controll frame moving & resizing.
      PrtFrm = null,
      WthPrtB = false;

  var Frm = $('<span>' +
              '<div><span/><span><span/><span/><span/><span/></span></div>' +
              '<div/>' +
              '</span>').data({'IsMv': false, 'IsRsz': false})
                        .on('click', '> *', function(Evt){ ToFront(); }) // 20121205 by RZ. test new way of Frame view priority.
                        .appendTo(Ctnr);

  var FrmDOM = Frm.get(0);

  var TtlBx = Frm.addClass(CSSCls)
                 .css({'display': 'inline-block', 'position': 'absolute'})
                 .children('div:eq(1)').css({'position': 'relative', 'width': W, 'height': H, 'overflow': 'auto', 'whiteSpace': 'nowrap'})
                                       .end()
                 .children('div:first'); // 'TtlBx' = Title Box.

  TtlBx.css({'position': 'relative', 'minHeight': '28px'})
       // .click(function(Evt){ ToFront(); }) // 20121205 by RZ. test another way.
       .children('span:first').css({'display': 'inline-block'})
                              .text(typeof Ttl === 'string' ? Ttl : '')
                              .end()
       .children('span:last').css({'position': 'absolute', 'right': 3, 'top': 1, 'textAlign': 'right'})
                             .children('span').first().addClass('FIB FIB_Move')
                                                      .attr('title', '移動')
                                                      .on('click', FrameMoveStart)
                                                      .end()
                                              .eq(1).addClass('FIB FIB_Resize')
                                                    .attr('title', '調整大小')
                                                    .on('click', FrameResizeStart)
                                                    .end()
                                              .eq(2).addClass('FIB FIB_Max')
                                                    .attr('title', '最大/復原')
                                                    .on('click', FrameMaxSize)
                                                    .end()
                                              .last().addClass('FIB FIB_Close')
                                                     .attr('title', '關閉')
                                                     .click(FrameClose);

  FrmDOM.ActionExtend = ActionExtend;
  FrmDOM.ToFront = ToFront;
  FrameOpen(Frm, SltBldB);

  return Frm;

  function ToFront()
  {
    var MxZIdx = -1,
        FrmA = [];

    Frm.siblings('.' + CSSCls).each(function(Idx)
      {
        var This = $(this),
            ZIdx = parseInt(This.css('zIndex'), 10);

        MxZIdx = Math.max(MxZIdx, ZIdx);
        FrmA.push({'JO': This, 'ZIdx': ZIdx})
      });

    MxZIdx++;

    if (parseInt(Frm.css('zIndex'), 10) == MxZIdx)
    { return 0; }

    Frm.css('zIndex', MxZIdx);
    FrmA.push({'JO': Frm, 'ZIdx': MxZIdx});

    var C = FrmA.length;

    if (C > 1)
    {
      FrmA.sort(SortByZIndex);

      var FstIdx = FrmA[0].ZIdx;

      if (FrmA[0].ZIdx > 0)
      {
        FrmA[0].JO.css('zIndex', 0);
        FrmA[0].ZIdx = 0;
      }

      for (var i = 1; i < C; i++)
      {
        var GlIdx = FrmA[i - 1].ZIdx + 1;

        if (FrmA[i].ZIdx > GlIdx)
        {
          FrmA[i].JO.css('zIndex', GlIdx);
          FrmA[i].ZIdx = GlIdx;
        }
      }
    }

    return 1;

    function SortByZIndex(OA, OB)
    {
      if (OA.ZIdx === OB.ZIdx)
      { return 0; }

      return (OA.ZIdx > OB.ZIdx ? 1 : -1);
    }
  }

  function FrameOpen(Frm, SltBldB)
  {
    Frm.hide();
    ToFront();

    if (SltBldB)
    {
      Frm.children('div:eq(1)').append(CtxLdF);
      return 0;
    }

    var Rdm = Math.round(Math.random() * 3);

    switch (Rdm)
    {
      case 1:
        Frm.slideDown('normal', function(){ Frm.children('div:eq(1)').append(CtxLdF); });
        break;

      case 2:
        Frm.fadeIn('normal', function(){ Frm.children('div:eq(1)').append(CtxLdF); });
        break;

      case 0:
      default:
        Frm.show('normal', function(){ Frm.children('div:eq(1)').append(CtxLdF); });
    }
  }

  function FrameClose(Evt)
  {
    var Rdm = Math.round(Math.random() * 3);

    switch (Rdm)
    {
      case 1:
        Frm.slideUp('normal', function(){ $(this).remove(); });
        break;

      case 2:
        Frm.fadeOut('normal', function(){ $(this).remove(); });
        break;

      case 0:
      default:
        Frm.hide('normal', function(){ $(this).remove(); });
    }
  }

  function FrameMoveStart(Evt)
  {
    var TL = Frm.offset();

    TgtRtg.X = Evt.pageX - TL.left;
    TgtRtg.Y = Evt.pageY - TL.top;

    ToFront();

    Ctnr.css('cursor', 'move')
        .on('mousemove', FrameMove);

    Frm.css('border', '1px solid rgba(255, 0, 0, 0.7)')
       .data('IsMv', true);

    $(Evt.currentTarget).css('cursor', 'move')
                        .off('click')
                        .on('click', FrameMoveStop);

    return 0;

    function FrameMove(Evt)
    {
      Frm.css({'left': Evt.pageX - TgtRtg.X, 'top': Evt.pageY - TgtRtg.Y});
    }
  }

  function FrameMoveStop(Evt)
  {
    Ctnr.css({'cursor': ''})
        .off('mousemove');

    Frm.css('border', '')
       .data('IsMv', false);

    $(Evt.currentTarget).css('cursor', 'pointer')
                        .off('click')
                        .on('click', FrameMoveStart);
  }

  function FrameResizeStart(Evt)
  {
    var TL = Frm.offset(),
        SzTgt = Frm.children('div:eq(1)');

    TgtRtg.X = Evt.pageX;
    TgtRtg.Y = Evt.pageY;
    TgtRtg.W = SzTgt.width();
    TgtRtg.H = SzTgt.height();

    ToFront();

    Ctnr.css('cursor', 'ne-resize')
        .on('mousemove', FrameResize);

    Frm.css('border', '1px solid rgba(255, 0, 0, 0.7)')
       .data('IsRsz', true);

    $(Evt.currentTarget).css('cursor', 'ne-resize')
                        .off('click')
                        .on('click', FrameResizeStop);

    return 0;

    function FrameResize(Evt)
    {
      var X = Evt.pageX - TgtRtg.X,
          Y = Evt.pageY - TgtRtg.Y,
          W = TgtRtg.W + X,
          H = TgtRtg.H - Y;

      Y += TL.top;

      if (W < 200)
      { W = 200; }

      if (H < 200)
      { H = 200; }
      else
      { Frm.css('top', Y); }

      Frm.children('div:eq(1)').css({'width': W, 'height': H});
    }
  }

  function FrameResizeStop(Evt)
  {
    Ctnr.css({'cursor': ''})
        .off('mousemove');

    Frm.css('border', '')
       .data('IsRsz', false);

    $(Evt.currentTarget).css('cursor', 'pointer')
                        .off('click')
                        .on('click', FrameResizeStart);
  }

  function FrameMaxSize(Evt)
  {
    var Tgt = Frm.children('div:eq(1)'),
        Sz = [Tgt.width(), Tgt.height()],
        Lct = Frm.offset(),
        W = Ctnr.width() - (Frm.outerWidth() - Sz[0]),
        H = $(document).height() - (Frm.outerHeight() - Sz[1]);

    ToFront();

    $(Evt.currentTarget).data('LstSt', {'X': Lct.left, 'Y': Lct.top, 'W': Sz[0], 'H': Sz[1]})
                        .off('click')
                        .on('click', FrameLastSize)
                        .prevAll('span').hide();

    Frm.css({'left': 0, 'top': 0});
    Tgt.css({'width': W, 'height': H});
  }

  function FrameLastSize(Evt)
  {
    var Tgt = Frm.children('div:eq(1)');

    var LstSt = $(Evt.currentTarget).off('click')
                                    .on('click', FrameMaxSize)
                                    .prevAll('span').show()
                                                    .end()
                                    .data('LstSt');

    Frm.css({'left': LstSt.X, 'top': LstSt.Y});
    Tgt.css({'width': LstSt.W, 'height': LstSt.H});
  }

  /* extend action which works with default defined.
    'Cmd' = Command of action.
    'ActnF' = Action Function to extend default.
    Return: 0 as OK, < 0 as error. */
  function ActionExtend(Cmd, ActnF)
  {
    if (typeof Cmd !== 'string' || Cmd.length === 0 || typeof ActnF !== 'function')
    { return -1; }

    var TtlBtn = TtlBx.find('> span:last > span');

    switch (Cmd)
    {
      case 'CloseButtonClick':
        TtlBtn.last().off('click')
                     .on('click', function(Evt){ ActnF(); });
        break;

      case 'SizeChange':
        TtlBtn.eq(1).off('click', SizeChange)
                    .on('click', SizeChange)
                    .end()
              .eq(2).off('click', SizeChange)
                    .on('click', SizeChange);
        break;

      default:
    }

    return 0;

    function SizeChange()
    {
      if (!Frm.data('IsRsz'))
      { ActnF(); }
    }
  }
}

//======================================================================================================================
