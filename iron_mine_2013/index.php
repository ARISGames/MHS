<!DOCTYPE html>
<?php require_once('../../../server/config.class.php'); ?>
<?php require_once('../../../server/events/pusher_defaults.php'); ?>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>
MHS Iron Mine
</title>
<link href="style.css" rel="stylesheet" type="text/css""style.css"></style>
<script type="text/javascript" src="http://js.pusher.com/1.11/pusher.min.js"></script>
<script type="text/javascript" src="helpers/pusherman.js">    </script>
<script type="text/javascript" src="helpers/ironminemodel.js"></script>
<script type="text/javascript" src="helpers/ironmineview.js"> </script>
<script type="text/javascript" src="games/drillgame.js">      </script>
<script type="text/javascript" src="games/dynamitegame.js">   </script>
<script type="text/javascript" src="games/backergame.js">     </script>
<script type="text/javascript" src="games/strikegame.js">     </script>
<script type="text/javascript">

    //Helpers
    var pm; //PusherMan- handles all realtime events
    var imm; //IronMineModel- handles all state data
    var imv; //IronMineView- handles all UI data
    var game; //Either an instance of DrillGame, DynamiteGame, or BackerGame //, or StrikeGame, but that behaves slightly differently

    var ARIS = {}; //Tells ARISjs (injected by ARIS) that this page is aware of its presence.
    var readyCount = 2; //ARIS.ready and pageload must both be called to ensure a safe starting point
    function partReady()
    {
        readyCount--;
        if(readyCount == 0) begin();
    }
    ARIS.ready = function() { partReady(); };

    function begin()
    {
        imm = new IronMineModel();
        imv = new IronMineView();
        imm.loadStateFromARIS(); //calls 'initGame' on complete
    }

    function initGame(type, webId)
    {
        //Override this function to handle money updates
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == imm.ITEM_ID_MONEY)
                imm.money = qty;
            //Formats money as '$x.xx' for all edge cases
            imv.haveDisplay.innerHTML = '$'+((imm.money-(imm.money%100))/100)+'.'+(imm.money%100 < 10 ? '0' : '')+(imm.money%100);
            if(imm.money >= imm.LEVEL_GOALS[imm.currentLevel-1])
            {
                ARIS.didUpdateItemQty = function(uiid, q) { }; //essentially removes self as listener
                ARIS.setItemCount(imm.LEVEL_IDS[imm.currentLevel-1],1);
                document.getElementById('congratsoverlay'+imm.currentLevel).style.display = 'block';
                document.getElementById('congrats').style.display = 'block';
                document.getElementById('drillbit').style.display = 'none';
            }
        }

        imm.stationType = type;
        switch(imm.stationType)
        {
            case imm.STATION_TYPE_DRILL:
                game = new DrillGame();
                break;
            case imm.STATION_TYPE_DYNAMITE:
                game = new DynamiteGame();
                break;
            case imm.STATION_TYPE_BACKER:
                game = new BackerGame();
                break;
            case imm.STATION_TYPE_STRIKE:
                game = new StrikeGame();
                break;
            default:
                alert("This game type doesn't exist...");
                break;
        }

        pm = new PusherMan('<?php echo Config::pusher_key; ?>', 
            'http://dev.arisgames.org/server/events/<?php echo $private_default_auth; ?>', 
            'http://dev.arisgames.org/server/events/<?php echo $send_url; ?>', 
            '<?php echo $private_default_channel; ?>', 
            game.events, 
            game.callbacks);

        imv.displayGame(imm.stationType);
        game.setup();
    }

    window.addEventListener('load', partReady, false);
    window.onerror = function(msg, url, linenumber) 
    {
        alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
        return true;
    }
</script>
</head>

<body class='full_screen'>

    <div id='loading' class='full_screen'>&nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...</div>

    <div id='drillgame' class='game drill_bg full_screen'>
        <div id='drillvid' class='vid'></div>
        <div id='drillintro' class='intro full_screen'>
            <img id='drillprompt' src='assets/drillprompt.png' class='prompt'>
            <img src='assets/anton.png' class='introimage' />
            <div id='drillintrodialog' class='introdialog'>
            </div>
        </div>
        <div id='drillactivity' class='activity full_screen'>
            <div id='drillimagecontainer'>
                <img id='drillimage' src='assets/drill_yellow.png' />
            </div>
        </div>
        <div id='drillguru' class='guru full_screen'>
            <img src='assets/anton.png' class='guruimage'>
            <div id='drilldialog' class='gurudialog'>
            </div>
        </div>
    </div>

    <div id='dynamitegame' class='game dynamite_bg full_screen'>
        <div id='dynamiteactivity' class='activity'>
            <div id='dynamiteholes' >
                <img id='dynamitehole1' class='dynamitehole' src='assets/dynamite_black.png' style='top:0px;  left:0px;' />
                <img id='dynamitehole2' class='dynamitehole' src='assets/dynamite_black.png' style='top:70px; left:60px;' />
                <img id='dynamitehole3' class='dynamitehole' src='assets/dynamite_black.png' style='top:20px; left:90px;' />
                <img id='dynamitehole4' class='dynamitehole' src='assets/dynamite_black.png' style='top:20px; right:90px;' />
                <img id='dynamitehole5' class='dynamitehole' src='assets/dynamite_black.png' style='top:70px; right:60px;' />
                <img id='dynamitehole6' class='dynamitehole' src='assets/dynamite_black.png' style='top:0px;  right:0px;' />
            </div>
            <img id='dynamiteindicator' src='assets/blaster_instruction_load.png' />
        </div>
        <div id='dynamiteoverlayintro' class='overlay' onclick='document.getElementById("dynamiteoverlayintro").style.display = "none";'>
            <img id='dynamitealertintro' class='alert' src='assets/load_dynamite_splash.png' onclick='document.getElementById("dynamiteoverlayintro").style.display = "none";'/>
            <img id='dynamitealertarrow' class='alert' src='assets/right_arrow.png' onclick='document.getElementById("dynamiteoverlayintro").style.display = "none";'/>
        </div>
        <div id='dynamitedebug' class='debug'></div>
    </div>

    <div id='backergame' class='game backer_bg full_screen'>
        <div id='backeractivity' class='activity'>
        </div>
        <div id='backerdebug' class='debug'></div>
    </div>

    <div id='strikegame' class='game strike_bg full_screen'>
        <div id='strikeactivity' class='activity'>
            <div id="strike_you_portrait"></div>
            <div id="strike_interaction">
                <div id="strike_join_button" class="strike_button">Strike?</div>
                <div id="strike_dont_button" class="strike_button" onclick='ARIS.closeMe();'>Don't?</div>
                <canvas id="strike_timer" width="140" height="140"></canvas>
            </div>
            <div id='strike_other_portraits'>Strikers:<br /></div>
        </div>
        <div id='strikedebug' class='debug'></div>
    </div>

    <div id='congrats' class='full_screen' onclick='ARIS.closeMe();'>
        <div id='congratsoverlay1' class='congratsoverlay overlay' onclick='ARIS.closeMe();'>
            <img id='congratsalert1' class='congratsalert alert' src='assets/level_one_splash.png' onclick='ARIS.closeMe();'/>
        </div>
        <div id='congratsoverlay2' class='congratsoverlay overlay' onclick='ARIS.closeMe();'>
            <img id='congratsalert2' class='congratsalert alert' src='assets/level_two_splash.png' onclick='ARIS.closeMe();'/>
        </div>
        <div id='congratsoverlay3' class='congratsoverlay overlay' onclick='ARIS.closeMe();'>
            <img id='congratsalert3' class='congratsalert alert' src='assets/level_three_splash.png' onclick='ARIS.closeMe();'/>
        </div>
    </div>

</body>

</html>
