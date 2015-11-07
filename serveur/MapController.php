<?php

use \Jacwright\RestServer\RestException;

require 'BDD.php';

class MapController
{
    /**
     * Returns a JSON string object to the browser when hitting the root of the domain
     *
     * @url GET /
     */
    public function test()
    {
        return "Hello World";
    }

    /**
     * Search for a free place
     *
     * @url GET /map/findFreePlaces/$x/$y/$radius
     * @url GET /map/findFreePlaces/$x/$y/$radius/$limit
     * @url GET /map/findFreePlaces/$x/$y/$radius/$limit/$radiusBary
     */
    public function findFreePlaces($x, $y, $radius = 100, $limit = 100, $radiusBary = 5) {
        $alpha = ($radius / 6378137) * (180 / pi());

        $connector = new BDD();
        $connector->connect();

        $dbh = $connector->dbh;
        $dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        $sth = $dbh->prepare('SELECT *
                                FROM private_parking
                                WHERE x > :x_min AND x < :x_max
                                    AND y > :y_min AND y < :y_max
                                    AND freePlaces > 0
                                LIMIT :max_limit');
        $sth->bindValue(':x_min', strval(floatval($x) - $alpha), PDO::PARAM_STR);
        $sth->bindValue(':x_max', strval(floatval($x) + $alpha), PDO::PARAM_STR);
        $sth->bindValue(':y_min', strval(floatval($y) - $alpha), PDO::PARAM_STR);
        $sth->bindValue(':y_max', strval(floatval($y) + $alpha), PDO::PARAM_STR);
        $sth->bindValue(':max_limit', $limit, PDO::PARAM_INT);
        $sth->execute();
        $resultPrivate = $sth->fetchAll(PDO::FETCH_ASSOC);

        $sth = $dbh->prepare('SELECT *
                                FROM place_information
                                WHERE x > :x_min AND x < :x_max
                                    AND y > :y_min AND y < :y_max
                                    AND isFree = 1 AND isValid = 1
                                LIMIT :max_limit');
        $sth->bindValue(':x_min', strval(floatval($x) - $alpha), PDO::PARAM_STR);
        $sth->bindValue(':x_max', strval(floatval($x) + $alpha), PDO::PARAM_STR);
        $sth->bindValue(':y_min', strval(floatval($y) - $alpha), PDO::PARAM_STR);
        $sth->bindValue(':y_max', strval(floatval($y) + $alpha), PDO::PARAM_STR);
        $sth->bindValue(':max_limit', $limit, PDO::PARAM_INT);
        $sth->execute();
        $resultPublic = $sth->fetchAll(PDO::FETCH_ASSOC);

        $dist = ($radiusBary / 6378137) * (180 / pi());
        $alreadyVisited;
        $newResultPublic = array();
        foreach ($resultPublic as $key => $value) {
            if(isset($alreadyVisited[$value['id']]))
                    continue;

            $sth->bindValue(':x_min', strval(floatval($value['x']) - $dist), PDO::PARAM_STR);
            $sth->bindValue(':x_max', strval(floatval($value['x']) + $dist), PDO::PARAM_STR);
            $sth->bindValue(':y_min', strval(floatval($value['y']) - $dist), PDO::PARAM_STR);
            $sth->bindValue(':y_max', strval(floatval($value['y']) + $dist), PDO::PARAM_STR);
            $sth->bindValue(':max_limit', $limit, PDO::PARAM_INT);

            $sth->execute();
            $result = $sth->fetchAll(PDO::FETCH_ASSOC);

            $nb = 1;
            $bx = floatval($value['x']);
            $by = floatval($value['y']);
            foreach ($result as $proxKey => $proxValue) {
                if(isset($alreadyVisited[$proxValue['id']]) || $proxValue['id'] == $value['id'])
                    continue;

                $alreadyVisited[$proxValue['id']] = true;
                $bx += floatval($proxValue['x']);
                $by += floatval($proxValue['y']);
                ++$nb;
            }

            if($nb > 1) {
                $bx /= $nb;
                $by /= $nb;
            }

            $value['x'] = $bx;
            $value['y'] = $by;
            $value['nbNeighbors'] = $nb;

            $newResultPublic[] = $value;

            $alreadyVisited[$value['id']] = true;
        }

        $connector->disconnect();

        $composed = array('private' => $resultPrivate, 'public' => $newResultPublic);

        return $composed;
    }

    /**
     * Add an information about places
     *
     * @url POST /map/addPlaceInformation
     */
    public function addPlaceInformation($data) {
        if(isset($data->x) && isset($data->y) && isset($data->isFree)) {
            $connector = new BDD();
            $connector->connect();

            $dbh = $connector->dbh;

            $sth = $dbh->prepare('INSERT INTO place_information (id, isValid, x, y, isFree) VALUES (null, :valid, :x, :y, :isFree)');
            $sth->bindValue(':valid', 1);
            $sth->bindValue(':x', $data->x);
            $sth->bindValue(':y', $data->y);
            $sth->bindValue(':isFree', $data->isFree == 'true');

            $valid = $sth->execute();

            $connector->disconnect();

            return $valid;
        }
        return false;
    }

    /**
     * Random sensibilization sentence
     *
     * @url GET /sensibilization
     */
    public function getRandomSensibilizationSentence() {
        $connector = new BDD();
        $connector->connect();

        $dbh = $connector->dbh;

        $sth = $dbh->prepare('SELECT * FROM sensibilization_sentence ORDER BY RAND() LIMIT 1');

        $sth->execute();

        $result = $sth->fetchAll(PDO::FETCH_ASSOC);

        $connector->disconnect(); 

        return $result;       
    }

    /**
     * Throws an error
     * 
     * @url GET /error
     */
    public function throwError() {
        throw new RestException(401, "Empty password not allowed");
    }
}