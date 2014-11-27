{literal}
<style type="text/css">
    .tree{
        overflow-x: auto
    }
    #home-dir{
        padding-left: 0px;
    }
    .file_name{
        float: left;
        border: 1px solid #999;
    }
    .version{
        width: 30px;
        float: left;
        border: 1px solid #999;
    }
    .file_type{
        width: 50px;
        float: left;
        border: 1px solid #999;
    }
    .instrument{
        width: 100px;
        float: left;
        border: 1px solid #999;
    }
    .updated_by{
        width: 100px;
        float: left;
        border: 1px solid #999;
    }
    .for_site{
        width: 100px;
        float: left;
        border: 1px solid #999;
    }
    .comments{
        width: 300px;
        float: left;
        border: 1px solid #999;
    }
    .date_uploaded{
        width: 150px;
        float: left;
        border: 1px solid #999;
    }
    .editLink{
        width: 50px;
        float: left;
        border: 1px solid #999;
    }
    .deleteLink{
        width: 50px;
        float: left;
        border: 1px solid #999;
    }
</style>
<script type="text/javascript" src="js/modules/mustache.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    var fileDir = {/literal}{$File_categories|json_encode}{literal}
    for(var i in fileDir){
        if(fileDir[i]){
            var dir = fileDir[i];
            var path = dir.CategoryName.split(">");
            var depth = path.length;
            var elm = document.createElement("li");
            elm.innerHTML = "<span class='glyphicon glyphicon-folder-close'> " + path[depth - 1] + "</span>";
            elm.setAttribute("id", path[depth - 1]);

            //new table layout
            var directory = $('#dir').html();
            Mustache.parse(directory);
            var dirData = {
                name: path[depth - 1],
                indent: function(){
                    return (depth - 1)*15;
                }
            }
            var renderDir = Mustache.render(directory, dirData);

            if(depth == 1) {
                $("#home-dir").append(elm);
                //new table layout
                $("#dir-tree").append(renderDir);
            } else {
                elm.setAttribute("style", "display: none;");
                $("#" + path[depth - 2] + "First").before(elm);
                //new table layout
                $("#" + path[depth - 2] + "a").after(renderDir);
            }
            var children = document.createElement("ul");
            children.setAttribute("id", path[depth - 1] + "Children");
            elm.appendChild(children);
            var files = fileDir[i].Files;
            for(var ii in files) {
                var template = $('#template').html();
                Mustache.parse(template);   // optional, speeds up future uses
                files[ii].fileNameWidth = 500 - (depth - 1) * 70;
                var rendered = Mustache.render(template, files[ii]);
                $("#" + path[depth - 1] + "Children").append(rendered);

                //new table layout
                var file = $('#file').html();
                Mustache.parse(file);   // optional, speeds up future uses
                files[ii].indent = (depth)*30;
                var renderedFile = Mustache.render(file, files[ii]);
                $("#" + path[depth - 1] + "a").after(renderedFile);
            }
            if($("#" + path[depth - 1] + "Children").children().first().html()) {
                $("#" + path[depth - 1] + "Children").children().first().attr("id", path[depth - 1] + "First")
            }
        }
    }
});
$(function () {
    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).addClass('glyphicon-folder-close').removeClass('glyphicon-folder-open');
        } else {
            children.show('fast');
            $(this).addClass('glyphicon-folder-open').removeClass('glyphicon-folder-close');
        }
        e.stopPropagation();
    });
});
</script>
<script id="dir" type="x-tmpl-mustache">
    <tr id="{{ name }}a">
        <td style="text-indent: {{ indent }}px;">
            <span class='glyphicon glyphicon-folder-close'>
                {{ name }}
            </span>
        </td>
        <td colspan="9"></td>
    </tr>
</script>
<script id="file" type="x-tmpl-mustache">
    <tr>
        <td style="padding-left: {{ indent }}px;">
            {{ File_name }} ({{ File_size }})
        </td>
        <td>
            {{ version }}
        </td>
        <td>
            {{ File_type }}
        </td>
        <td>
            {{ instrument }}
        </td>
        <td>
            {{ uploaded_by }}
        </td>
        <td>
            {{ For_site }}
        </td>
        <td>
            {{ comments }}
        </td>
        <td>
            {{ Date_uploaded }}
        </td>
        <td>
            Edit
        </td>
        <td>
            Delete
        </td>
    </tr>
</script>

<script id="template" type="x-tmpl-mustache">
    <li class="fileLI" style="display: none;">
        <div style="display: table; width: 1430px">
            <div class="file_name" style="width: {{ fileNameWidth }}px;">
                {{ File_name }} ({{ File_size }})
            </div>
            <div class="version">
                <p>
                    {{ version }}
                </p>
            </div>
            <div class="file_type">
                <p>
                    {{ File_type }}
                </p>
            </div>
            <div class="instrument">
                <p>
                    {{ instrument }}
                </p>
            </div>
            <div class="updated_by">
                <p>
                    {{ uploaded_by }}
                </p>
            </div>
            <div class="for_site">
                <p>
                    {{ For_site }}
                </p>
            </div>
            <div class="comments">
                <p>
                    {{ comments }}
                </p>
            </div>
            <div class="date_uploaded">
                <p>
                    {{ Date_uploaded }}
                </p>
            </div>
            <div class="editLink">
                Edit
            </div>
            <div class="deleteLink">
                Delete
            </div>
        </div>
    </li>
</script>
{/literal}

<form method="post" action="main.php?filtered=true&test_name=document_repository" id = "filterForm">
<table border="0" class="std" id = "filterTable" data-filter = "{$filtered}">
    <tr>
        <th nowrap="nowrap" colspan="8">Selection Filter</th>
    </tr>
    <tr>
        <td>{$form.File_name.label}</td>
        <td>{$form.File_name.html}</td>
        <td>{$form.version.label}</td>
        <td>{$form.version.html}</td>
        <td>{$form.uploaded_by.label}</td>
        <td>{$form.uploaded_by.html}</td>
    </tr>
    <tr>
        <td>{$form.File_type.label}</td>
        <td>{$form.File_type.html}</td>
        <td>{$form.For_site.label}</td>
        <td>{$form.For_site.html}</td>
    </tr>
    <tr>

        <td colspan="6" align="right"><input type="submit" name="filter" value="Show Data" class="button" />&nbsp;<input type="button" name="reset" value="Clear Form" class="button" onclick="location.href='main.php?test_name=document_repository&reset=true'" /></td>
        <td align="right"><button id = "upload" name = "upload" class = "button">Upload File</button></td>
        <td align="right"><button id = "addCategory" name = "addCategory" class = "button" onclick="return false;">Add Category</button></td>
    </tr>
</table>
</form>

<div class="tree">
    <ul id="home-dir">

    </ul>
</div>
                
<div class = "ui-accordion ui-widget ui-helper-reset">
<table border="0" width="80%" id = "accordionTable" class="docRepository" data-open = "{$openAccordion}">
<tr>
    {section name=header loop=$headers}
        <th nowrap="nowrap" class="accordionHeaders">
            {if $headers[header].displayName == "Edit" || $headers[header].displayName == "Delete"}
                {$headers[header].displayName}
            {else}
                <a href="main.php?openAccordion=true&test_name=document_repository&filter[order][field]={$headers[header].name}&filter[order][fieldOrder]={$headers[header].fieldOrder}" class = "sortHeaders">
                    {$headers[header].displayName}
                </a>
            {/if}
        </th>
    {/section}
</tr>

<!-- <table class="table table-striped">
    <tbody id="dir-tree">
        
    </tbody>
</table> -->






<div id="accordion" class="ui-accordion ui-widget ui-helper-reset ui-accordion-icons" role="tablist">
{foreach from=$File_categories item=val key=k}
    {if $val != "Any"}
        <tr>
                <td nowrap="nowrap" colspan = "11">
                    <h3 id = "header_{$File_categories[$k].CategoryName|replace:' ':'_'|replace:'>':'_'}" class="categories_header ui-accordion-header ui-helper-reset  ui-state-default ui-corner-all" style="background-color: #e0dde2; padding: 3px; color:black;" align="left">{$File_categories[$k].CategoryName}
                        <span class="tip">...
                            <span id="categorycomment{$k}" class="categorycomments" name="headercomment_{$File_categories[$k].CategoryName|replace:' ':'_'|replace:'>':'_'}" contenteditable="true">
                                {$File_categories[$k].Comment}
                            </span>
                </span>
            </h3>
        </tr>
        {section name=file loop=$File_categories[$k].Files}
            {assign var="FileDetails" value=$File_categories[$k].Files[file]}
            <tr class="categories ui-accordion ui-widget ui-helper-reset ui-accordion-icons">
                <td class="File_name" nowrap="nowrap">
                    <a href="AjaxHelper.php?Module=document_repository&script=GetFile.php&File={$FileDetails.Data_dir}" target="_blank" download="{$FileDetails.File_name}">{$FileDetails.File_name}</a> ({$FileDetails.File_size})
                </td>
                <td class="version" nowrap="nowrap">{$FileDetails.version}</td>
                <td class="File_type" nowrap="nowrap">{$FileDetails.File_type}</td>
                <td class="Instrument" nowrap="nowrap">{$FileDetails.Instrument}</td>
                <td class="uploaded_by" nowrap="nowrap">{$FileDetails.uploaded_by}</td>
                <td class="For_site" nowrap="nowrap">{$FileDetails.For_site}</td>
                <td class="comments" nowrap="nowrap">{$FileDetails.comments}</td>
                <td class="Date_uploaded" nowrap="nowrap">{$FileDetails.Date_uploaded}</td>
                <td nowrap="nowrap">
                    <a href="#" id="{$FileDetails.record_id}" class="theeditlink">Edit</a>
                </td>
                <td nowrap="nowrap">
                    <a href="#" id="{$FileDetails.record_id}" class="thedeletelink">Delete</a>
                </td>
            </tr>
        {/section}
    {/if}
{/foreach}
</div> <!--end of toggle div-->

<div class = "dialog">
<div class = "sure" title="Please Confirm" >
    <p>
        <span class="ui-icon ui-icon-trash" style="float:left; margin:0 7px 50px 0;"></span>
	    Are you sure you want to delete this file?
    </p>
</div>
</div>


<form id="addCategory" action="AjaxHelper.php?Module=document_repository&script=addCategory.php" method="POST">
<div class = "addCategory" title="Add Category">
    <p>
        What category would you like to add?
    </p>

<fieldset id="addCategoryForm" style = "border: none; width:125px !important; height:150px !important;">
	Category Name: <input type="text" name="category_name" />
	<br>
	Parent: 
        <select name="parent_id" id="parent_id">
        <option value=" "> </option>
            {foreach from = $File_categories item=val key=k}
                {if $val != "Any"}
                        <option value={$k}>{$val.CategoryName}</option>
                    {/if}
            {/foreach}
        </select>
	<br>
	Comments: <input type="text" name="comments" />
</fieldset>
</div>
</form>
</div>


<div id="uploadArea" class = "dialog-form" style = "border-style: solid; border-color: #7c7781; border-width:1px; margin: 1em !important; width:390px !important; height:auto !important;" title="Upload new file">
<form name = "uploadForm" id = "uploadForm" method = "POST" enctype="multipart/form-data" action="AjaxHelper.php?Module=document_repository&script=documentEditUpload.php">
<div class = "upload-error">
    <p style = "color: #f33;">
	    <span class="ui-icon ui-icon-alert" style = "float:left;"></span>
	    Please enter all required (*) fields.
    </p>
</div>
<div class = "file-error">
    <p style = "color: #f33;">
	    <span class="ui-icon ui-icon-alert" style = "float:left;"></span>
	    Please choose a file to upload.
</p>
</div>

<fieldset style = "border: none;">
	<label for="category">Category<font color="red"><sup> *</sup></font></label>
	<select name="category" id = "category" class = "form-fields">
	<option value=" "> </option>
	    {foreach from = $File_categories item=val key=k}
	        {if $val != "Any"}
 		        <option value={$k}>{$val.CategoryName}</option>
		{/if}
	    {/foreach}
	</select>
	</br></br>
	<label for="site">Site<font color="red"><sup> *</sup></font></label>
	<select name="site" id = "site" class = "form-fields">
	<option value=" "> </option>
	    {foreach from = $Sites item=val key=k}
	        <option value={$k}>{$val}</option>
	    {/foreach}
	</select>
	</br></br>
        <label for="instrument">Instrument<font color="red"><sup> *</sup></font></label>
        <select name="instrument" id = "instrument" class = "form-fields">
        <option value=""> </option>
            {foreach from = $Instruments item=val key=k}
                <option value={$k}>{$val}</option>
            {/foreach}
        </select>
        </br></br>
	<label for="pscid">PSCID</label>
	<input type="text" size = "27" name="pscid" id="pscid" class="ui-corner-all form-fields" /></br></br>
	<label for="visit">Visit label</label>
	<input type="text" size = "27" name="visit" id="visit" class="ui-corner-all form-fields" /></br></br>
	<label for="comments">Comments</label>
	<textarea cols = "20" rows = "3" name="comments" id="comments" style = "border: 2px inset;" class="ui-corner-all form-fields"> </textarea><p></p><br></br>
	<label for="file">File<font color="red"><sup> *</sup></font></label>
	<span class="file-wrapper">
  		<input type="file" name="file" id="file" style = "margin-left: 1em;"/>
  	<span class="button-file ui-button-text ui-widget ui-state-default ui-corner-all ui-button-text-only" role = "button" aria-disabled = "false" style = "margin-left:10.5em; padding: 0.5em;">Choose file</span>
	<span class="fileName"></span>
    </span>
    </br></br>
	<label for="version">Version</label>
	<input type="text" size = "27" name="version" id="version" class="ui-corner-all form-fields" /></br></br>
	<input type="hidden" name = "user" id = "user" value = "{$User}">
	<input type="hidden" name = "action" id = "action" value = "upload">
	<input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="100000000" />
	</fieldset>
	</br></br>
	<div class="ui-dialog-buttonset dialog">
	<button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id = "cancelButton" role="button" aria-disabled="false" style = "float:right;"><span class="ui-button-text">Cancel</span></button>
	<button type="submit" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" id = "uploadButton" role="button" aria-disabled="false" style = "float:right;"><span class="ui-button-text">Upload</span></button>
	</div>
</form>
</div>


<!--The Edit Dialog-->
<div class = "dialog-form-edit dialog" style = "border-style: solid; border-color: #7c7781; border-width:1px; margin: 1em !important; width:390px !important; height:300px !important;" title="Edit file">
<p class="validateTips"></p>

<form name = "editForm" id = "editForm" method = "post"> 
<fieldset style = "border: none;">
	<label for="category">Category</label>
	<select name="category" id = "categoryEdit" class = "form-fields">
	<option value=""> </option>
	    {foreach from = $File_categories item=val key=k}
            {if $val != "Any"}
        	    <option value={$k}>{$val.CategoryName}</option>
        	{/if}
	    {/foreach}
	</select>
	</br></br>
	<label for="site">Site</label>
	<select name="site" id = "siteEdit" class = "form-fields">
	<option value=""> </option>
	    {foreach from = $Sites item=val key=k}
	        <option value={$k}>{$val}</option>
	    {/foreach}
	</select>
	</br></br>
        <label for="instrument">Instrument<font color="red"><sup> *</sup></font></label>
        <select name="instrument" id = "instrumentEdit" class = "form-fields">
        <option value=""> </option>
            {foreach from = $Instruments item=val key=k}
                <option value={$k}>{$val}</option>
            {/foreach}
        </select>
        </br></br>
        <label for="pscid">PSCID</label>
        <input type="text" size = "27" name="pscid" id="pscidEdit" class="ui-corner-all form-fields" /></br></br>
        <label for="visit">Visit label</label>
        <input type="text" size = "27" name="visit" id="visitEdit" class="ui-corner-all form-fields" /></br></br>
        <label for="comments">Comments</label>
        <textarea cols = "20" rows = "3" name="comments" id="commentsEdit" style = "border: 2px inset;" class="ui-corner-all form-fields"> </textarea><p></p><br></br>
        <label for="version">Version</label>
        <input type="text" size = "27" name="version" id="versionEdit" class="ui-corner-all form-fields" /></br></br>
	    <input type="hidden" name = "action" id = "actionEdit" value = "edit">
</fieldset>
</form>
</div>

<div class = "upload-success">
    <p>
	    <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
	    The file was successfully uploaded. Loading changes in 3 seconds...
    </p>
</div>

<div class = "edit-success">
    <p>
	    <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
	    The file was successfully modified. Loading changes in 3 seconds...
    </p>
</div>

<div class = "delete-success">
    <p>
	    <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
	    The file was successfully deleted. Loading changes in 3 seconds...
    </p>
</div>

<div class = "add-success">
    <p>
            <span class="ui-icon ui-icon-circle-check" style = "float:left;"></span>
            New category successfully added! Loading changes in 3 seconds...
    </p>
</div>

<div class = "no-files">
    <p>
	    <span class="ui-icon ui-icon-info" style = "float:left;"></span>
	    No files were found.
    </p>
</div>

</br>

</table>
</div>
