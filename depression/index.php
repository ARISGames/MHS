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

<style type="text/css">
body {
  font-size: 20px;
  font-family: sans-serif;
}

.img-left, .img-right {
  width: 90px;
  height: 90px;
  margin: 5px;
}

.img-left { float: left; }
.img-right { float: right; }

p {
  clear: both;
}
</style>

<script>
// Values from server config for js files to use.
var pm_config = {
    pusher_key: '<?php echo Config::pusher_key; ?>',
    private_default_auth: '<?php echo $private_default_auth; ?>',
    send_url: '<?php echo $send_url; ?>',
    private_default_channel: '<?php echo $private_default_channel; ?>-dep'
};

var server_path = '<?php echo Config::serverWWWPath; ?>';

var tradable_items = [
  {item_id: 86984, item_name: 'Boy Scout Rifle'},
  {item_id: 86983, item_name: 'CCC Uniform'},
  {item_id: 86996, item_name: 'Crystal Radio'},
  {item_id: 86988, item_name: 'Footlocker'},
  {item_id: 86992, item_name: 'Milk Pail'},
  {item_id: 86994, item_name: 'Oil Lamp'},
  {item_id: 86990, item_name: 'Paper Doll'},
  {item_id: 86986, item_name: 'Wagon'},
]
</script>

<script type="text/javascript" src="http://js.pusher.com/1.11/pusher.min.js"></script>
<script type="text/javascript" src="pusherman.js"></script>
<script type="text/javascript" src="eventhandler.js?cb=20"></script>
<script type="text/javascript" src="zepto.min.js"></script>

<script type="text/javascript">

var readyCount = 2;
function partReady() { readyCount--; if(readyCount == 0) begin(); }
ARIS.ready = function() { partReady(); };
document.addEventListener( "DOMContentLoaded", partReady, false );

function begin() {
  var item = null;
  tradable_items.forEach(function(someItem){
    if (ARIS.cache.getPlayerItemCount(someItem.item_id) > 0) {
      item = someItem.item_name;
    }
  });

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
