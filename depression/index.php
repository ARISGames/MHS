<?php require_once('../mhs-config.php'); ?>
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<title>Trading test</title>
<script type="text/javascript">
    var ARIS = {};//Get ARIS variable existant ASAP just to keep things simple
</script>

<script>
// Values from server config for js files to use.
var pm_config = {
    pusher_key: '<?php echo Config::pusher_key; ?>',
    private_default_auth: '<?php echo $private_default_auth; ?>',
    send_url: '<?php echo $send_url; ?>',
    private_default_channel: '<?php echo $private_default_channel; ?>-dep'
};

var server_path = '<?php echo Config::serverWWWPath; ?>';
</script>

<script type="text/javascript" src="http://js.pusher.com/1.11/pusher.min.js"></script>
<script type="text/javascript" src="pusherman.js"></script>
<script type="text/javascript" src="eventhandler.js?cb=5"></script>
<script type="text/javascript" src="zepto.min.js"></script>

<script type="text/javascript">

var readyCount = 2;
function partReady() { readyCount--; if(readyCount == 0) begin(); }
ARIS.ready = function() { partReady(); };
document.addEventListener( "DOMContentLoaded", partReady, false );

function begin() {
  var item = null;
  if (ARIS.cache.getPlayerItemCount(87021) > 0) {
    item = 'A';
  } else if (ARIS.cache.getPlayerItemCount(87023) > 0) {
    item = 'B';
  } else if (ARIS.cache.getPlayerItemCount(87024) > 0) {
    item = 'C';
  }

  ARIS.didReceivePlayer = function(player){
    player.item = item;
    window.eh = new EventHandler(player, item);
    window.eh.register();
  };
  ARIS.getPlayer();
}

</script>

</head>
<body>

<div id="trade-screen">Loading...</div>

</body>
</html>
