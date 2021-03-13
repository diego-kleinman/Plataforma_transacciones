# Evaluación Ripio FullStack

Este proyecto es una evaluación técnica realizada para la empresa Ripio. Consta de una base de datos, una apiREST y un cliente web que consume la api.

## Instructivo de instalación y recursos necesarios
You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

This web site is using `markedjs/marked`.

## Funcionalidades

### Usuario:
* Registro / Login
* Añadir cuenta (de una cierta moneda)
* Transferencias a otras cuentas (propias o de otro usuario)
* Visualizar cuentas con sus saldos
* Visualizar movimientos por cuenta

### Admin:
* Creación de monedas

## Base de datos

### Elección :

Para este proyecto use MySQL, entre los motivos que me llevaron a utilizar esta base están:

* Experiencia previa con la misma
* Free , open source
* Muy bien documentada y con un amplio uso
* Fácil manejo de concurrencia

Por lo que pude averiguar postgreSQL sería una mejor opción a la larga por la facilidad con la que escala, pero implicaba una mayor dificultad de instalación, configuración y uso en general dado que nunca la he manejado.

En cuanto a bases de datos no relacionales estuve bastante tentado a utilizar mongoDB pero al no haberla utilizado antes me decanté por mySQL y el formato de columnas estructurado.

### Diagrama :

![This is a alt text.](/image/sample.png "This is a sample image.")

### Concurrencia :
Para el manejo de la concurrencia en la base de datos utilicé las transacciónes que provee MySQL que aseguran la atomicidad de un proceso sobre la db con rollbacks en caso de que ocurra algún problema en el proceso y commits si todo sale bien. 

Las operaciones concurrentes en el proyecto son:

* Transferencias -> Implican por un lado restar balance, por otro acreditar y por otro generar el historial de transacciones

* Adición de monedas -> Implican adherir la moneda nueva a la tabla monedas y posteriormente generar todas las conversiónes desde y hacia la moneda con las otras monedas que ya estén presentes en el sistema

## Lógica de negocios

El sistema se basa en una interfaz web para el front, una apiREST y una base de datos.

A través de inputs en la interfaz se obtienen datos, estos datos se envían a un validator que los valida, cuando los datos son correctamente validados se envían peticiónes (post o get) a la apiREST, esta las maneja conectandose con la base de datos y obteniendo los datos necesarios, luego los envía como respuesta de la petición. Estos datos se obtienen nuevamente en la interfaz y se muestran al usuario o admin.

En resumen: Interfaz -> Validator -> apiREST -> base de datos -> apiREST -> Interfaz

## Testing

## Mejoras
* Encriptación de datos
* Parte visual más atractiva (frontend)
