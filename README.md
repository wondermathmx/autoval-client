#AutoVal
Plugin jQuery que permite la validación automática de los campos de texto en un formulario.
Este plugin será utilizado conforme se va desarrollando en el sitio [WonderMath](http://wondermathmx.info/) y se hará disponible aquí en GitHub, permitiendo su modificación e implementación en otro sitio de tu interés.

## Uso básico
El plugin debe ser llamado mediante el contexto de un selector a un formulario.
Para utilizar las opciones predeterminadas, se debe ejecutar lo siguiente, teniendo un formulario con id "login":

```
$('#login').autoval();
```

En caso de que se requiera modificar alguna de las opciones predeterminadas, estas se deberán pasar como un argumento a la función `autoval()`, de la siguiente manera:

```
$('#login').autoval({
	// aquí van las opciones configuradas a tu gusto
});
```


##Configuraciones predefinidas
Las configuraciones predefinidas del plugin son las siguientes:
```
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
```


## Opciones predeterminadas
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