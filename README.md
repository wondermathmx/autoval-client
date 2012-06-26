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
El programa permite la configuración de varios atributos