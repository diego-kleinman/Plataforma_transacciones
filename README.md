# Evaluación Ripio FullStack

Este proyecto es una evaluación técnica realizada para la empresa Ripio. Consta de una base de datos, una apiREST y un cliente web que consume la api.

## Instructivo de instalación y recursos necesarios

Para ejecutar el proyecto se necesita:

* MySQL -> [aqui](https://dev.mysql.com/downloads/mysql)
* NodeJS -> [aqui](https://nodejs.org/es/download/)
* En MySQL crear un usuario de nombre "Test" y password "password" con permisos DBA , usar puerto por defecto (3306) o de lo contrario en el archivo database.js dentro de la carpeta backend dentro de la función "connect" se pueden modificar el user, password y puerto a gusto
* Importar el Schema 'Ripio' a MySQL ('Ripio.sql')
* Posicionarse en la carpeta 'Proyecto' -> ejecutar `npm install` y posteriormente `npm start`

* Si se quiere además ejecutar los **test unitarios** se debe importar ('Ripio testing.sql'), posicionarse en la carpeta 'backend' y ejecutar `npm test`

### Credenciales de admin del sistema -> DNI : 11111111 ; PASSWORD : 123 (Se introducen en el login)

Tener en cuenta que estando en Mac la carpeta en donde se aloje el proyecto debe tener permisos de escritura y lectura habilitados para el usuario que se encuentre activo

## Funcionalidades

### Usuario:
* Registro / Login
* Añadir cuentas (Al no haber funcionalidad de depósitos al añadir una cuenta el usuario puede indicar un monto inicial)
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

![This is a alt text.](/Database.png "This is a database diagram image.")

### Concurrencia :
Para el manejo de la concurrencia en la base de datos utilicé las transacciónes que provee MySQL que aseguran la atomicidad de un proceso sobre la db con rollbacks en caso de que ocurra algún problema en el proceso y commits si todo sale bien. 

Las operaciones concurrentes en el proyecto son:

* Transferencias -> Implican por un lado restar balance, por otro acreditar y por otro generar el historial de transacciones

* Adición de monedas -> Implican adherir la moneda nueva a la tabla monedas y posteriormente generar todas las conversiónes desde y hacia la moneda con las otras monedas que ya estén presentes en el sistema

## Lógica de negocios

El sistema se basa en una interfaz web para el front(React), una apiREST (ExpressJS,NodeJS) y una base de datos(MySQL).

A través de inputs en la interfaz se obtienen datos, estos datos se envían a un validador, cuando los datos son correctamente validados se envían peticiónes (post o get) a la apiREST, esta las maneja conectandose con la base de datos y obteniendo los datos necesarios, luego los envía como respuesta de la petición. Estos datos se obtienen nuevamente en la interfaz y se muestran al usuario o admin.

En resumen: Interfaz -> Validador -> apiREST -> Base de datos -> apiREST -> Interfaz

## Testing

Se realizaron test unitarios para el backend utilizando Jest (login, register, accounts, transactions)

## Mejoras
* Encriptación de datos
* Parte visual más atractiva (frontend)
* Responsive design
* Más unit testing del back y testear el front
