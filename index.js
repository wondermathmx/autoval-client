$(document).ready(function() {
	
	$('#register').autoval({
		skipAJAXVal: true
	})

	.submit(function(e) {
		e.preventDefault();
		
	});

});