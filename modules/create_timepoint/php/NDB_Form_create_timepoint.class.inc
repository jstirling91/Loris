<?php

/**
 * The forms for the new profile menu
 * @package main
 */
class NDB_Form_create_timepoint extends NDB_Form
{
    /**
     * The subprojectID being created
     */
    var $subprojectID;

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();

        $candidate =& Candidate::singleton($this->identifier);

        // check user permissions
    	return ($user->hasPermission('data_entry') && $user->getData('CenterID') == $candidate->getData('CenterID'));
    }

    function _getDefaults()
    {
        $candidate =& Candidate::singleton($this->identifier);

        $defaults['visitLabel'] = $candidate->getNextVisitLabel();
        return $defaults;
    }

    function _process($values)
    {
        $success = TimePoint::createNew($this->identifier, $values['subprojectID'], $values['visitLabel']);

        $this->tpl_data['success'] = true;

        // freeze it, just in case
        $this->form->freeze();
    }

    function create_timepoint()
    {
        $config =& NDB_Config::singleton();
        if(!empty($_GET['subprojectID']) && is_numeric($_GET['subprojectID'])){
            $this->subprojectID=$_GET['subprojectID'];
        }

        // cand ID
        $this->tpl_data['candID'] = $this->identifier;
        $this->addHidden('candID', $this->identifier);
        $candidate =& Candidate::singleton($this->identifier);
        $subprojList = null; 
        //List of valid subprojects for a given project
        if($config->getSetting('useProjects') === 'true') {
            $subprojList = $candidate->getValidSubprojects();
        }
        // List of all subprojects from config file
        

        //Loop through the subprojects to get an id out and to create the subproject drop down.
        $allSubprojects = Utility::getSubprojectList();
        $sp_labelOptions = array(null => '');

        foreach($allSubprojects as $subprojectID => $title) {
            if( ! empty($subprojList)) {
                if(in_array($subprojectID, $subprojList)){
                    $sp_labelOptions[$subprojectID] = $title;
                }
            } else {
                $sp_labelOptions[$subprojectID] = $title;
            }
        }
        
        $attributes=array("onchange"=>"location.href='?test_name=create_timepoint&candID=".$this->identifier."&identifier=".$this->identifier."&subprojectID='+this[this.selectedIndex].value;");
        $this->addSelect('subprojectID', 'Subproject', $sp_labelOptions, $attributes);
        $this->_setDefaults(array("subprojectID"=>$this->subprojectID));
        
        
        // visit label
        $visitLabelSettings = $config->getSetting('visitLabel');
        $visitLabelAdded = false;

        foreach(Utility::toArray($visitLabelSettings) AS $visitLabel){
            if($visitLabel['@']['subprojectID']==$this->subprojectID){
                if ($visitLabel['generation'] == 'user') {
                    $this->addBasicText('visitLabel', 'Visit label', array('size' => $visitLabel['length'] + 1, 'maxlength' => $visitLabel['length']));
                    $visitLabelAdded = true;
                } elseif ($visitLabel['generation'] == 'sequence') {
                    $labelOptions[''] = null;
                    foreach (Utility::toArray($visitLabel['labelSet']['item']) AS $item) {
                        $labelOptions[$item['@']['value']] = $item['#'];
                    }
                    $this->addSelect('visitLabel', 'Visit label', $labelOptions);
                    $visitLabelAdded = true;
                }
            }
        }
    
        // label rules
        if ($visitLabelAdded) {
            $this->addRule('visitLabel', 'Visit label is required', 'required');
        }

        $this->form->addFormRule(array(&$this, '_validate'));
    }
    
    
    
    function _validate($values)
    {
        $config =& NDB_Config::singleton();
        $visitLabelSettings = $config->getSetting('visitLabel');
        foreach(Utility::toArray($visitLabelSettings) AS $visitLabel){
            if($visitLabel['@']['subprojectID']==$values['subprojectID']){
                $visitLabelSettings=$visitLabel;
                break;
            }
        }
        
        $errors = array();
        
        // This can happen if the user quickly clicks "Create Time Point" before the page has loaded
        // and the Visit Label dropdown hasn't been selected yet. The page will create "V1" when this
        // is the case without this check.
        if(empty($values['visitLabel'])) {
            $errors['visitLabel'] = 'A visit label is required for creating a timepoint.';
        }
        // make sure the user entered a valid visit label
        if ($visitLabelSettings['generation'] == 'user') {
            if (!preg_match($visitLabelSettings['regex'], $values['visitLabel'])) {
                $errors['visitLabel'] = 'This visit label does not match the required structure.  See your project manual for more details.';
            }
        }

        $candidate =& Candidate::singleton($this->identifier);

        $timePointArray = $candidate->getListOfVisitLabels();

        //If the visitLabel is already in use then let the user pick another
        foreach($timePointArray AS $used_label) {
            if(strcasecmp($values['visitLabel'], $used_label) == 0) {
                $errors['visitLabel'] = 'This visit label is not unique.';
            }
        }

        return $errors;
    }

}
?>
