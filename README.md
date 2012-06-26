# AutoVal #
Plugin jQuery que permite la validación automática de los campos de texto en un formulario.
Este plugin será utilizado conforme se va desarrollando en el sitio [WonderMath](http://wondermathmx.info/) y se hará disponible aquí en GitHub, permitiendo su modificación e implementación en otro sitio de tu interés.

## Requisitos ##
Por el momento, AutoVal sólo requiere de que [jQuery](http://jquery.com/) esté incluido en el sitio, pero en una versión futura dependerá también del plugin [qTip2](http://craigsworks.com/projects/qtip2/) para mostrar infromación y errores de validación del campo en cuestión.

## Uso básico ##

### Código HTML ###
El código HTML del formulario deberá incluir una lista sin ordenar, dentro de la cual, en cada elemento de la lista, se deberá incluir un elemento de tipo input. El código puede ser parecido a lo siguiente:

	<form id="login">
		<ul>
			<li><input type="text" id="username" data-validation="^[a-z0-9]{5,15}$" data-annulation="[\s]*" data-validationurl="/usuarios/chequeo?username=%VAL%" placeholder="Nombre de usuario" maxlength="15" /></li>
			<li><input type="password" id="password" /></li>
		</ul>
	</form>

### Atributos HTML ###
El plugin se basará en los atributos que cada uno de los campos contengan para la validación de los datos. Los atributos hasta el momento reconocidos son:

* **`data-validation`**: Especifica una expresión regular la cual debe cumplirse para que el valor sea validado de manera existosa.  
Ejemplo: `^[a-z0-9]{5-15}$` establece que el campo debe tener de 5 a 15 caracteres de longitud y sólo puede contener letras minúsuculas y/o números.

* **`data-annulation`**: Define la expresión regular que declarará como nulo el valor de algún campo, es decir, que la expresión NO deberá cumplirse para que el campo sea correctamente validado.  
Ejemplo: `[A-Z_\-]*` definirá que si hay mayúsculas o guiones en el campo, éste se considere nulo.

* **`data-validationfield`**: Debe contener el ID de algún campo en el formulario con el cual se cotejará que tanto el valor del mismo como el del campo siendo validado sean idénticos.  
Esto es útil para confirmar algún dato, como correo electrónico o contraseña.

* **`data-validationurl`**: Debe contener una URL relativa al sitio en cuestión con la cual se preguntará al servidor si el valor que el usuario introdujo es válido. Si no se cancela la validación AJAX con la opción `skipAJAXVal` a `true` en entorno de localhost o servidor de prueba, se pueden tener resultados inesperados.  
El plugin esperará que se devuelva `true` por defecto, se puede personalizar el valor satisfactorio estableciendo la opción `successfulResponse` al valor deseado.

Más información de las configuraciones preestablecidas, en la parte inferior de este documento.

### Código jQuery ###

El plugin debe ser llamado mediante el contexto de un selector a un formulario.  
Para el ejemplo anterior, lo siguiente ejecutará el plugin con las opciones predeterminadas:

	$(document).ready(function() {
		$('#login').autoval();
	});

En caso de que se requiera modificar alguna de las opciones predeterminadas, estas se deberán pasar como un argumento a la función `autoval()`, de la siguiente manera:

	$('#login').autoval({
		// aquí van las opciones configuradas a tu gusto
	});


## Configuraciones predefinidas ##
Las configuraciones predefinidas del plugin son las siguientes:

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


### Descripción de opciones ###
El programa permite la configuración de varios atributos, conforme a los valores indicados arriba:

* **`urlMethod`**: Permite definir el método utilizado para la validación mediante URL.  
De tipo cadena, puede ser 'GET' o 'POST'.

* **`remarkPlaceholder`**: Define si se escribirá el texto del atributo "placeholder" en navegadores que no lo soporten.  
De tipo booleano, solo puede ser true o false.

* **`enablingOnSequence`**: Establece si se desactivan todos los campos de texto presentes en el formulario excepto el primero, con la finalidad de forzar la secuencia de llenado de un formulario.  
De tipo booleano, solo puede ser true o false.

* **`disableSubmitBtn`**: Desactiva el o los botones tipo "submit" presentes en el formulario de ser verdadero.  
De tipo booleano, solo puede ser true o false.

* **`successfulResponse`**: Define la respuesta esperada de las solicitudes para la validación mediante URL.  
Sin tipo definido, puede ser cadena, booleano o número.

* **`skipAJAXVal`**: En caso de ser verdadero, se desactiva la validación mediante URL establecida en cualquiera de los campos. Útil en caso de estar realizando pruebas en `localhost` o servidor de prueba.  
De tipo booleano, solo puede ser true o false.

* **`pseudoHolderColor`**: Define el color utilizado para simular el texto que "placeholder" debería mostrar.  
De tipo cadena, puede ser una cadena que valide como color en CSS; '#123', '#2348c2', 'rgb(150,34,55)'.

* **`defaultTextColor`**: Define el color utilizado para mostrar el texto que el usuario esté introduciendo y revertir el efecto que el simulador de "placeholder" realiza.  
De tipo cadena, puede ser una cadena que valide como color en CSS; '#123', '#2348c2', 'rgb(150,34,55)'.