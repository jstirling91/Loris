<?php
/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled 
 * scan, etc) and link to the appropriate module to further investigate
 * why a scan was excluded by the imaging pipeline scripts.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
/**
 * Implement the menu filter for searching through all violated scans
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */      
class NDB_Menu_Filter_Form_mri_violations extends NDB_Menu_Filter_Form
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        $this->tpl_data['violated_scans_modifications'] 
            = $user->hasPermission('violated_scans_edit');
        return ($user->hasPermission('violated_scans_view_allsites'));
    }

    function _process($values)
    {
        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        $DB =& Database::singleton();
        $user =& User::singleton();
        foreach ($values['resolvable'] AS $key=>$val) {
            $hash = $key;
            $row = $DB->pselectRow(
                    "SELECT * FROM violations_resolved
                    WHERE hash = :hash", array('hash' => $hash));
            
            //if row is found it means that resolve status was previously assigned,
            // check the value and update if needed, else break.
            if(!empty($row)){
                foreach($row as $key2 => $val2){
                    //found matching
                    if($key2 == 'Resolved'){
                        // user input matches DB content, so do nothing.
                        if($val==$val2){
                            break;
                        }
                        // user input doesn't match DB, so we update the DB
                        else{
                            $setArray = array('Resolved'=>(string)$val,'ChangeDate'=>date("Y-m-d H:i:s"));
                            $whereArray = array('hash'=>$hash);
                            $DB->update('violations_resolved', $setArray, $whereArray);
                        }
                    }
                }
            }
            //if row is not found no resolve status was assigned,
            // if selection<>0, then insert new row.
            else{
                // no need to insert to DB for Unresolved value.
                if($val=='unresolved'){
                    continue;
                }
                $newlyResolved = array();
                $newlyResolved['hash'] = $key;                
                $newlyResolved['Resolved'] = (string)$val;
                $newlyResolved['User'] = $user->getUsername();
                $newlyResolved['ChangeDate'] = date("Y-m-d H:i:s");

                // Table 1: mri_protocol_violated_scans
                $ID_mri_protocol_violated_scans = $DB->pselectOne(
                    "SELECT ID
                    FROM mri_protocol_violated_scans 
                    WHERE (:hash = md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run)))",
                    array('hash' => $key)
                    );
                if(!empty($ID_mri_protocol_violated_scans)){
                    $newlyResolved['TypeTable'] = 'mri_protocol_violated_scans';
                    $newlyResolved['ExtID'] = $ID_mri_protocol_violated_scans;
                }
                // Table 2: mri_violations_log
                $ID_mri_violations_log = $DB->pselectOne(
                    "SELECT LogID
                    FROM mri_violations_log
                    WHERE (:hash = md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)))",
                    array('hash' => $key)
                    );
                //echo "ID[2] = ".$ID_mri_violations_log."\n";
                if(!empty($ID_mri_violations_log)){
                    $newlyResolved['TypeTable'] = 'mri_violations_log';
                    $newlyResolved['ExtID'] = $ID_mri_violations_log;
                } 
                
                // Table 3: MRICandidateErrors
                $ID_MRICandidateErrors = $DB->pselectOne(
                    "SELECT ID
                    FROM MRICandidateErrors
                    WHERE (:hash = md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)))",
                    array('hash' => $key)
                    );
                //echo "ID[3] = ".$ID_MRICandidateErrors."\n";
                if(!empty($ID_MRICandidateErrors)){
                    $newlyResolved['TypeTable'] = 'MRICandidateErrors';
                    $newlyResolved['ExtID'] = $ID_MRICandidateErrors;
                } 
                $DB->insert('violations_resolved', $newlyResolved);
            }
        }
        
        $this->tpl_data['success'] = true;
    }

    /**
     * Set up the class and smarty variables to use for the menu filter to 
     * generate the proper query for the menu filter
     * 
     * @return none
     */
    function _setupVariables()
    {
        // set the class variables
        // create user object
        $user =& User::singleton();

        $config =& NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "false") {
            $useProjects = false;
        }
        else{
            $useProjects = true;
        }

        $this->columns = array(
            'v.PatientName',
            'v.Site',
            'v.TimeRun',
            'v.MincFile',
            'v.Series_Description as Series_Description_Or_Scan_Type',
            'v.Problem',
            'v.SeriesUID',
            'v.hash',
            'v.join_id',
            'v.Resolved'
        );
        if ($useProjects) {
            array_splice($this->columns, 1, 0, 'v.Project');
            array_splice($this->columns, 2, 0, 'v.Subproject');
        }

        $this->query = " FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                c.ProjectID as Project,
                s.SubprojectID as Subproject,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem,
                SeriesUID,
                md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run)) as hash,
                mri_protocol_violated_scans.ID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM mri_protocol_violated_scans
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_protocol_violated_scans.ID
            AND violations_resolved.TypeTable='mri_protocol_violated_scans')
            LEFT JOIN candidate c
            ON (mri_protocol_violated_scans.CandID = c.CandID)
            LEFT JOIN session s
            ON (mri_protocol_violated_scans.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = c.CenterID)
            WHERE Resolved is NULL"
            . " UNION " .
            "SELECT PatientName,
                TimeRun,
                c.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)) as hash,
                mri_violations_log.LogID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM mri_violations_log
            LEFT JOIN mri_scan_type
            ON (mri_scan_type.ID=mri_violations_log.Scan_type)
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_violations_log.LogID 
            AND violations_resolved.TypeTable='mri_violations_log')
            LEFT JOIN candidate c
            ON (mri_violations_log.CandID=c.CandID)
            LEFT JOIN session s
            ON (mri_violations_log.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = c.CenterID)
            WHERE Resolved is NULL"
            . " UNION " .
            "SELECT PatientName,
                TimeRun,
                c.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                null,
                Reason,
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)) as hash,
                MRICandidateErrors.ID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID 
            AND violations_resolved.TypeTable='MRICandidateErrors')
            LEFT JOIN candidate c
            ON (SUBSTRING_INDEX(MRICandidateErrors.PatientName,'_',1)=c.PSCID)
            LEFT JOIN session s
            ON (c.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = c.CenterID)
            WHERE Resolved is NULL)
            as v WHERE 1=1";
        $this->order_by = 'v.TimeRun DESC';

        $this->formToFilter = array(
                'PatientName'   => 'v.PatientName',
                'Project'       => 'v.Project',
                'Subproject'    => 'v.Subproject',
                'TimeRun'       => 'v.TimeRun',
                'ProblemType'   => 'v.Problem',
                'Filename'      => 'v.MincFile',
                'Description'   => 'v.Series_Description',
                'SeriesUID'     => 'v.SeriesUID',
                'Site'          => 'v.Site',
        );

        $this->validFilters = array(
            'v.PatientName',
            'v.Project',
            'v.Subproject',
            'v.TimeRun',
            'v.MincFile',
            'v.Problem',
            'v.Series_Description',
            'v.SeriesUID',
            'v.Site',
        );
        return true;
    }

    /**
     * Generate the quickform elements necessary for filter form
     *
     * @return none, but as a side-effect sets up QuickForm variables
     */
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');
        $dateOptions = array(
            'language'        => 'en',
            'format'          => 'YMd',
            'addEmptyOption'  => true,
            'minYear'         => $study['startYear'] - $study['ageMax'],
            'maxYear'         => $study['endYear'] - $study['ageMin']
        );
        $problemOptions = array(
            '' => 'Any',
            'CandID and PSCID do not match database'
            => 'Candidate Mismatch',
            'Could not identify scan type'
            => 'Could not identify scan type',
            'Protocol Violation'
            => 'MRI Protocol Check violation',
            'Visit label does not exist'
            => 'Visit label does not exist'
        );

        $this->addBasicText('PatientName', 'Patient Name');
        $this->addBasicText('Description', 'Series Description or Scan Type');
        $this->addBasicDate('TimeRun', 'Time Run', $dateOptions);
        $this->addBasicText('Filename', 'MincFile');
        $this->addBasicText('SeriesUID', 'Series UID');
        $this->addSelect("ProblemType", "Type of problem", $problemOptions);

        // project
        $list_of_projects = array('' => 'Any') + Utility::getProjectList();
        $this->addSelect(
            'Project',
            'Project',
            $list_of_projects
        );

        // Subproject
        $list_of_subprojects = array('' => 'Any') + Utility::getSubprojectList();
        $this->addSelect(
            'Subproject',
            'Subproject',
            $list_of_subprojects
        );

        // Get sites
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $sites = Utility::getSiteList();
            if(is_array($sites)){
                $sites = array('' => 'All') + $sites;
            }
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        } 
        $this->addSelect('Site', 'Site', $sites);
                
        return true;
    }

    /**
     * Overwrite the setDataTableRows function to exclude fields
     * which were only selected for generating a link, and aren't
     * used for display to the user
     *
     * @param integer $count Offset of page that filter starts on
     *
     * @return none but as a side-effect populates $this->tpl_data['items']
     */
    function _setDataTableRows($count)
    {
        $resolve_options = array(

	        'unresolved'=>'Unresolved',
	        'reran'=>'Reran',
	        'emailed'=>'Emailed site/pending',
	        'inserted'=>'Inserted',
	        'rejected'=>'Rejected',
	        'inserted_flag'=>'Inserted with flag',
            'other'=>'Other');
        // project
        $list_of_projects = Utility::getProjectList();
        $this->tpl_data['projects'] = $list_of_projects;
        // Subproject
        $list_of_subprojects = Utility::getSubprojectList();
        $this->tpl_data['subprojects'] = $list_of_subprojects;

        $list_of_sites = Utility::getSiteList();
        $this->tpl_data['sites'] = $list_of_sites;

        $x=0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key === 'PatientName') {
                    $this->tpl_data['items'][$x]['PatientName'] = $val;
                }
                if ($key === 'join_id') {
                    $this->tpl_data['join_id'] = $val;
                }
                if ($key === 'hash') {
                    $hash = $val;
                }
                if ($key === 'Resolved') {
                    $resolved_index = $val;
                    $optional = array("selected" => (string)$resolved_index);
                    $this->addSelect("$hash", "", $resolve_options, $optional);
                    //setting the 'selected' attribute so the form will show current value.
                    $this->form->form[$hash]['selected'] = $resolved_index;
                    //modifying the SELECT name attr so it'll be treated as an array.
                    $this->form->form[$hash]['name'] = "resolvable[$hash]";
                }
                if ($key === 'Problem') {
                    if($val === "Could not identify scan type"){
                        $this->tpl_data['join_tbl'] = "mri_protocol_violated_scans";
                    }
                    elseif($val === "Protocol Violation"){
                        $this->tpl_data['join_tbl'] = "mri_violations_log";
                    }
                    else{
                        $this->tpl_data['join_tbl'] = "MRICandidateErrors";
                    }
                }
                if ($key === 'SeriesUID') {
                    $this->tpl_data['items'][$x]['series'] = $val;
                }
                else {
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }            
                $i++;
            }
            $x++;
        }
        return true;
    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseurl . "/mri_violations/js/mri_violations_helper.js",
            )
        );
    }
}
?>
