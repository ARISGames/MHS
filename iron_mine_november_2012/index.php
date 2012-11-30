<!DOCTYPE html>
<?php require_once('../../../server/config.class.php'); ?>
<?php require_once('../../../server/events/pusher_defaults.php'); ?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<title>
MHS Iron Mine
</title>
<script src="http://js.pusher.com/1.11/pusher.min.js" type="text/javascript"></script>
<script src="utils/arisjs.js" type="text/javascript"></script>
<script src="helpers/pusherman.js" type="text/javascript"></script>
<script src="helpers/ironminemodel.js" type="text/javascript"></script>
<script src="helpers/ironmineview.js" type="text/javascript"></script>
<script src="games/drillgame.js" type="text/javascript"></script>
<script src="games/dynamitegame.js" type="text/javascript"></script>
<script src="games/backergame.js" type="text/javascript"></script>
<link href="style.css" rel="stylesheet" type="text/css""style.css"></style>
<script type="text/javascript">

    //Helpers
    var pm; //PusherMan- handles all realtime events
    var imm; //IronMineModel- handles all state data
    var imv; //IronMineView- handles all UI data
    var game; //Either an instance of DrillGame, DynamiteGame, or BackerGame

    function pageLoaded()
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

    function initGame(type)
    {
        switch(type)
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
            default:
                alert("This game type doesn't exist...");
                break;
        }
        imv.displayGame(type);

        //Override this function to handle money updates
        ARIS.didUpdateItemQty = function(updatedItemId, qty)
        {
            if(updatedItemId == imm.ITEM_IDS[0])
                imm.money = qty;
            //Formats money as '$x.xx' for all edge cases
            imv.haveDisplay.innerHTML = '$'+((imm.money-(imm.money%100))/100)+'.'+(imm.money%100 < 10 ? '0' : '')+(imm.money%100);
            if(imm.money >= imm.LEVEL_GOALS[imm.currentLevel-1])
            {
                ARIS.setItemCount(imm.LEVEL_IDS[imm.currentLevel-1],0);
                ARIS.setItemCount(imm.LEVEL_COMPLETE_IDS[imm.currentLevel-1],1);
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

    window.addEventListener('load', pageLoaded, false);
</script>
</head>
<body>

<div id='loading' class='scene' style='display:block;'>
    &nbsp;<img height='12px' src='assets/spinner.gif'></img> Loading...
</div>

<div id='intros' class='scene' onclick='imv.nextScene();'>
    <div id='drillintro' class='intro'>
        <img class='role' src='assets/driller.png' />
        <img id="introArrow" class="right_arrow" src="assets/right_arrow.png" />
    </div>

    <div id='dynamiteintro' class='intro'>
        Dynamite Intro...
    </div>

    <div id='backerintro' class='intro'>
        Backer Intro...
    </div>
</div>

<div id='games' class='scene'>
    <div id='drillgame' class='game'>
        <div id='drillhud' class='hud'></div>
        <div id='drillactivity' class='activity'>
            <img id='drillbit' src='assets/drill.png' />
            <div id='drillprompts'>
                <div class='drillprompt' style='top:65px;'>too deep</div>
                <div class='drillprompt' style='top:215px;'>correct depth</div>
                <div class='drillprompt' style='top:365px;'>too shallow</div>
            </div>
            <div id='drilllights'>
                <img id='light7' class='drilllight' src='assets/red_btn_off.png' style='top:50px;'/>
                <img id='light6' class='drilllight' src='assets/yellow_btn_off.png' style='top:100px;'/>
                <img id='light5' class='drilllight' src='assets/yellow_btn_off.png' style='top:150px;'/>
                <img id='light4' class='drilllight' src='assets/green_btn_off.png' style='top:200px;'/>
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
        Dynamite Game...
        <div id='dynamitehud' class='hud'></div>
        <div id='dynamiteactivity' class='activity'>
            <div id='dynamitehole1'>o</div>
            <div id='dynamitehole2'>o</div>
            <div id='dynamitehole3'>o</div>
            <div id='dynamitehole4'>o</div>
            <div id='dynamitehole5'>o</div>
            <div id='dynamitehole6'>o</div>
            <div id='dynamiteinstructions'></div>
            <div id='countdown'></div>
        </div>
        <div id='drilldebug' class='debug'></div>
    </div>

    <div id='backergame' class='game'>
        Backer Game...
        <div id='backerhud' class='hud'></div>
        <div id='backerdebug' class='debug'></div>
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
