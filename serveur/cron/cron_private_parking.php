<?php
require '../BDD.php';

$connector = new BDD();
$connector->connect();

$dbh = $connector->dbh;

$serviceLink = 'https://geoservices.grand-nancy.org/arcgis/rest/services/public/VOIRIE_Parking/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&f=pjson';

$list = json_decode(file_get_contents($serviceLink));

$stmt = $dbh->prepare("TRUNCATE TABLE private_parking");
$stmt->execute();

$stmt = $dbh->prepare("INSERT INTO private_parking (id, x, y, name, address, freePlaces, capacity, isFull, isClosed, isOpen, tauxOccup, tauxDispo) 
	VALUES (null, :x, :y, :name, :address, :freePlaces, :capacity, :isFull, :isClosed, :isOpen, :tauxOccup, :tauxDispo)");
$stmt->bindParam(':x', $x);
$stmt->bindParam(':y', $y);
$stmt->bindParam(':name', $name);
$stmt->bindParam(':address', $address);
$stmt->bindParam(':freePlaces', $freePlaces);
$stmt->bindParam(':capacity', $capacity);
$stmt->bindParam(':isFull', $isFull);
$stmt->bindParam(':isClosed', $isClosed);
$stmt->bindParam(':isOpen', $isOpen);
$stmt->bindParam(':tauxOccup', $tauxOccup);
$stmt->bindParam(':tauxDispo', $tauxDispo);
foreach ($list->features as $key => $value) {
	$x = $value->geometry->x;
	$y = $value->geometry->y;
	$name = $value->attributes->NOM;
	$address = $value->attributes->ADRESSE;
	$freePlaces = $value->attributes->PLACES;
	$capacity = $value->attributes->CAPACITE;
	$isFull = ($value->attributes->COMPLET == 'true') ? 1 : 0;
	$isClosed = ($value->attributes->FERME == 'true') ? 1 : 0;
	$isOpen = ($value->attributes->OUVERT == 'true') ? 1 : 0;
	$tauxOccup = $value->attributes->TAUX_OCCUP;
	$tauxDispo = $value->attributes->TAUX_DISPO;
	$stmt->execute();
}

$connector->disconnect();
?>