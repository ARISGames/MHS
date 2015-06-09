<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width; initial-scale=1.0 maximum-scale=1.0 user-scalable=no;"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Trading Post</title>
<link href="style.css" rel="stylesheet" type="text/css"></link>

<script type="text/javascript">
    var ARIS = {};//Get ARIS variable existant ASAP just to keep things simple
</script>

<script type="text/javascript" src="model.js"></script>
<script type="text/javascript" src="views.js"></script>
<script type="text/javascript">
var gameId = webHookId = npcId = function(id){return id;};

var shm;
var shv;

var readyCount = 2;
function partReady() { readyCount--; if(readyCount == 0) begin(); }
ARIS.ready = function() { partReady(); };


function begin()
{
    shm = new SodHouseModel();
    shv = new SodHouseViews();
    shm.loadStateFromARIS(stateReceived);
}

function stateReceived()
{
    ARIS.didUpdateItemQty = function(updatedItemId,qty) //simplify item updates after initial state received
    {
        if(o = shm.itemForItemId(updatedItemId)) o.qty = qty;
    }

    shv.displayVid();
}


var timevidstarted = new Date();
function vidComplete()
{  
    //log that vid was skipped
    var timevidskipped = new Date();
    var secondselapsed = ((timevidskipped-timevidstarted)/1000);
    if(secondselapsed < 20)
    {
        //var xmlhttp;
        //xmlhttp=new XMLHttpRequest();
        //xmlhttp.open("GET","http://arisgames.org/server/json.php/v1.webhooks.setWebHookReq/"+gameId(5252)+"/"+webHookId(992)+"/0/"+shm.player.playerId,true); 
        //xmlhttp.send();
    }

    ARIS.exitToCharacter(npcId(37030));
}

window.addEventListener('load', partReady, false);
window.onerror = function(msg, url, linenumber) 
{
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
};
</script>
</head>

<body class='full_screen'>

<div id='loading' class='full_screen'>&nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...</div>

<div id='vid' class='full_screen'>
    <video id="vidfile" width="320" height="504" webkit-playsinline>
        <source src="assets/intro.mp4" type="video/mp4">
    </video>
    <div class='bottombutton' ontouchstart='vidComplete();'>
        <img src='assets/forward_arrow.png' class='forwardarrow' />
    </div>
</div>

</body>
</html>

