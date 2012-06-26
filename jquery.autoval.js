/*
	jquery.autoval.js
	Plugin jQuery que permite la validación automática de los parámetros especificados en el formulario.
	
	(C) 2012, WonderMath / Guillermo Villafuerte
   	Revisado por Raúl Díaz (Y)
*/

/*
	<ul>
		<li>
			<input [data-validation=regex|null]
				   [data-annulation=regex|null]
				   [data-validationurl=relativeurl|null]
				   [data-validationfield=id|null]
				   [data-infotext=string|null]
				   [data-errortext=string|null]>
			<.feedback [data-icon=info|error|load|ok]>
		</li>
		...
	</ul>
*/

(function( $ ) {

	var sel = 'input[type=text], input[type=search], input[type=url], input[type=tel], input[type=email], textarea';

	// Configuraciones predefinidas del plugin
	var defaults = {
		urlMethod: 'GET',
		remarkPlaceholder: true,
		enablingOnSequence: false,
		disableSubmitBtn: false,
		successfulResponse: true,
		skipAJAXVal: false,
		pseudoHolderColor: '#888',
		defaultTextColor: '#000'
	};

	var options;

	// Lista de métodos del plugin
	var methods = {
		init: function( options ) {
			options = $.extend(defaults, options);
			//console.log('Método init llamado con los parámetros:'); /* Cambiado */
			console.log(options);

			options.defaultTextColor = $(sel, this).css('color');
			if ( options.remarkPlaceholder && !$.support.placeholder ) {
				$(this).find('li').each(function() {
					// Escribir el texto de la etiqueta "placeholder"
					// para cada uno de los campos de texto
					$(sel).each(function() {
						$(this).css('color', options.pseudoHolderColor).val($(this).attr('placeholder'));
						$(this).attr('title', $(this).attr('palceholder'));
					});

					// Convertir los campos tipo "contraseña" en "texto"
					// para mostrar la etiqueta "placeholder"
					$(':password').each(function() {
						if ($(this).val() == '')
							$(this).addClass('waspassword').prop('type', 'text').css('color', options.pseudoHolderColor).val($(this).attr('placeholder'));
					});

					// Añadir a cada campo de cada formulario código para
					// mostrar el texto de la etiqueta "placeholder"
					$(sel).on('focus', function() {
						if ($(this).val() == $(this).attr('placeholder')) {
							$(this).val('').css('color', options.defaultTextColor);
							if ($(this).hasClass('waspassword')) 
								$(this).prop('type', 'password').val('');
						}
					});
					$(sel).on('blur', function() {
						if ($(this).val() == '') {
							$(this).css('color', options.pseudoHolderColor).val($(this).attr('placeholder'));
							if ($(this).hasClass('waspassword')) {
								$(this).prop('type', 'text').css('color', options.pseudoHolderColor).val($(this).attr('placeholder'));
							}
						}
						else if ($(this).hasClass('waspassword'))
							$(this).removeClass('waspassword');
					});

				});
			}

			// Añadir para cada elemento la imagen de 
			// retoralimentación para el usuario
			$(this).find('li').each(function() {
				if (! ($('.feedback', this).length === 1))
					$(this).append('<div class="feedback"></div>');
				$('.feedback', this).attr('data-icon', 'info');
			});

			// PENDIENTE Añadir los eventos correspondientes a la
			// imagen de retroalimentación al usuario

			// PENDIENTE Crear eventos para la validación de cada
			// uno de los campos de texto al ser necesario
			$(this).find('li').each(function() {
				$(sel + ', :password', this).on('blur', function() {
					console.log('AUTOVAL: Valor de campo -> "' + $(this).val() + '"');
					if ( $(this).val() != '' || ( !$.support.placeholder && $(this).val() != $(this).attr('placeholder')) ) {
						console.log('AUTOVAL: Proceso de validación iniciado.');
						var result = methods.validate.apply(this, [this, options]);

						if ( result === 1 ) {
							$(this).parent().find('.feedback').attr('data-icon', 'ok');
							if ( options.enablingOnSequence && options.skipAJAXVal ) {
								console.log('AUTOVAL: Activando siguiente campo.');
								$(this).parent().next().find(sel + ', :password').removeAttr('disabled');
							}
						}
						else if ( result === 0 ) {
							console.log('AUTOVAL: Error de validación en el campo ' + $(this).index() + ' del formulario.');
							$(this).parent().find('.feedback').attr('data-icon', 'warn');
						}
					}
				});
			});


			// Deshabilitar los componentes subsecuentes si
			// la habilitación en secuencia está activada
			if ( options.enablingOnSequence ) {
				$('li ' + sel + ', li :password', this).attr('disabled', '');
				$('li ' + sel + ', li :password', this).filter(':first').removeAttr('disabled');
			}

			return this.each(function() {});
		},

		destroy: function() {

		},

		validate: function ( field, options ) {
			console.log('AUTOVAL: Validando campo ' + ($(field).attr('name') != undefined ? $(field).attr('name') : $(field).attr('id')) + ' del formulario.');
			var isValid;
			
			if ( $(field).attr('data-validation') != undefined ) {
				var regex = new RegExp($(field).attr('data-validation'));
				console.log('AUTOVAL: Validando campo de acuerdo a la expresión regular "data-validation": /' + regex.source + '/');
				if ( regex.test($(field).val()) )
					isValid = true;
				else
					return 0;
			}

			if ( $(field).attr('data-annulation') != undefined ) {
				console.log('AUTOVAL: Validando campo de acuerdo a la expresión regular "data-annulation"');
				var regex = new RegExp($(field).attr('data-annulation'));
				if ( !regex.test($(field).val()) )
					isValid = (!isValid) ? false : true;
				else
					return 0;
			}
			
			if ( $(field).attr('data-validationfield') != undefined ) {
				console.log('AUTOVAL: Validando que el campo concuerde con el asignado en "data-validationfield"');
				var eq = $(field).parent().parent().find('li #'+$(field).attr('data-validationfield')).val();
				if ( eq == $(field).val() )
					isValid = (!isValid) ? false : true;
				else
					return 0;
			}
			
			if ( $(field).attr('data-validationurl') != undefined && !options.skipAJAXVal ) {
				$(field).parent().find('.feedback').attr('data-icon', 'wait');
				var urlstr = $(field).attr('data-validationurl').substring(0, $(field).attr('data-validationurl').lastIndexOf('?'));
				var datastr = $(field).attr('data-validationurl').substring($(field).attr('data-validationurl').lastIndexOf('?') + 1).replace('%VAL%', $(field).val());
				console.log('AUTOVAL: Validando campo de acuerdo a la respuesta de la URL "data-validationurl": { URL: ' + urlstr + ', Datos: ' + datastr + ' }');

				$.ajax({
					url: urlstr,
					data: datastr,
					type: options.urlMethod,
					async: true
				})

				.done(function(data) {
					if (data == options.successfulResponse) {
						console.log('AUTOVAL: Respuesta satisfactoria del servidor.');
						isValid = (!isValid) ? false : true;
						$(field).parent().find('.feedback').attr('data-icon', 'ok');
						if ( options.enablingOnSequence ) {
							console.log('AUTOVAL: Activando siguiente campo.');
							$(field).parent().find('.feedback').attr('data-icon', 'ok');
							$(field).parent().next().find(sel + ', :password').removeAttr('disabled');
						}
					}
					else {
						isValid = false;
						console.log('AUTOVAL: Respuesta satisfactoria NO recibida del servidor.');
						$(field).parent().find('.feedback').attr('data-icon', 'warn');
					}
				})

				.fail(function() {
					isValid = false;
					console.log('AUTOVAL: Respuesta no recibida del servidor.');
					$(field).parent().find('.feedback').attr('data-icon', 'warn');
				});
				return 2;
			}
			else if ( isValid )
				return 1;


			if ( isValid ) {
				$(field).parent().find('.feedback').attr('data-icon', 'ok');
				if ( options.enablingOnSequence && options.skipAJAXVal ) {
					console.log('AUTOVAL: Activando siguiente campo.');
					$(field).parent().next().find(sel + ', :password').removeAttr('disabled');
				}
				return 1;
			}
			else {
				if ( options.skipAJAXVal ) {
					console.log('AUTOVAL: Error de validación en el campo ' + $(this).index() + ' del formulario.');
					$(field).parent().find('.feedback').attr('data-icon', 'warn');
				}
				return 0;
			}
		}

	};


	$.fn.autoval = function(method) {

		// Crear y llenar una variable que nos indique si hay soporte 
		$.support.placeholder = false;
		var p = document.createElement('input');
		if ('placeholder' in p) {
			$.support.placeholder = true;
			console.log('AUTOVAL: Soporte de "placeholder" ' + ($.support.placeholder ? 'activado' : 'desactivado') + '.');
		}

		if ( methods[method] ) {
			options = Array.prototype.slice.call( arguments, 1 );
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		
		else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		}
			
		
		else
			$.error( 'El método ' +  method + ' no existe en el plugin.' );
	}

})( jQuery );