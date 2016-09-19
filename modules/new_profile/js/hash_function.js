$(document).ready(function(){
	$("#new_profile").submit(function (event) {
		event.preventDefault();
		var first_name    = $("[name=first_name]").val(),
			middle_name   = $("[name=middle_name]").val(),
		 	last_name     = $("[name=last_name]").val(),
		 	mother_name   = $("[name=mother_name]").val(),
		 	date_of_birth = $("[name=dob1]").val(),
		 	gender        = $("[name=gender]").val(),
		 	identifier,
		 	hash;

		if (first_name == "" || last_name == "") {
			alert("Please ensure first and last name are defined");
		} else {
			identifier = first_name + middle_name + last_name + date_of_birth + mother_name;
			hash = asmCrypto.PBKDF2_HMAC_SHA1.hex(identifier, "loris", 1000000, 125 );
			$('<input>').attr({
			    type  : 'hidden',
			    name  : 'hash_value',
			    value : hash
			}).appendTo('#new_profile');
			this.submit();
		}
	});
});