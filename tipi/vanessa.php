<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width; initial-scale=1.0 maximum-scale=1.0 user-scalable=no;"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Tipi</title>
<link href="style.css" rel="stylesheet" type="text/css"></link>

<script type="text/javascript">
    var ARIS = {};//Get ARIS variable existant ASAP just to keep things simple
</script>

<script type="text/javascript" src="model.js"></script>
<script type="text/javascript" src="views.js"></script>
<script type="text/javascript">
var game_id = webHookId = npcId = function(id){return id;};

var shv;

var readyCount = 2;
function partReady() { readyCount--; if(readyCount == 0) begin(); }
ARIS.ready = function() { partReady(); };

function begin()
{
    shv = new TipiViews();
    shv.displayVid();
    document.getElementById('vidfile').addEventListener('ended', vidComplete, false);
}

function restartVideo()
{
    document.getElementsByClassName('replaybutton')[0].classList.add('invisible');
    document.getElementById('vidfile').currentTime = 0;
    document.getElementById('vidfile').play();
}
function vidComplete()
{
    document.getElementsByClassName('bottombutton')[0].classList.remove('invisible');
    document.getElementsByClassName('replaybutton')[0].classList.remove('invisible');
}
function continueButton()
{
    ARIS.exitToCharacter(npcId(48487));
}

document.addEventListener( "DOMContentLoaded", partReady, false );
window.onerror = function(msg, url, linenumber) 
{
    //alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
};
</script>
</head>

<body class='full_screen'>

<div id='loading' class='full_screen'>&nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...</div>

<div id='vid' class='full_screen'>
    <video id="vidfile" width="320" height="504" webkit-playsinline>
        <source src="assets/vanessa.mp4" type="video/mp4">
    </video>
    <div class='bottombutton invisible' ontouchstart='continueButton();'>
        <img src='assets/forward_arrow.png' class='forwardarrow' />
    </div>
    <div class='replaybutton invisible' ontouchstart='restartVideo();'>
        <img src='assets/forward_arrow.png' class='forwardarrow' />
    </div>
</div>

</body>
</html>

