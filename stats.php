<html>
<head>
</head>
<body>
<?php
conn = @mysql_connect(Config::dbHost, Config::dbUser, Config::dbPass);
mysql_set_charset('utf8');
mysql_select_db(Config::dbSchema);

function getItemCountForDate($itemId, $date)
{
    return mysql_fetch_object(mysql_query("SELECT count(*) as count FROM player_items WHERE game_id = '5252' AND item_id = '".$itemId."' AND timestamp LIKE '".$date." %'"))->count
}

$d = $_GET['date'];
$ftl1 = getItemCountForDate(47022,$d);
$ftl2 = getItemCountForDate(47023,$d);
$ftc1 = getItemCountForDate(26267,$d);
$ftc2 = getItemCountForDate(20278,$d);
$iml1 = getItemCountForDate(17247,$d);
$iml2 = getItemCountForDate(17248,$d);
$imc1 = getItemCountForDate(31619,$d);
$imc2 = getItemCountForDate(26255,$d);
$shl1 = getItemCountForDate(18417,$d);
$shl2 = getItemCountForDate(18419,$d);
$shc1 = getItemCountForDate(26271,$d);
$shc2 = getItemCountForDate(0,$d);
?>

<table>
<tr>
<td>Fur Trade</td>
</tr>
<tr>
<td>Level 1</td><td><?php echo($ftl1); ?></td>
<td>Level 2</td><td><?php echo($ftl2); ?></td>
<td>Chap 1</td><td><?php echo($ftc1); ?></td>
<td>Chap 2</td><td><?php echo($ftc2); ?></td>
</tr>
<tr>
<td>Iron Mine</td>
</tr>
<tr>
<td>Level 1</td><td><?php echo($iml1); ?></td>
<td>Level 2</td><td><?php echo($iml2); ?></td>
<td>Chap 1</td><td><?php echo($imc1); ?></td>
<td>Chap 2</td><td><?php echo($imc2); ?></td>
</tr>
<tr>
<td>Sod House</td>
</tr>
<tr>
<td>Level 1</td><td><?php echo($shl1); ?></td>
<td>Level 2</td><td><?php echo($shl2); ?></td>
<td>Chap 1</td><td><?php echo($shc1); ?></td>
<td>Chap 2</td><td><?php echo($shc2); ?></td>
</tr>
</table>
</body>
</html>
