<?php require_once('config.php'); ?>
<!DOCTYPE html>
<html>
<head>
	<title>Seasons Game</title>
	<meta name="viewport" content="width=320; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
	<script type="text/javascript">

		//SEND
		function sendRequest(data){
            var xmlhttp;
            xmlhttp=new XMLHttpRequest();
            xmlhttp.open("POST","push.php",false);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send('event='+data); //Synchronous call
        }

        function message(data){
            sendRequest(data);
        }
	</script>
</head>
<body>
	<table>
		<tr>
			<td>
	<input type="button" value="Food+" onClick="message('food');"></input>
			</td>
			<td>
	<input type="button" value="Health+" onClick="message('health');"></input>
			</td>
			<td>
	<input type="button" value="Heat+" onClick="message('heat');"></input>
			</td>
		</tr>
		<tr>
			<td>
	<input type="button" value="Spring" onClick="message('spring');"></input>
			</td>
			<td>
	<input type="button" value="Summer" onClick="message('summer');"></input>
			</td>
			<td>
	<input type="button" value="Fall" onClick="message('fall');"></input>
			</td>
			<td>
	<input type="button" value="Winter" onClick="message('winter');"></input>
			</td>
		</tr>
	</table>
</body>
</html>
