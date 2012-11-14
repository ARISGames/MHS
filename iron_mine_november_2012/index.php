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
        imm = new IronMineModel();
        imv = new IronMineView();
        imm.loadStateFromARIS(); //calls 'initGame' on complete
    }

    function initGame(type)
    {
        var events = []; //An array of pusher events to keep track of
        var callbacks = []; //An array of how to handle each event (will get sent 'data')
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
            //Formats money as '+$x.xx' for all edge cases
            imv.haveDisplay.innerHTML = '+$'+((imm.money-(imm.money%100))/100)+'.'+(imm.money%100 < 10 ? '0' : '')+(imm.money%100);
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
        Drill Intro...
    </div>

    <div id='dynamiteintro' class='intro'>
        Dynamite Intro...
    </div>

    <div id='backerintro' class='intro'>
        Backer Intro...
    </div>
</div>

<div id='videos' class='scene' onclick='imv.nextScene();'>
    <div id='drillvideo' class='video'>
        Drill Video...
    </div>

    <div id='dynamitevideo' class='video'>
        Dynamite Video...
    </div>

    <div id='backervideo' class='video'>
        Backer Video...
    </div>
</div>

<div id='games' class='scene'>
    <div id='drillgame' class='game'>
        Drill Game...
        <div id='drillhud' class='hud'></div>
        <div id='drillactivity' class='activity'>
            <div id='drillbit'>---------<span style='color:green;'>-</span></div>
            <div id='drillmeter'><span style='color:red;'>|||||||||||||||</span><span style='color:yellow;'>||||||||||||||</span><span style='color:green;'>|||||||</span><span style='color:yellow;'>||||||||||||</span><span style='color:red;'>||||||||||||||||||||||||||||||</span></div>
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

</body>
</html>
