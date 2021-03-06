<?php require_once('../mhs-config.php'); ?>
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

<script>
// Values from server config for js files to use.
var pm_config =
{
    pusher_key: '<?php echo Config::pusher_key; ?>',
    private_default_auth: '<?php echo $private_default_auth; ?>',
    send_url: '<?php echo $send_url; ?>',
    private_default_channel: '<?php echo $private_default_channel; ?>'
}

var server_path = '<?php echo Config::serverWWWPath; ?>';
</script>

<script type="text/javascript" src="utils/json2.js"></script>
<script type="text/javascript" src="http://js.pusher.com/1.11/pusher.min.js"></script>
<script type="text/javascript" src="pusherman.js"></script>
<script type="text/javascript" src="eventhandler.js"></script>
<script type="text/javascript" src="model.js"></script>
<script type="text/javascript" src="views.js"></script>
<script type="text/javascript" src="clerkgame.js"></script>
<script type="text/javascript" src="huntergame.js"></script>
<script type="text/javascript">

var ftm;
var ftv;
var eh;
var game;

var readyCount = 2;
function partReady() { readyCount--; if(readyCount == 0) begin(); }
ARIS.ready = function() { partReady(); };

function begin()
{
    ftv = new FurTradeViews();
    ftm = new FurTradeModel();
    eh = new EventHandler();
    ftm.loadStateFromARIS(stateReceived);
}

function stateReceived()
{
    ARIS.didUpdateItemQty = function(updatedItemId,qty) //simplify item updates after initial state received
    {
        if(o = ftm.itemForItemId(updatedItemId)) o.qty = qty;
    }

    if(!ftm.currentRole) ftv.displayVid();
    else roleReceived();
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
        //xmlhttp.open("GET","http://arisgames.org/server/json.php/v1.webhooks.setWebHookReq/5252/989/0/"+ftm.player.user_id,true); 
        //xmlhttp.send();
    }

    ftv.displayLoading();
    ftm.requestNewRole(roleReceived);
}

function roleReceived()
{
    if(ftm.currentRole == roleClerk)  game = new ClerkGame();
    if(ftm.currentRole == roleHunter) game = new HunterGame();
    ftv.displayRole(ftm.currentRole);
    game.init();
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

<div id="success_popup" class="full_screen" style="display:block; visibility:hidden; z-index:10000; background-color:#000000;" ontouchstart="document.getElementById('success_popup').style.visibility='hidden';"><img id="success_popup_content" style="width:320px;"></div>

<div id='loading' class='full_screen'>&nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...</div>

<div id='vid' class='full_screen'>
    <video id="vidfile" width="320" height="504" playsinline>
        <source src="arismedia://700932.mp4" type="video/mp4">
    </video>
    <div class='bottombutton' ontouchstart='vidComplete();'>
        <img src='assets/forward_arrow.png' class='forwardarrow' />
    </div>
</div>

<div id='clerkrole' class='role clerk_bg full_screen'>
    <div id='clerkintro' class='intro full_screen'>
        <img src='assets/clerk_prompt.png' class='introprompt' />
        <img id='clerkintroimage' class='introimage' src='assets/john.png' />
        <div class='introdialog'>
            Good day. I'm <b>John Sayer</b>. I'm in charge of this fur post- you must be my new <b>Clerk</b>! Your first job is to stock the store. <b>Take these beaver pelts</b> and <b>exchange them for store items</b>.
        </div>
        <div class='bottombutton' ontouchstart='ARIS.exitToScanner("You are a Clerk! Scan an item around the fur post counter!");'>
            <img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>
    </div>
    <div id='clerkget' class='get seller_bg full_screen'>
        <img src='assets/pelt.png' id='clerkitemget' />
        <img id='sellerimage' src='assets/seller.png' />
        <div id='sellerdialog' class='introdialog'>
            This here item's a doozy yup sure is der.
        </div>
        <div id='buybutton' class='bottombutton' ontouchstart='game.clerkBuyConfirmed();'>
            <div id="sellerbuttontext" class="bottombuttontext">Buy </div><img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>
    </div>
    <div id='clerklounge' class='lounge full_screen'>
        <div id='clerkloungesearchbutton' ontouchstart="game.searchAgain()">Search Again</div>
        <div id='clerkloungepool'></div>
    </div>
    <!--
    <div id='clerklounge' class='lounge full_screen'>
        <div id='clerkloungecontent'>
            <div id='clerkloungesearchbutton' ontouchstart="game.searchAgain()">Search Again</div>
            <div id='clerkloungepool'></div>
            <div id='clerkloungetext'>
                Searching for hunter...
            </div>
        </div>
    </div>
    -->
    <div id='clerktrade' class='trade full_screen'>

        <div id='clerktradeclient' class='tradeoffer theiroffer'>
            <div id='clerktradeclienttitle' class='tradeplayertitle'></div>
            <img id='clerktradeclientimg' class='tradeplayerimg' />
            <div id='clerktradeclientname' class='tradeplayername'></div>
            <div class='tradeoffercontent'>
                <img id='clerktradeclientofferimg' class='tradeofferimg'/>
                <div id='clerktradeclientofferqty'></div>
            </div>
        </div>
        <div id='clerktradeoffer' class='tradeoffer myoffer'>
            <div id='clerktradetitle' class='tradeplayertitle'></div>
            <img id='clerktradeimg' class='tradeplayerimg' />
            <div id='clerktradename' class='tradeplayername'></div>
            <div class='tradeoffercontent'>
                <img id='clerktradeofferimg' class='tradeofferimg'/>
                <div id='clerktradeofferqty'></div>
            </div>
        </div>
        <div id='clerktradepool' class='tradepool'>
        </div>
        <div id='clerktradebutton' class='bottombutton' ontouchstart="game.readyTouched()">
            <div id='clerktradebuttontext' class="bottombuttontext">Ready to Trade</div><img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>

    </div>
    <div id='clerkguru' class='guru full_screen'>
        <img id='clerkguruimage' class='guruimage' src='assets/john.png' />
        <div id='clerkgurutalk' class='gurutalk'></div>
        <div id="clerkgurubutton" class='bottombutton' ontouchstart='ftv.hideGuru();'>
            <img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>
    </div>
</div>

<div id='hunterrole' class='role hunter_bg full_screen'>
    <div id='hunterintro' class='intro full_screen'>
        <img src='assets/hunter_prompt.png' class='introprompt' />
        <img id='hunterintroimage' class='introimage' src='assets/natam.png' />
        <div class='introdialog'>
            I hear you're interested in joining us <b>Hunters</b>. I'm <b>Monsomanian</b>. The other Ojibwe and I bring pelts to the fur post to trade for European goods. <b>Help us hunt 8 beaver for pelts</b>!
        </div>
        <div class='bottombutton' ontouchstart='ARIS.exitToScanner("You are a Hunter! Scan a beaver on the ground to trap it!");'>
            <img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>
    </div>
    <div id='hunterget' class='get full_screen'>
        <img src='assets/seth_eastman.jpg' id='peltgetbg' />
        <img src='assets/pelt.png' id='peltget' />
        <div id='harvestbutton' class='bottombutton' ontouchstart='game.hunterHarvestConfirmed();'>
            <div id='harvestbuttontext' class="bottombuttontext">Skin Beaver</div><img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>
    </div>
    <div id='hunterlounge' class='lounge full_screen'>
        <div id='hunterloungesearchbutton' ontouchstart="game.searchAgain()">Search Again</div>
        <div id='hunterloungepool'></div>
    </div>
    <div id='huntertrade' class='trade full_screen'>

        <div id='huntertradeclient' class='tradeoffer theiroffer'>
            <div id='huntertradeclienttitle' class='tradeplayertitle'></div>
            <img id='huntertradeclientimg' class='tradeplayerimg' />
            <div id='huntertradeclientname' class='tradeplayername'></div>
            <div class='tradeoffercontent'>
                <img id='huntertradeclientofferimg' class='tradeofferimg'/>
            </div>
        </div>
        <div id='huntertradeoffer' class='tradeoffer myoffer'>
            <div id='huntertradetitle' class='tradeplayertitle'></div>
            <img id='huntertradeimg' class='tradeplayerimg' />
            <div id='huntertradename' class='tradeplayername'></div>
            <div class='tradeoffercontent'>
                <img id='huntertradeofferimg' class='tradeofferimg'/>
                <div id='huntertradeofferqty'></div>
                <!--<div id='huntertradeofferqty2'></div>-->
            </div>
        </div>
        <div id='huntertradepool' class='tradepool'>
            <img id='huntertradeofferinc' ontouchstart="game.incrementTouched()" src='assets/plus.png'/>
            <img id='huntertradeofferdec' ontouchstart="game.decrementTouched()" src='assets/minus.png'/>
            <div id='huntertradeoffertotal'></div>
        </div>
        <div id='huntertradebutton' class='bottombutton' ontouchstart="game.readyTouched()">
            <div id='huntertradebuttontext' class="bottombuttontext">Ready to Trade</div><img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>

    </div>
    <div id='hunterguru' class='guru full_screen'>
        <img id='hunterguruimage' class='guruimage' src='assets/natam.png' />
        <div id='huntergurutalk' class='gurutalk'></div>
        <div id='huntergurubutton' class='bottombutton' ontouchstart='ftv.hideGuru();'>
            <img src='assets/forward_arrow.png' class='forwardarrow' />
        </div>
    </div>
</div>

<div id="connection-warning">
    No internet connection
</div>

</body>
</html>

