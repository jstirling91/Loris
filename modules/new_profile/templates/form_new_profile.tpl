{if $success}

<p>New candidate created. DCCID: {$candID} PSCID: {$PSCID}<br />
<a href="{$baseurl}/{$candID}/">Access this candidate</a><br />
<a href="{$baseurl}/new_profile/">Recruit another candidate</a></p>

{else}

<script type="text/javascript" src="{$baseurl}/new_profile/js/asmcrypto.min.js"></script>
<script type="text/javascript" src="{$baseurl}/new_profile/js/hash_function.js"></script>

<br />

{foreach from=$form.errors item=error}
    <div class="col-sm-12">
        <label class="error col-sm-12">{$error}</label>
    </div>
{/foreach}

{if $hashEnabled == "true"}
    <div class="col-sm-12 form-group">
    	<label class="col-sm-2">First Name:</label>
		<div class="col-sm-2">
			<input class="form-control input-sm" type="text" name="first_name" />
		</div>
    </div>
    <div class="col-sm-12 form-group">
    	<label class="col-sm-2">Middle Name:</label>
		<div class="col-sm-2">
			<input class="form-control input-sm" type="text" name="middle_name" />
		</div>
    </div>
    <div class="col-sm-12 form-group">
    	<label class="col-sm-2">Last Name:</label>
		<div class="col-sm-2">
			<input class="form-control input-sm" type="text" name="last_name" />
		</div>
    </div>
    <div class="col-sm-12 form-group">
    	<label class="col-sm-2">Mother's Maiden Name:</label>
		<div class="col-sm-2">
			<input class="form-control input-sm" type="text" name="mother_name" />
		</div>
    </div>
{/if}

<form method="post" name="new_profile" id="new_profile" class="form-inline">

	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.dob1.label}</label>
		<div class="col-sm-10">{$form.dob1.html}</div>
	</div>
	<br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.dob2.label}</label>
		<div class="col-sm-10">{$form.dob2.html}</div>
	</div>
	
    {if $form.edc1.html != ""}
    <br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.edc1.label}</label>
		<div class="col-sm-10">{$form.edc1.html}</div>
	</div>
	<br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.edc2.label}</label>
		<div class="col-sm-10">{$form.edc2.html}</div>
	</div>

    {/if}
	<br><br>
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.gender.label}</label>
		<div class="col-sm-10">{$form.gender.html}</div>
	</div>
	<br><br>
    {if $form.PSCID.html != ""}
	<div class="form-group col-sm-12">
		<label class="col-sm-2">{$form.PSCID.label}</label>
		<div class="col-sm-10">{$form.PSCID.html}</div>
	</div>
	<br><br>
    {/if}

    {if $form.ProjectID.html != ""}
    <div class="form-group col-sm-12">
        <label class="col-sm-2">{$form.ProjectID.label}</label>
        <div class="col-sm-10">{$form.ProjectID.html}</div>
    </div>
    <br><br>
    {/if}

	<div class="form-group col-sm-12">
		<input class="btn btn-primary col-sm-offset-2 col-sm-2" name="fire_away" value="Create" type="submit" />
	</div>
{$form.hidden}
</form>

{/if}
