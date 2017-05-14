<?php require_once('../../mhs-config.php'); ?>
<!doctype html>

<html>

  <meta charset="utf-8">
  <title>Bullet Factory</title>

  <style>

    body { margin: 0; overflow: hidden; background: #111 }

  </style>

  <body>

    <script type="text/javascript" src="//js.pusher.com/1.11/pusher.min.js"></script>
    <script type="text/javascript" src="script/pusherman.js"></script>

    <script type="text/javascript">

      window.machine_id = parseInt(window.location.search.slice(1)) || 1171;

      window.bulletEvents = [];
      var pmEvents = [
        window.machine_id + '_AMMO_INCREMENT',
        window.machine_id + '_AMMO_RESET',
        window.machine_id + '_APP_CONTROL',
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

      window.activeControl = null;

      window.user_id = Date.now(); // to be filled in

      window.bulletPusher = new PusherMan('<?php echo Config::pusher_key; ?>',
        'http://arisgames.org/server/events/<?php echo $private_default_auth; ?>',
        'http://arisgames.org/server/events/<?php echo $send_url; ?>',
        '<?php echo $private_default_channel; ?>',
        pmEvents,
        pmCallbacks);

      window.setInterval(function(){
        if (window.activeControl && window.activeControl.user_id == window.user_id) {
          window.bulletPusher.sendData(window.machine_id + '_APP_CONTROL', JSON.stringify(window.activeControl));
        }
      }, 1000);

      function resetMachine(){
        var req = new XMLHttpRequest;
        req.open('POST', 'http://156.99.108.61/cmdstart.php', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var form = new FormData;
        if (window.machine_id === 1171) {
          form.append('index', 'Reset Ammo 1');
        } else if (window.machine_id === 1172) {
          form.append('index', 'Reset Ammo 2');
        }
        req.send(form);
      }

    </script>

    <script src="script/lib/playground.js"></script>

    <script src="script/engine/Engine.js"></script>
    <script src="script/Game.js"></script>
    <script src="script/Main.js"></script>

  </body>

</html>
