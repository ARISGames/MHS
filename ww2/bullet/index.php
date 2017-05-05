<?php require_once('../../mhs-config.php'); ?>
<!doctype html>

<html>

  <meta charset="utf-8">
  <title>Bullet Factory</title>

  <style>

    body { margin: 0; overflow: hidden; background: #111 }

  </style>

  <body>

    <script type="text/javascript" src="http://js.pusher.com/1.11/pusher.min.js"></script>
    <script type="text/javascript" src="script/pusherman.js"></script>

    <script type="text/javascript">

      window.bulletEvents = [];
      var pmEvents = [
        '1171_AMMO_INCREMENT',
        '1172_AMMO_INCREMENT',
        '1171_AMMO_RESET',
        '1172_AMMO_RESET',
        '1171_APP_CONTROL',
        '1172_APP_CONTROL',
      ];
      var pmCallbacks = pmEvents.map(function(event){
        return function(data){
          window.bulletEvents.push({
            event: event,
            time: Date.now(),
            data: data,
          });
        };
      });

      window.activeControl1 = null;
      window.activeControl2 = null;

      window.user_id = 1234; // to be filled in

      window.bulletPusher = new PusherMan('<?php echo Config::pusher_key; ?>',
        'http://arisgames.org/server/events/<?php echo $private_default_auth; ?>',
        'http://arisgames.org/server/events/<?php echo $send_url; ?>',
        '<?php echo $private_default_channel; ?>',
        pmEvents,
        pmCallbacks);

      window.setInterval(function(){
        if (window.activeControl1 && window.activeControl1.user_id == window.user_id) {
          window.bulletPusher.sendData('1171_APP_CONTROL', JSON.stringify(window.activeControl1));
        }
        if (window.activeControl2 && window.activeControl2.user_id == window.user_id) {
          window.bulletPusher.sendData('1172_APP_CONTROL', JSON.stringify(window.activeControl2));
        }
      }, 1000);

      function reset1171(){
        var req = new XMLHttpRequest;
        req.open('POST', 'http://156.99.108.61/cmdstart.php', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var form = new FormData;
        form.append('index', 'Reset Ammo 1');
        req.send(form);
      }

      function reset1172(){
        var req = new XMLHttpRequest;
        req.open('POST', 'http://156.99.108.61/cmdstart.php', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var form = new FormData;
        form.append('index', 'Reset Ammo 2');
        req.send(form);
      }

    </script>

    <script src="script/lib/playground.js"></script>

    <script src="script/engine/Engine.js"></script>
    <script src="script/Game.js"></script>
    <script src="script/Main.js"></script>

  </body>

</html>
