<?php

class BDD
{
    var $dbh;

    public function connect() {
        $this->dbh = new PDO('mysql:host=localhost;dbname=thomashe_parkinglibre', 'root', 'root', array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
    }

    public function disconnect() {
        $this->dbh = null;
    }
}