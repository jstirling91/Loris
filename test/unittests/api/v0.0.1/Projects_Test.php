<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1a/Projects.php';

class Projects_Test extends PHPUnit_Framework_TestCase
{
    /**
     */
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
    }

    function testValidMethods() {
        try {
            $API = new \Loris\API\Projects("GET");
        } catch (\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }
        $this->assertEquals($API->AllowedMethods, ['GET']);
    }
}
?>