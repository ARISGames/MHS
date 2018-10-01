<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width; initial-scale=1.0 maximum-scale=1.0 user-scalable=no;"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Tipi</title>
<style type="text/css">

div,span,html,body
{
    padding:0px;
    margin:0px;
    overflow:visible;
}

body
{
    user-select:none;
    -webkit-user-select:none;
    font-family:"HelveticaNeue-Light","Helvetica Neue Light","Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;
}

.full_screen
{
    width:320px;
    height:504px;
    position:absolute; 
    top:0px;
    left:0px;
    overflow:hidden;
    background-size:320px 504px;
}

#vid
{
    display:none;
}

.bottombutton
{
    width:320px;
    height:44px;
    position:absolute;
    left:0px;
    bottom:0px;
    border-top:1px solid gray;
    background-color:rgba(255,255,255,0.9);
}

.invisible
{
    display: none;
}

.bottombuttontext
{
    position:absolute;
    right:40px;
    top:5px;
    font-size:25px;
}

.forwardarrow
{
    display:block;
    width:24px;
    position:absolute;
    right:10px;
    bottom:10px;
}

.replaybutton
{
    position: absolute;
    left: 103px;
    top: 183px;
    width: 80px;
    height: 80px;
    cursor: pointer;
    background-color: black;
    padding: 20px;
    border-radius: 999px;
}

.replaybutton img
{
    width: 100%;
    height: 100%;
    transform: rotate(0.5turn) translateY(-10px);
}

</style>

<script type="text/javascript">

var ARIS = {};//Get ARIS variable existant ASAP just to keep things simple

// model.js

var TipiModel = function()
{
    var self = this;

    self.game_id = 0; 
    self.player = {};
    self.web_page_id = 0;

    self.currentLevel = 1;

    self.loadStateFromARIS = function(callback)
    {
        var bogusEndOfQueueId = 99999999; //Used to flag the end of the queue

        //Override to handle ARIS responses
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == bogusEndOfQueueId)
                callback();
        };

        ARIS.didReceivePlayer = function(player)
        {
            self.player = player;
        }

        var params = ARIS.parseURLParams(document.URL);
        self.game_id = parseInt(params.game_id);
        self.player.user_id = parseInt(params.user_id);
        self.web_page_id = parseInt(params.web_page_id);

        ARIS.getPlayer();
        ARIS.getItemCount(bogusEndOfQueueId); //Enqueued to signal the queue to 'get state' has sufficiently advanced
    }

    // FIXME dead?
    self.sendRequest = function(fn, callback)
    {
        var xmlhttp;
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET","http://arisgames.org/server/json.php/v1."+fn,true); 
        xmlhttp.onreadystatechange = function()
        {
            if(xmlhttp.readyState == 4&& xmlhttp.status == 200)
                callback(JSON.parse(xmlhttp.responseText).data);
        }
        xmlhttp.send();
    }
}

// views.js

var TipiViews = function()
{
    var self = this;

    self.displayLoading = function()
    {
        document.getElementById('vidfile').pause();
        document.getElementById('vid').style.display     = 'none';
        document.getElementById('loading').style.display = 'block';
    }

    self.displayVid = function()
    {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('vid').style.display     = 'block';
        document.getElementById('vidfile').play();
    }
}

var game_id = webHookId = npcId = function(id){return id;};

var shm;
var shv;

var readyCount = 2;
function partReady() { readyCount--; if(readyCount == 0) begin(); }
ARIS.ready = function() { partReady(); };


function begin()
{
    shm = new TipiModel();
    shv = new TipiViews();
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
        //xmlhttp.open("GET","http://arisgames.org/server/json.php/v1.webhooks.setWebHookReq/"+game_id(5252)+"/"+webHookId(992)+"/0/"+shm.player.user_id,true); 
        //xmlhttp.send();
    }

    ARIS.exitToCharacter(npcId(27870));
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

<div id='loading' class='full_screen'>&nbsp;<img height='12px' src="arismedia://700842.gif"></img> Loading...</div>

<div id='vid' class='full_screen'>
    <video id="vidfile" width="320" height="504" playsinline>
        <source src="arismedia://700841.mp4" type="video/mp4">
    </video>
    <div class='bottombutton' ontouchstart='vidComplete();'>
        <img src="arismedia://700840.png" class='forwardarrow' />
    </div>
</div>

</body>
</html>

