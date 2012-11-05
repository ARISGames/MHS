<?php
require_once('config.php');
require_once('Pusher.php');
$pusher = new Pusher(KEY, SECRET, APP_ID, true);
$pusher->trigger(CHANNEL, $_REQUEST['event'], $_REQUEST['data']);
echo $data;
?>
