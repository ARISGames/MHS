<?php require_once('../../../../config.class.php'); ?>
<?php require_once('../../../../events/pusher_defaults.php'); ?>
<!DOCTYPE html>
<html>
<head>
    <title>MHS Iron Mine Listener</title>
    <script src="http://js.pusher.com/1.11/pusher.min.js" type="text/javascript"></script>
    <script type="text/javascript">
    //Separate script tag, because it's just a helper

        function humanTimeStamp()
        {
            var date = new Date();
            var datevalues = [
                date.getFullYear(),
                date.getMonth()+1,
                date.getDate(),
                date.getHours(),
                date.getMinutes(),
                date.getSeconds()
            ];
            return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        }

    </script>
    <script type="text/javascript">

	//RECEIVE
	var pusher = new Pusher('<?php echo Config::pusher_key; ?>',{'encrypted':true});
	Pusher.channel_auth_endpoint = '<?php echo 'http://arisgames.org/server/events/'.$private_default_auth; ?>';
	var priv_channel = pusher.subscribe('<?php echo $private_default_channel; ?>');

	//Drill
	priv_channel.bind('1151_DRILL_STARTED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 1 Started</div>";
	    document.getElementById('drill_1_messages').insertBefore(message,document.getElementById('drill_1_messages').firstChild);
	});
	priv_channel.bind('1151_DRILL_STOPPED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 1 Stopped</div>";
	    document.getElementById('drill_1_messages').insertBefore(message,document.getElementById('drill_1_messages').firstChild);
	});
	priv_channel.bind('1151_DRILL_LIGHT', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 1 Light "+data+"</div>";
	    document.getElementById('drill_1_messages').insertBefore(message,document.getElementById('drill_1_messages').firstChild);
	});

	priv_channel.bind('1152_DRILL_STARTED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 2 Started</div>";
	    document.getElementById('drill_2_messages').insertBefore(message,document.getElementById('drill_2_messages').firstChild);
	});
	priv_channel.bind('1152_DRILL_STOPPED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 2 Stopped</div>";
	    document.getElementById('drill_2_messages').insertBefore(message,document.getElementById('drill_2_messages').firstChild);
	});
	priv_channel.bind('1152_DRILL_LIGHT', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 2 Light "+data+"</div>";
	    document.getElementById('drill_2_messages').insertBefore(message,document.getElementById('drill_2_messages').firstChild);
	});

	priv_channel.bind('1153_DRILL_STARTED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 3 Started</div>";
	    document.getElementById('drill_3_messages').insertBefore(message,document.getElementById('drill_3_messages').firstChild);
	});
	priv_channel.bind('1153_DRILL_STOPPED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 3 Stopped</div>";
	    document.getElementById('drill_3_messages').insertBefore(message,document.getElementById('drill_3_messages').firstChild);
	});
	priv_channel.bind('1153_DRILL_LIGHT', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 3 Light "+data+"</div>";
	    document.getElementById('drill_3_messages').insertBefore(message,document.getElementById('drill_3_messages').firstChild);
	});

	priv_channel.bind('1154_DRILL_STARTED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 4 Started</div>";
	    document.getElementById('drill_4_messages').insertBefore(message,document.getElementById('drill_4_messages').firstChild);
	});
	priv_channel.bind('1154_DRILL_STOPPED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 4 Stopped</div>";
	    document.getElementById('drill_4_messages').insertBefore(message,document.getElementById('drill_4_messages').firstChild);
	});
	priv_channel.bind('1154_DRILL_LIGHT', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Drill 4 Light "+data+"</div>";
	    document.getElementById('drill_4_messages').insertBefore(message,document.getElementById('drill_4_messages').firstChild);
	});

	//Dynamite
	priv_channel.bind('1155_PLUNGER_PRESSED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Plunger Pressed</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});
	priv_channel.bind('1155_DYNAMITE_SLOT_1_CHANGED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Slot 1 "+data+"</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});
	priv_channel.bind('1155_DYNAMITE_SLOT_2_CHANGED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Slot 2 "+data+"</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});
	priv_channel.bind('1155_DYNAMITE_SLOT_3_CHANGED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Slot 3 "+data+"</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});
	priv_channel.bind('1155_DYNAMITE_SLOT_4_CHANGED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Slot 4 "+data+"</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});
	priv_channel.bind('1155_DYNAMITE_SLOT_5_CHANGED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Slot 5 "+data+"</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});
	priv_channel.bind('1155_DYNAMITE_SLOT_6_CHANGED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Slot 6 "+data+"</div>";
	    document.getElementById('dynamite_messages').insertBefore(message,document.getElementById('dynamite_messages').firstChild);
	});

	//Backman
	priv_channel.bind('1160_WALL_POKED', function(data) {
            var message = document.createElement('div');
            message.innerHTML = "<div class='messagetitle receivedmessagetitle'>Received: <span class='messagesubtitle'>("+humanTimeStamp()+")</span></div><div class='messagecontent'>Wall Poked</div>";
	    document.getElementById('backman_messages').insertBefore(message,document.getElementById('backman_messages').firstChild);
	});

    </script>
    <style>
        .channel
        {
            float:left;
            width:300px;
            border:1px solid black;
            padding:10px;
            margin:10px;
        }

        .channeltitle
        {
            font-weight:bold;
            color:orange;
        }
        
        .message_area
        {
            height:200px;
            overflow:scroll;
        }

        .message
        {
        }

        .messagetitle
        {
            font-weight:bold;
        }

        .sentmessagetitle
        {
            color:blue;
        }

        .receivedmessagetitle
        {
            color:green;
        }

        .messagesubtitle
        {
            font-size:small;
        }

        .messagecontent
        {
            font-size:small;
        }
    </style>
</head>
<body>
    <div class='channel'>
	<div class='channeltitle'>DRILL</div>
	<div id="drill_1_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
	<div id="drill_2_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
	<div id="drill_3_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
	<div id="drill_4_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
	<div id="drill_5_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
    </div>

    <div class='channel'>
	<div class='channeltitle'>DYNAMITE</div>
	<div id="dynamite_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
    </div>

    <div class='channel'>
	<div class='channeltitle'>BACKMAN</div>
	<div id="backman_messages" class='message_area'>
	    <div>Waiting...</div>
	</div>
    </div>

</body>
</html>

