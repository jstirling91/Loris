<?php
/**
 * Data Querying Module
 *
 * PHP Version 5
 *
 * @category Data_Querying_Module
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");

$cdb = CouchDB::singleton();
if($_REQUEST['category']) {
	$category = $_REQUEST['category'];

	$results = $cdb->queryView(
	    "DQG-2.0",
	    "datadictionary",
	    array("reduce" => "false",
	          "startkey" => "[\"$category\"]",
	          "endkey" =>  "[\"$category\", \"ZZZZZZZZ\"]"
	      )
	);
} else if ($_REQUEST['key']) {
	$key = split(',', $_REQUEST['key']);
	// error_log($key);

	$results = $cdb->queryView(
	    "DQG-2.0",
	    "datadictionary",
	    array("reduce" => "false",
	          "key" => "[\"$key[0]\",\"$key[1]\"]"
	      )
	);
}


print json_encode($results);
?>
