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
            {
                var delta = qty-imm.money;
                imm.money = qty;

                imv.displayMoneyDelta(delta);
                //Formats money as '$x.xx' for all edge cases
                imv.haveDisplay.innerHTML = '$'+((imm.money-(imm.money%100))/100)+'.'+(imm.money%100 < 10 ? '0' : '')+(imm.money%100);
                if(imm.money >= imm.LEVEL_GOALS[imm.currentLevel-1])
                {
                    ARIS.didUpdateItemQty = function(uiid, q) { }; //essentially removes self as listener
                    ARIS.setItemCount(imm.LEVEL_IDS[imm.currentLevel-1],1);
                    setTimeout(function(){ARIS.closeMe();},1000);
                }
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
        <div id='drillvid' class='vid'>
            (video here)
            <div class='bottombutton' onclick='imv.displayIntro();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='drillintro' class='intro full_screen'>
            <img src='assets/drill_prompt.png' class='introprompt' />
            <img src='assets/anton.png' class='introimage' />
            <div class='introdialog'>
                Hey Kid, I'm Anton Antilla, I came from Finland when I was 17. So you're my new drilling partner huh? Earn $2 for today's 10 hour day by drilling to the right depth. Watch out, the company will fine you money if you mess up and drill too (?) <br />
            </div>
            <div class='bottombutton' onclick='imv.displayActivity();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='drillactivity' class='activity full_screen'>
            <div id='drillimagecontainer'>
                <img id='drillimage' src='assets/drill_yellow.png' />
            </div>
            <div id='drillindicatorbanner'>DRILL NOW!</div>
        </div>
        <div id='drillguru' class='guru full_screen'>
            <img src='assets/anton.png' class='guruimage'>
            <div id='drillgurutalk' class='gurutalk'></div>
            <div class='bottombutton' onclick='imv.hideGuru();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
    </div>

    <div id='dynamitegame' class='game full_screen'> <!-- class will be dynamite_left_bg OR dynamite_right_bg (depending on station). set in javascript -->
        <div id='dynamitevid' class='vid'>
            (video here)
            <div class='bottombutton' onclick='imv.displayIntro();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='dynamiteintro' class='intro full_screen'>
            <img class='introprompt' src='assets/dynamite_prompt.png' />
            <img id='dynamiteintroimage' class='introimage' src='assets/matti.png' />
            <div class='introdialog'>
                Hei, miten menee, I'm Matti Pelta, I came from Finland a few years ago. So you're my new blasting partner huh? Earn $2 for today's 10 hour day by blowing up the rock so we can get to the ore. Watch out, the company will fine you money if you mess this up! <br />
            </div>
            <div class='bottombutton' onclick='imv.displayActivity();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='dynamiteactivity' class='activity'>
            <div id='dynamiteholes'>
                <img id='dynamitehole1' class='dynamitehole' src='assets/dynamite_filled_hole.png' />
                <img id='dynamitehole2' class='dynamitehole' src='assets/dynamite_filled_hole.png' />
                <img id='dynamitehole3' class='dynamitehole' src='assets/dynamite_filled_hole.png' />
                <img id='dynamitehole4' class='dynamitehole' src='assets/dynamite_filled_hole.png' />
                <img id='dynamitehole5' class='dynamitehole' src='assets/dynamite_filled_hole.png' />
                <img id='dynamitehole6' class='dynamitehole' src='assets/dynamite_filled_hole.png' />
            </div>
            <div id='dynamiteindicatorbanner'></div>
            <img id='dynamiteindicator' src='assets/dynamite_load_instr.png' />
        </div>
        <div id='dynamiteguru' class='guru full_screen'>
            <img src='assets/matti.png' class='guruimage'>
            <div id='dynamitegurutalk' class='gurutalk'></div>
            <div class='bottombutton' onclick='imv.hideGuru();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
    </div>

    <div id='backergame' class='game backer_bg full_screen'>
        <div id='backervid' class='vid'>
            (video here)
            <div class='bottombutton' onclick='imv.displayIntro();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='backerintro' class='intro full_screen'>
            <img src='assets/backer_prompt.png' class='introprompt' />
            <img src='assets/mike.png' class='introimage' />
            <div class='introdialog'>
                Pozdravljeni, My name's Mike Zakotnik, I came from Yugoslavia when I was 14 years old. So you're my new partner, huh? We can each earn $2...
            </div>
            <div class='bottombutton' onclick='imv.displayActivity();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='backeractivity' class='activity'>
            <img id='backerrocks' src='assets/backer_rocks_safe.png' />
            <div id='backerpoleleft'  class='backerpole'> <img id='backerpoleleftimage'  class='backerpoleimage' src='assets/backer_pole_left.png' />  </div>
            <div id='backerpoleright' class='backerpole'> <img id='backerpolerightimage' class='backerpoleimage' src='assets/backer_pole_right.png' /> </div>
        </div>
        <div id='backerguru' class='guru full_screen'>
            <img src='assets/mike.png' class='guruimage'>
            <div id='backergurutalk' class='gurutalk'></div>
            <div class='bottombutton' onclick='imv.hideGuru();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
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

</body>

</html>
