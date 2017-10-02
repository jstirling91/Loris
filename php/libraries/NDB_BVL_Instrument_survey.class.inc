<?php

class NDB_BVL_Instrument_survey extends \NDB_BVL_Instrument
{

	/**
     * Return the HTML for the review section of the survey module
     * By default, this will show every question from the parameter_type
     * table for this instrument, but it can be overridden/customized by
     * a instrument if that isn't the desired behaviour.
     *
     * @return string The HTML to be inserted into the review section of
     *                the final page of the survey module for this instrument.
     */
    function getReactReview()
    {
        $DB = Database::singleton();

        $smarty   = new Smarty_neurodb();
        $tpl_data = array();

        $tpl_data['questions'] = $DB->pselect(
            "SELECT Description as question,
            SourceField FROM parameter_type
            WHERE SourceFrom=:TN AND
            SourceField NOT IN ('Validity', 'Administration')",
            array('TN' => $this->testName)
        );

        $Responses = $DB->pselectRow(
            "SELECT * FROM " . $this->testName . " WHERE CommentID=:CID",
            array('CID' => $this->getCommentID())
        );

        foreach ($tpl_data['questions'] as &$row) {
            if (isset($Responses[$row['SourceField']])) {
                $row['response'] = $Responses[$row['SourceField']];
            }
        }

        return $tpl_data;
    }

   	/**
     * Returns a JSON representation of the currently instantiated
     * instrument capatible with the survey module
     *
     * @return string containing valid JSON
     */
    function toDirectJSON()
    {
        $smarty = new Smarty_neurodb;
        //$renderer = new HTML_QuickForm_Renderer_Array($smarty);

        $instrumentJSON = array(
         "form" => array(),
         "testname" => $this->testName,
         "fullname" => $this->getFullName()
        );
        
        $tempForm = array();
        $tempPage = array(
            "Description" => "Top Page",
            "Elements" => array(),
            "GroupType" => "Page",
            "Type" => "ElementGroup",
        );
        $this->_setupForm();
        foreach ($this->form->form as $key => $value) {
            $tempForm[] = PageElementsFormatter::formatElement($value, $key);
        }
        $tempPage["Elements"] = $tempForm;
        
        $this->form->form = array();
        $tempForm = array();
        $instrumentJSON['form'][] = $tempPage;

        $subtests = $this->getSubtestList();
        foreach ($subtests as $subtest) {
            $this->page = $subtest['Name'];
            $this->_setupForm();

            $tempPage = array(
                "Description" => $subtest['Description'],
                "Elements" => array(),
                "GroupType" => "Page",
                "Type" => "ElementGroup",
            );
            foreach ($this->form->form as $key => $value) {
                $tempForm[] = PageElementsFormatter::formatElement($value, $key);
            }
            $tempPage["Elements"] = $tempForm;
            $this->form->form = array();
            $tempForm = array();
            $instrumentJSON['form'][] = $tempPage;
        }

        $instrument = array(
            "Meta" => array(),
            "Elements" => $instrumentJSON["form"],
        );
        return json_encode($instrument);
    }

    function directEntryValidation() {
        $allErrors = array();
        $this->form->directEntry = true;
        $temp = json_decode($this->getReactReview());
        $values = array();

        foreach ($temp->questions as $key => $value) {
            // $this->form->directValues[$value->SourceField] = $value->response;
            $values[$value->SourceField] = $value->response;
        }

        $this->_setupForm();
        $this->form->directValues = $this->getPageValues($this->form->form, $values);
        if (!$this->form->validate()) {
            $allErrors = array_merge($allErrors, $this->form->errors);
        }

        $this->form->form = array();
        $this->form->errors = array();
        $this->XINRules = array();

        $subtests = $this->getSubtestList();
        foreach ($subtests as $subtest) {
            $this->page = $subtest['Name'];
            $this->_setupForm();
            $this->form->directValues = $this->getPageValues($this->form->form, $values);
            error_log(print_r($this->form->directValues, true));

            if (!$this->form->validate()) {
                $allErrors = array_merge($allErrors, $this->form->errors);
            }

            $this->form->form = array();
            $this->form->errors = array();
            $this->XINRules = array();
        }

        if(empty($allErrors)) {
            return true;
        }

        return $allErrors;

    }

    function getPageValues($form, $fullValues) {
        $values = array();
        foreach ($form as $key => $value) {
            if ($value['type'] === 'group') {
                $values = array_merge($values, $this->getPageValues($value['elements'], $fullValues));
            } else if(!in_array($value['type'], array('header', 'static'))) {
                $values[$value['name']] = $fullValues[$value['name']];
            }
        }
        return $values;
    }
}

?>