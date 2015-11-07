<?php

require 'RestServer/RestServer.php';
require 'MapController.php';

$server = new \Jacwright\RestServer\RestServer('debug');
$server->addClass('MapController');
$server->handle();