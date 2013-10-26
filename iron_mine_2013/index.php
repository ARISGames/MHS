<!DOCTYPE html>
<?php require_once('../../../server/config.class.php'); ?>
<?php require_once('../../../server/events/pusher_defaults.php'); ?>
<html>
<head>
<meta http-equiv="Content-Type" content="no-cache" />
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=no" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Iron Mine</title>
<link href="style.css" rel="stylesheet" type="text/css"></link>
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
                imm.money = qty;
                //Formats money as '$x.xx' for all edge cases
                if(imm.currentLevel == 2)
                {
                    imv.haveDisplay.innerHTML = '$'+((imm.money-(imm.money%100))/100)+'.'+(imm.money%100 < 10 ? '0' : '')+(imm.money%100);

                    if(imm.money >= imm.LEVEL_GOALS[imm.currentLevel-1])
                    {
                        ARIS.didUpdateItemQty = function(uiid, q) { }; //essentially removes self as listener
                        ARIS.setItemCount(imm.LEVEL_IDS[imm.currentLevel-1],1);
                        setTimeout(function(){ARIS.exitToTab("QUESTS");},1000);
                    }
                }
            }
            else if(updatedItemId == imm.ITEM_ID_ORE)
            {
                imm.ore = qty;
                if(imm.currentLevel == 1) imv.haveDisplay.innerHTML = 'Ore:'+qty;
            }
            else if(qty > 0 && updatedItemId == imm.ITEM_ID_DRILL)    imm.drill    = true;
            else if(qty > 0 && updatedItemId == imm.ITEM_ID_DYNAMITE) imm.dynamite = true;
            else if(qty > 0 && updatedItemId == imm.ITEM_ID_BACKER)   imm.backer   = true;

            if(imm.currentLevel == 1 && imm.drill && imm.dynamite && imm.backer)
            {
                ARIS.didUpdateItemQty = function(uiid, q) { }; //essentially removes self as listener
                ARIS.setItemCount(imm.LEVEL_IDS[imm.currentLevel-1],1);
                imv.displayGuruWithMessage("Alright! Now that you're aquainted with the roles in the mine, we can really <b>put you to work</b>. Come back tomorrow and we can start paying you for how much <b>ore you find</b>.");
                imv.currentGuruButton.onclick = function(){ARIS.exitToTab("QUESTS");};
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
                //alert("This game type doesn't exist...");
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
        imv.displayIntro();
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

    <div id='drillgame' class='game drill_bg full_screen'>
        <div id='drillvid' class='vid'>
            <video id="drillvidfile" width="320" height="504" webkit-playsinline>
                <source src="assets/intro.mp4" type="video/mp4">
            </video>
            <div class='bottombutton' onclick='ARIS.exitToScanner("Scan something in the mine!");'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='drillintro' class='intro full_screen'>
            <img src='assets/drill_prompt.png' class='introprompt' />
            <img src='assets/anton.png' class='introimage' />
            <div id='drillintrotalk' class='introtalk'>
            </div>
            <div id='drillintrobutton' class='bottombutton' onclick='imv.displayActivity();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='drillactivity' class='activity full_screen'>
            <div id='drillimagecontainer'>
                <img id='drillbgimage' src="assets/explode.png" />
                <img id='drillimage' src='assets/drill.png' />
            </div>
            <div id='drillindicatorbanner'>DRILL NOW!</div>
        </div>
        <div id='drillguru' class='guru full_screen'>
            <img class='guruimage' src='assets/anton.png' />
            <div id='drillgurutalk' class='gurutalk'></div>
            <div id='drillgurubutton' class='bottombutton' onclick='imv.hideGuru();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
    </div>

    <div id='dynamitegame' class='game full_screen'> <!-- class will be dynamite_left_bg OR dynamite_right_bg (depending on station). set in javascript -->
        <div id='dynamitevid' class='vid'>
            <video id="dynamitevidfile" width="320" height="504" webkit-playsinline>
                <source src="assets/intro.mp4" type="video/mp4">
            </video>
            <div class='bottombutton' onclick='ARIS.exitToScanner("Scan something in the mine!");'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='dynamiteintro' class='intro full_screen'>
            <img class='introprompt' src='assets/dynamite_prompt.png' />
            <img id='dynamiteintroimage' class='introimage' src='assets/matti.png' />
            <div id='dynamiteintrotalk' class='introtalk'>
            </div>
            <div id='dynamiteintrobutton' class='bottombutton' onclick='imv.displayActivity();'>
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
            <div id='dynamiteexplosion'>
                <img id='dynamiteexplosionimg' src='assets/explode.png' />
                <img id='dynamitesticksimg'    src='assets/dynamite_red.png' />
            </div>
            <div id='dynamiteindicatorbanner'></div>
            <img id='dynamiteindicator' src='assets/dynamite_load_instr.png' />
        </div>
        <div id='dynamiteguru' class='guru full_screen'>
            <img class='guruimage' src='assets/matti.png' />
            <div id='dynamitegurutalk' class='gurutalk'></div>
            <div id='dynamitegurubutton' class='bottombutton' onclick='imv.hideGuru();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
    </div>

    <div id='backergame' class='game backer_bg full_screen'>
        <div id='backervid' class='vid'>
            <video id="backervidfile" width="320" height="504" webkit-playsinline>
                <source src="assets/intro.mp4" type="video/mp4">
            </video>
            <div class='bottombutton' onclick='ARIS.exitToScanner("Scan something in the mine!");'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='backerintro' class='intro full_screen'>
            <img src='assets/backer_prompt.png' class='introprompt' />
            <img src='assets/mike.png' class='introimage' />
            <div id='backerintrotalk' class='introtalk'>
            </div>
            <div id='backerintrobutton' class='bottombutton' onclick='imv.displayActivity();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
        <div id='backeractivity' class='activity'>
            <img id='backerrock1' class='backerrock' src='assets/rock1.png' />
            <img id='backerrock2' class='backerrock' src='assets/rock2.png' />
            <img id='backerrock3' class='backerrock' src='assets/rock3.png' />
            <img id='backerrock4' class='backerrock' src='assets/rock4.png' />
            <img id='backerrock5' class='backerrock' src='assets/rock5.png' />
            <img id='backerrock6' class='backerrock' src='assets/rock6.png' />
            <img id='backerrock7' class='backerrock' src='assets/rock7.png' />
            <img id='backerrock8' class='backerrock' src='assets/rock8.png' />
            <img id='backerrocks' src='assets/backer_rocks_safe.png' />
            <div id='backerpoleleft'  class='backerpole'> <img id='backerpoleleftimage'  class='backerpoleimage' src='assets/backer_pole_left.png' />  </div>
            <div id='backerpoleright' class='backerpole'> <img id='backerpolerightimage' class='backerpoleimage' src='assets/backer_pole_right.png' /> </div>
        </div>
        <div id='backerguru' class='guru full_screen'>
            <img id='backerguruimage' class='guruimage' src='assets/mike.png' />
            <div id='backergurutalk' class='gurutalk'></div>
            <div id='backergurubutton' class='bottombutton' onclick='imv.hideGuru();'>
                <img src='assets/forward_arrow.png' class='forwardarrow' />
            </div>
        </div>
    </div>

    <div id='strikegame' class='game strike_bg full_screen'>
        <div id='strikeactivity' class='activity'>
            <div id="strike_you_portrait"></div>
            <div id="strike_interaction">
                <div id="strike_join_button" class="strike_button">Strike?</div>
                <div id="strike_dont_button" class="strike_button" onclick='ARIS.exitToTab("QUESTS");'>Don't?</div>
                <canvas id="strike_timer" width="140" height="140"></canvas>
            </div>
            <div id='strike_other_portraits'>Strikers:<br /></div>
        </div>
        <div id='strikedebug' class='debug'></div>
    </div>

</body>

</html>
