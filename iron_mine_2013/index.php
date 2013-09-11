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
        window.onerror = function(msg, url, linenumber) 
        {
            alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
            return true;
        }
        imm = new IronMineModel();
        imv = new IronMineView();
        imm.loadStateFromARIS(); //calls 'initGame' on complete
    }

    function initGame(type, webId)
    {
        switch(type)
        {
            case imm.STATION_TYPE_DRILL:
                game = new DrillGame();
                ARIS.setItemCount(imm.ITEM_ID_DRILL, 1);
                break;
            case imm.STATION_TYPE_DYNAMITE:
                game = new DynamiteGame();
                ARIS.setItemCount(imm.ITEM_ID_DYNAMITE, 1);
                break;
            case imm.STATION_TYPE_BACKER:
                game = new BackerGame();
                ARIS.setItemCount(imm.ITEM_ID_BACKER, 1);
                break;
            case imm.STATION_TYPE_STRIKE:
                game = new StrikeGame();
                ARIS.setItemCount(imm.ITEM_ID_STRIKE, 1);
                break;
            default:
                alert("This game type doesn't exist...");
                break;
        }
        imv.displayGame(type);

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

        pm = new PusherMan('<?php echo Config::pusher_key; ?>', 
            'http://dev.arisgames.org/server/events/<?php echo $private_default_auth; ?>', 
            'http://dev.arisgames.org/server/events/<?php echo $send_url; ?>', 
            '<?php echo $private_default_channel; ?>', 
            game.events, 
            game.callbacks);

        imv.setScene(imv.introsScene);
    }

    window.addEventListener('load', partReady, false);
</script>
</head>

<body>

<div id='loading' class='scene' style='display:block;'>
    &nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...
</div>

<div id='intros' class='scene' onclick='imv.nextScene();'>
    <div id='drillintro' class='intro'>
        <img class='role' src='assets/driller.png' />
        <img class="right_arrow" src="assets/right_arrow.png" />
    </div>

    <div id='dynamiteintro' class='intro'>
        <img class='role' src='assets/blaster.png' />
        <img class="right_arrow" src="assets/right_arrow.png" />
    </div>

    <div id='backerintro' class='intro'>
        Backer...(no images)
        <img class='role' src='assets/backer.png' />
        <img class="right_arrow" src="assets/right_arrow.png" />
    </div>

    <div id='strikeintro' class='intro'>
        <img class='role' src='assets/strike.png' />
        <img class="right_arrow" src="assets/right_arrow.png" />
    </div>
</div>

<div id='games' class='scene'>
    <div id='drillgame' class='game'>
        <div id='drillhud' class='hud'></div>
        <div id='drillactivity' class='activity'>
            <img id='drillbit' src='assets/drill.png' />
            <div id='drillprompts'>
                <div class='drillprompt' style='top:65px;'>too deep</div>
                <div class='drillprompt' style='top:165px;'>correct depth</div>
                <div class='drillprompt' style='top:365px;'>too shallow</div>
            </div>
            <div id='drilllights'>
                <img id='light7' class='drilllight' src='assets/red_btn_off.png' style='top:50px;'/>
                <img id='light6' class='drilllight' src='assets/yellow_btn_off.png' style='top:100px;'/>
                <img id='light5' class='drilllight' src='assets/green_btn_off.png' style='top:150px;'/>
                <img id='light4' class='drilllight' src='assets/yellow_btn_off.png' style='top:200px;'/>
                <img id='light3' class='drilllight' src='assets/yellow_btn_off.png' style='top:250px;'/>
                <img id='light2' class='drilllight' src='assets/yellow_btn_off.png' style='top:300px;'/>
                <img id='light1' class='drilllight' src='assets/yellow_btn_off.png' style='top:350px;'/>
            </div>
        </div>
        <div id='drilloverlayintro' class='overlay' onclick='document.getElementById("drilloverlayintro").style.display = "none";'>
            <img id='drillalertintro' class='alert' src='assets/use_drill_splash.png' onclick='document.getElementById("drilloverlayintro").style.display = "none";'/>
            <img id='drillalertarrow' class='alert' src='assets/right_arrow.png' onclick='document.getElementById("drilloverlayintro").style.display = "none";'/>
        </div>
        <div id='drilldebug' class='debug'></div>
    </div>

    <div id='dynamitegame' class='game'>
        <div id='dynamitehud' class='hud'></div>
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

    <div id='backergame' class='game'>
        Backer Game...
        <div id='backerhud' class='hud'></div>
        <div id='backeractivity' class='activity'>
        </div>
        <div id='backerdebug' class='debug'></div>
    </div>

    <div id='strikegame' class='game'>
        <div id='strikehud' class='hud'></div>
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

</div>

<div id='congrats' class='scene' onclick='ARIS.closeMe();'>
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
