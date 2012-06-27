/*
	jquery.autoval.js
	Versión 0.1.26062012
	Plugin jQuery que permite la validación automática de los parámetros especificados en el formulario.
	
	(C) 2012, WonderMath:
		Guillermo Villafuerte
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

			// Crear y llenar una variable que nos indique si hay soporte 
			$.support.placeholder = false;
			var p = document.createElement('input');
			if ('placeholder' in p) {
				$.support.placeholder = true;
				console.log('AUTOVAL: Soporte de "placeholder" ' + ($.support.placeholder ? 'activado' : 'desactivado') + '.');
			}

			options = $.extend(defaults, options);
			console.log('Método init llamado con los parámetros:');
			console.log(options);

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
					if ( $(this).val() != '' || (!$.support.placeholder && $(this).val() != $(this).attr('placeholder')) ) {
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

						// Habilitar el botón de envío si el formulario tiene todos los campos validados
						if ( options.disableSubmitBtn && methods.isAllValid.apply(this) )
							$('button[type=submit]', this).removeAttr('disabled');
					}
				});
			});


			// Deshabilitar los componentes subsecuentes si
			// la habilitación en secuencia está activada
			if ( options.enablingOnSequence ) {
				$('li ' + sel + ', li :password', this).attr('disabled', '');
				$('li ' + sel + ', li :password', this).filter(':first').removeAttr('disabled');
			}

			// Deshabilitar el botón de envío del formulario de ser necesario
			if ( options.disableSubmitBtn ) {
				$('button[type=submit]', this).attr('disabled', '');
			}

			return this.each(function() {});
		},

		destroy: function() {

		},

		validate: function ( field, options ) {
			console.log('AUTOVAL: Validando campo ' + ($(field).attr('name') != undefined ? $(field).attr('name') : $(field).attr('id')) + ' del formulario.');
			var isValid;
			
			// Comprobar la expresión regular "data-validation" con el valor del campo
			if ( $(field).attr('data-validation') != undefined ) {
				var regex = new RegExp($(field).attr('data-validation'));
				console.log('AUTOVAL: Validando campo de acuerdo a la expresión regular "data-validation": /' + regex.source + '/');
				if ( !regex.test($(field).val()) )
					return 0;
			}

			// Comprobar la expresión regular "data-annulation" con el valor del campo
			if ( $(field).attr('data-annulation') != undefined ) {
				console.log('AUTOVAL: Validando campo de acuerdo a la expresión regular "data-annulation"');
				var regex = new RegExp($(field).attr('data-annulation'));
				if ( regex.test($(field).val()) )
					return 0;
			}
			
			// Comprobar el valor del campo definido en "data-validationfield" con el actual
			if ( $(field).attr('data-validationfield') != undefined ) {
				console.log('AUTOVAL: Validando que el campo concuerde con el asignado en "data-validationfield"');
				var eq = $(field).parent().parent().find('li #'+$(field).attr('data-validationfield')).val();
				console.log('AUTOVAL: Comparación de valor origen "' + $(field).val() + '" con valor destino "' + eq + '"');
				if ( eq != $(field).val() )
					return 0;
			}
			
			// Verificar si se debe validar a nivel servidor el campo
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
						$(field).parent().find('.feedback').attr('data-icon', 'ok');
						if ( options.enablingOnSequence ) {
							console.log('AUTOVAL: Activando siguiente campo.');
							$(field).parent().find('.feedback').attr('data-icon', 'ok');
							$(field).parent().next().find(sel + ', :password').removeAttr('disabled');
						}
					}
					else {
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
			else
				return 1;
		},

		isAllValid: function() {
			// Verificar que todos los campos hayan sido validados de manera adecuada
			var isValid; var items = $(sel + ', :password', this);
			for ( var i; i < items.size(); i++ ) {
				isValid = (!isValid) ? false : items[i].parent().find('.feedback[data-icon=ok]').size();
			}
			console.log('AUTOVAL: ¿Han sido todos los campos validados?' + (isValid ? ' SÍ.' : ' NO'));
			return isValid;
		}

	};


	$.fn.autoval = function(method) {

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