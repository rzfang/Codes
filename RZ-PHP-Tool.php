<?php
//==== Other Tool ======================================================================================================

/* Make a Random Serial.
  '$Lth' = Length.
  '$St' = Start.
  '$Dst' = Distance between units before and after.
  Return: Array of random serial. */
function RandomSerial($Lth, $St = 0, $Dst = 1)
{
  $A = array(); // '$A' = Array.

  for ($i = 0; $i < $Lth; $i++)
    $A[$i] = $St + ($i * $Dst);

  for ($i = 0; $i < $Lth; $i++)
  {
    for ($j = ($i + 1); $j < $Lth; $j++)
    {
      $R = mt_rand($j, $Lth - 1);
      $T = $A[$i];
      $A[$i] = $A[$R];
      $A[$R] = $T;
    }
  }

  return $A;
}

/* Write log to a log file.
  Need define 'LOG_LEVEL', 'LOG_PATH', or use default.
  '$Lv' = Level.
  '$Msg' = Message.
  '$Pth' = Log File Path.
  Return: 0 as OK, < 0 as error, > 0 as fine, but not log. */
function DevLog($Lv, $Msg, $Pth = "")
{
  if (!is_numeric($Lv) || !is_string($Msg))
    return -1;

  // Default log level is 'Info'.
  if (!defined('LOG_LEVEL'))
    define('LOG_LEVEL', 2);

  if ($Lv > LOG_LEVEL)
    return 1;

  $LvFlg = "";

  switch ($Lv)
  {
    case 0:  $LvFlg = '[ERROR]'; break;
    case 1:  $LvFlg = '[WARN ]'; break;
    case 2:  $LvFlg = '[INFO ]'; break;
    case 3:  $LvFlg = '[DEBUG]'; break;
    case 4:  $LvFlg = '[FULL ]'; break;
    default: $LvFlg = '[?????]'; break;
  }

  $Log = date('YmdHis  ') . GetIP() . '  ' . $LvFlg . '  ' . $Msg . "\n";

  if (!defined('LOG_PATH'))
    define('LOG_PATH', "./");

  $FP = LOG_PATH . date('YW') . '-DevLog.txt'; // '$FP' = File Path.
  $FR = @fopen($FP, 'w'); // '$FR' = File Resource.

  if ($FR == false)
    return -2;

  if (!@flock($FR, LOCK_EX))
  {
    fclose($FR);
    return -3;
  }

  @fwrite($FR, $Log);
  @flock($FR, LOCK_UN);
  @fclose($FR);

  return 0;
}

/* Create a UUID format string.
  '$B32' = UUID be 32 bits, without '-' in default 36 bits.
  Return: UUID format string. */
function UUID($B32 = false)
{
  $ID = md5(uniqid(mt_rand(), true));

  if ($B32)
    return $ID;

  return substr($ID, 0, 8) . '-' . substr($ID, 8, 4) . '-' . substr($ID, 12, 4) . '-' . substr($ID, 16, 4) . '-' .
         substr($ID, 20, 12);
}

/* print a image file stream. call this will end the process immediately.
  Notice: this will register a session value named 'ImgCd'. */
function CodeImage ()
{
  if (session_id() === '')
    session_start();

  $BgClrA = array(0x00ffc0c0, 0x00c0ffc0, 0x00c0c0ff, 0x00ffffc0, 0x00ffc0ff, 0x00c0ffff); // '$BgClrA' = Background Color Array.
  $ClrIdx = array_rand($BgClrA);
  $Str = '';

  $IvtClr = ((255 - (($BgClrA[$ClrIdx] & 0x00ff0000) >> 16)) << 16) +
            ((255 - (($BgClrA[$ClrIdx] & 0x0000ff00) >> 8)) << 8) +
            (255 - ($BgClrA[$ClrIdx] & 0x000000ff));

  $Img = imagecreatetruecolor(100, 20);

  imagefill($Img, 0, 0, $BgClrA[$ClrIdx]); // background color set.

  for ($i = 0; $i < 5; $i++)
  {
    $Chr = chr(mt_rand(65, 90));
    $Str .= $Chr;

    imagestring($Img, 5, $i * 20 + 5, 3, $Chr, $IvtClr);
  }

  $_SESSION['ImgCd'] = $Str;

  for ($i = 0; $i < 100; $i++)
    imagesetpixel($Img, mt_rand(1, 98), rand(1, 18), $IvtClr);

  header('Content-type: image/png');
  imagepng($Img);
  imagedestroy($Img);

  exit;
}

//==== String Tool =====================================================================================================

/* check if a string is a URL.
  '$Str' = String for checking.
  Return: true / false. */
function IsURL($Str)
{
  if (!is_string($Str) || empty($Str))
    return false;

  $RERst = preg_match('/^https?:\/\/\S+$/', $Str);

  if ($RERst !== 1)
    return false;

  return true;
}

function IsEMail($MlStr)
{
  if (empty($MlStr) || !is_string($MlStr))
    return false;

  //==== version 1. ====

  // $Chk = preg_match("/^[\w.]+@.{2,16}\.[0-9a-z]{2,3}$/", $MlStr);

  // return $Chk > 0 ? true : false;

  //==== version 2. ====

  return filter_var($MlStr, FILTER_VALIDATE_EMAIL);
}

function IsTimeStamp($TmStr)
{
  if (empty($TmStr) || !is_string($TmStr))
    return false;

  $Chk = preg_match("/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/", $TmStr);

  return $Chk > 0 ? true : false;
}

/* Check is a string is UUID.
  '$B32' = UUID be 32 bits, without '-' in default 36 bits.
  Return: UUID format string. */
function IsUUID($IDStr, $B32 = false)
{
  if (empty($IDStr) || !is_string($IDStr))
    return false;

  $Chk = 0;

  if (!is_bool($B32) || !$B32)
    $Chk = preg_match("/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/", $IDStr);
  else
    $Chk = preg_match("/^[0-9a-fA-F]{32}$/", $IDStr);

  return $Chk > 0 ? true : false;
}

/* Response a XML from ajax request.
  '$Idx' = Index.
  '$Msg' = Message.
  '$Ext' = Extend String.
  Return: XML format string of result. */
function XMLString($Idx, $Msg, $Ext = "")
{
  header('content-type: text/xml; charset=utf-8');

  $Str = '<?xml version=\"1.0\" encoding=\"utf-8\"?>' .
         '<Result><Index>' . $Idx . '</Index><Message>' . $Msg . '</Message>';

  if (!empty($Ext) && is_string($Ext))
    $Str .= '<Extend>' . $Ext . '</Extend>';

  $Str .= "</Result>\n";

  return $Str;
}

/* response a JSON from ajax request.
  '$Idx' = Index.
  '$Msg' = Message.
  '$Ext' = Extend Array.
  '$ExtNm' = Extend key name.
  Return: JSON format string of result. */
function JSONString($Idx, $Msg, $Ext = null, $ExtNm = '')
{
  $Arr = array();
  $Arr['Index'] = $Idx;
  $Arr['Message'] = $Msg;

  if ($Ext !== null)
  {
    if (empty($ExtNm) || !is_string($ExtNm))
      $Arr['Extend'] = $Ext;
    else
      $Arr[$ExtNm] = $Ext;
  }

  return json_encode($Arr);
}

/* Encode or Decode a String.
  '$Str' = String to encode / decode.
  '$Ecd' = flag to Encode or decode.
  Return: Encode / Decode string. or empty string as error. */
function StringEnDeCode($Str, $Ecd = true)
{
  if (!is_string($Str) || empty($Str))
    return '';

  if (!is_bool($Ecd))
    $Ecd = true;

  $EnDeStr = ''; // '$EnDeStr' = Encode / Decode String.

  if ($Ecd)
    $EnDeStr = str_replace('=', '', base64_encode(rawurlencode($Str)));
  else
    $EnDeStr = rawurldecode(base64_decode($Str));

  return $EnDeStr;
}

/* parse & replace value to string with number symbol ?*?.
  '$Str' = String to parse.
  '&$VA' = Value Array, which are replaceing for '$Str'. passing by reference for skipping large memory useed.
  Return: result string, or '' as error. */
function SymbolString ($Str, &$VA)
{
  if (empty($Str) || !is_string($Str) || !is_array($VA))
    return '';

  foreach($VA as $K => $V)
  {
    $Tgt = '?' . ($K + 1) . '?';
    $Str = str_replace($Tgt, $V, $Str);
  }

  return $Str;
}

//==== File Tool =======================================================================================================

/* Pick a random file name by give a directory.
  '$FP' = File Path.
  '$FFE' = Filter File Extension, ex: 'txt'.
  Return: a file name, or empty string. */
function RandomFile($FP, $FFE = '')
{
  if (empty($FP) || !file_exists($FP))
    return '';

  $TFL = scandir($FP, 1); // '$TFL' = Temp File List.

  if ($TFL == false)
    return "";

  array_pop($TFL);
  array_pop($TFL);

  if (empty($FFE) || preg_match('/^\w{2,4}$/', $FFE) == 0)
    return $TFL[array_rand($TFL)];

  $FFE = strtolower($FFE);
  $FL = array(); // '$FL' = File List.
  $EL = strlen($FFE); // '$EL' = Extension Length.

  foreach($TFL as $K => $V)
  {
    $Ext = substr($V, (strlen($V) - $EL));
    $Ext = strtolower($Ext);

    if ($Ext == $FFE)
      $FL[] = $V;
  }

  if (count($FL) == 0)
    return '';

  return $FL[array_rand($FL)];
}

/* Parse XML file to be SimpleXML object.
  '$FP' = File Path.
  '$BeArr' = Be Array, true: parse to be array, slow; false: origin object, fast.
  Return: SimpleXML object, or Array, or null as error. */
function SXFileParse($FP, $BeArr = true)
{
  if (!is_file($FP) || !is_bool($BeArr))
    return null;

  $SX = simplexml_load_file($FP);
  $Rst = null;

  if ($BeArr)
  {
    $JSON = json_encode($SX);
    $Rst = json_decode($JSON, true);
  }
  else
    $Rst = $SX;

  return $Rst;
}

/* get Image Mime Type From file binary stream. this function is found from internet, it's fantastic.
  '$Str' = Stream of file.
  Return: mime type string. */
function ImageMimeTypeFromStream($Str)
{
  $Ht = 0; // '$Ht' = Hits.

  if (!preg_match('/\A(?:(\xff\xd8\xff)|(GIF8[79]a)|(\x89PNG\x0d\x0a)|(BM)|(\x49\x49(\x2a\x00|\x00\x4a))|(FORM.{4}ILBM))/',
                 $Str, $Ht))
      return 'application/octet-stream';

  $Tp = array(1 => 'image/jpeg',
              2 => 'image/gif',
              3 => 'image/png',
              4 => 'image/x-windows-bmp',
              5 => 'image/tiff',
              6 => 'image/x-ilbm');

  return $Tp[count($Ht) - 1];
}

/* print Image File stream to standard Out. the process will be end immediately after this called.
  '$FlPth' = File Path.
  Return: 0 as OK, < 0 as error.
  Need: GD library. */
function ImageFileOut($FlPth)
{
  $TFP = WEB_PTH . 'www/image/null.png'; // '$TFP' = Temp File Path.

  if (!is_file($FlPth))
  {
    $FlPth = $TFP;

    if (!is_file($FlPth))
    {
      header ('HTTP/1.0 404 Not Found');
      exit;
    }
  }

  $MT = mime_content_type($FlPth); // '$MT' = Mime Type.
  $I = imagecreatefrompng($FlPth);

  header("Content-Type: $MT");

  switch ($MT)
  {
    case 'image/png':
      header('Content-Disposition: Attachment; filename=Image.png');
      imagealphablending($I, false); // conside some enviroment out of handle, set it to make sure.
      imagesavealpha($I, true);
      imagepng($I);
      break;

    case 'image/gif':
      header('Content-Disposition: Attachment; filename=Image.gif');
      imagegif ($I);
      break;

    case 'image/jpeg':
    default:
      header('Content-Disposition: Attachment; filename=Image.jpg');
      imagejpeg($I);
  }
  imagedestroy($I);

  exit;
}

/* recursive scan and list file / directory by given path.
  '$RtPth' = Root Path to scan.
  '$Tp' = Type, optional, default 0 as file & directory, 1 as file only, 2 as directory only.
  Return: array of file / directory full path, or empty array as error. */
function FileList ($RtPth, $Tp = 0)
{
  if (empty($RtPth) || !is_dir($RtPth))
    return array();

  if (substr($RtPth, -1) != '/')
    $RtPth .= '/';

  if (empty($Tp) || !is_numeric($Tp) || $Tp < 0)
    $Tp = 0;

  $TA = array_slice(scandir($RtPth, 0), 2);
  $FA = array();
  $DA = array();

  foreach($TA as $V)
  {
    $TP = $RtPth . $V;

    if (is_file($TP))
      $FA[] = $TP;
    else if (is_dir($TP))
      $DA[] = $TP . '/';
  }

  $RA = array();

  foreach($DA as $V)
    $RA = array_merge($RA, FileList($V, $Tp));

  if ($Tp == 1)
    $RA = array_merge($FA, $RA);
  else if ($Tp == 2)
    $RA = array_merge($DA, $RA);
  else
    $RA = array_merge($FA, $DA, $RA);

  return $RA;
}

//==== HTTP Tool =======================================================================================================

/* Try to get client IP.
  Return: getting IP. */
function GetIP()
{
  if (isset($_SERVER['HTTP_CLIENT_IP']))
    return $_SERVER['HTTP_CLIENT_IP'];
  else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
    return $_SERVER['HTTP_X_FORWARDED_FOR'];
  else if (isset($_SERVER['REMOTE_ADDR']))
    return $_SERVER['REMOTE_ADDR'];
  else
    return 'none';
}

/* check if the service request Is AJAX.
  Return: true | false. */
function IsAJAX()
{
  return (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && ($_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest'));
}

/* Pack Return data from server to client, or origin data when asked.
  '$Cd' = Code of result.
  '$Msg' = Message.
  '$Ext' = Extend data. optional, default null.
  '$RtnMd' = Return Mode by manual. optional, 0: default in status, 1: origin data, 2: JSON string, 3: array($Cd, $Msg).
  Return: JSON string of data in AJAX mode | data itself.
  Need: IsAJAX(), JSONString(). */
function ReturnPack($Cd, $Msg, $Ext = null, $RtnMd = 0)
{
  $Md = (!is_numeric($RtnMd) || $RtnMd < 0 || $RtnMd > 3) ? 0 : $RtnMd;

  switch ($Md)
  {
    case 0:
      if (IsAJAX())
        return JSONString($Cd, $Msg, $Ext);
      return $Ext;

    case 1:
      return $Ext;

    case 2:
      return JSONString($Cd, $Msg, $Ext);

    case 3:
      return array('Idx' => $Cd, 'Msg' => $Msg);
  }
}

/* print a HTML code include Javascript code to work immediately after page load.
  it alert a message and turn to another page.
  '$Msg' = Message string.
  '$URL' = target URL to go to.
  Return: 0 as OK, < 0 as error.
  Need: IsURL().
  Notice: this must be called in the end of whole process. */
function AlertTurn($Msg, $URL)
{
  if (empty($Msg) || !is_string($Msg) || empty($URL) || !is_string($URL))
    return -1;

  $Msg = str_replace("'", "\'", $Msg);
  $Msg = str_replace("\n", '\n', $Msg);

  $Str = <<<HTML
<html>
  <head>
    <title>Page</title>
    <script type="text/javascript">
    <!--
      alert('$Msg');
      window.location = '$URL';
    -->
    </script>
  </head>
  <body></body>
</html>
HTML;

  echo $Str;

  return 0;
}

/* print a HTML code include Javascript code to work immediately after page load.
  '$Msg' = Message.
  '$URL' = page URL to turn to.
  '$Mlscd' = Millisecond. optional, default 3000.
  Return: 0 as OK, < 0 as error.*/
function TimeOutTurn($Msg, $URL, $Mlscd = 3000)
{
  if (empty($Msg) || !is_string($Msg) || empty($URL) || !is_string($URL))
    return -1;

  if (!is_numeric($Mlscd))
    $Mlscd = 3000;

  if ($Mlscd < 0)
    $Mlscd = 0;

  $Str = <<<HTML
<html>
  <head>
    <title>Page</title>
    <script type="text/javascript">
    <!--
      setTimeout(function(){ window.location = '$URL'; }, $Mlscd);
    -->
    </script>
  </head>
  <body>
    <pre>$Msg</pre>
  </body>
</html>
HTML;

  echo $Str;

  return 0;
}

/* get data.
  '$URL' = URL provided XML data.
  '$HdA' = Header Array.
  Return: Simple XML object, or null as error.
  Need: IsURL(). */
function CURLDataGet($URL, $HdA = array())
{
  if (!IsURL($URL))
    return null;

  $C = curl_init();
  $OptnA = array(CURLOPT_URL => $URL,
           CURLOPT_RETURNTRANSFER => true);

  curl_setopt_array($C, $OptnA);

  if (!empty($HdA) && is_array($HdA))
    curl_setopt($C, CURLOPT_HTTPHEADER, $HdA);

  $Rst = curl_exec($C);

  curl_close($C);

  $SX = simplexml_load_string(trim($Rst));

  if (empty($SX))
    return null;

  return $SX;
}

/* handle the error message shown or hidden. this will start the session.
  'DvMd' = Developement mode. optional, default false */
function ErrorHintHandle ($DvMd = false)
{
  if (session_id() === '')
    session_start();

  if ($DvMd || (isset($_SESSION[SSN_ERR_HNT]) && $_SESSION[SSN_ERR_HNT]))
  {
    ini_set('display_errors', 1);
    ini_set('error_reporting', E_ALL);
  }
  else
  {
    ini_set('display_errors', 0);
    ini_set('error_reporting', E_ERROR);
  }
}

//======================================================================================================================
?>

