<?php
/*
require '../BDD.php';

$connector = new BDD();
$connector->connect();

$dbh = $connector->dbh;

$stmt = $dbh->prepare("INSERT INTO place_information (id, isValid, x, y, isFree) 
	VALUES (null, :isValid, :x, :y, :isFree)");
$stmt->bindParam(':isValid', $isValid);
$stmt->bindParam(':x', $x);
$stmt->bindParam(':y', $y);
$stmt->bindParam(':isFree', $isFree);

$d = 0.07;
for($i = 0; $i < 1000; $i++) {
	$x = 6.1375590000000000 + 0.0001 * rand(0, 700);
	$y = 48.7037120000000000 - 0.0001 * rand(0, 700);
	$isFree = 1;
	$isValid = 1;

	$stmt->execute();
}

$connector->disconnect();
*/
?>