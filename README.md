# Descripcion

En este proyecto se creo el back/api/front para una mini plataforma similar a un banco.
Los usuarios pueden crear un usuario/loggearse, para posteriormente hacer transacciones entre "cuentas bancarias" en distintos tipos de monedas.
Desde el usuario admin se pueden añadir monedas al sistema.

## Instructivo de instalación y recursos necesarios

Para ejecutar el proyecto se necesita:

* MySQL -> [aqui](https://dev.mysql.com/downloads/mysql)
* NodeJS -> [aqui](https://nodejs.org/es/download/)
* En MySQL crear un usuario de nombre "Test" y password "password" con permisos DBA , usar puerto por defecto (3306) o de lo contrario en el archivo database.js dentro de la carpeta backend dentro de la función "connect" se pueden modificar el user, password y puerto a gusto
* Importar el Schema 'Ripio' a MySQL ('Ripio.sql')
* Posicionarse en la carpeta 'Proyecto' -> ejecutar `npm install` y posteriormente `npm start`

* Si se quiere además ejecutar los **test unitarios** se debe importar el Schema ('Ripio testing.sql'), posicionarse en la carpeta 'backend' y ejecutar `npm test`

### Credenciales de admin del sistema -> DNI : 11111111 ; PASSWORD : 123 (Se introducen en el login)

Tener en cuenta que estando en Mac la carpeta en donde se aloje el proyecto debe tener permisos de escritura y lectura habilitados para el usuario que se encuentre activo

## Funcionalidades

### Usuario:
* Registro / Login
* Añadir cuentas (Al no haber funcionalidad de depósitos al añadir una cuenta el usuario puede indicar un monto inicial)
* Transferencias a otras cuentas (propias o de otro usuario)
* Visualizar cuentas con sus saldos
* Visualizar movimientos por cuenta
* El sistema soporta conversión de monedas (si un usuario transfiere a una cuenta con una distinta moneda (ya sea suya o de otro usuario), la moneda se convierte automáticamente

### Admin:
* Creación de monedas (Con sus respectivas conversiones a las demás monedas ya existentes)

## Base de datos

### Elección :

Para este proyecto use MySQL, entre los motivos que me llevaron a utilizar esta base están:

* Experiencia previa con la misma
* Free , open source
* Muy bien documentada y con un amplio uso
* Fácil manejo de concurrencia

PostgreSQL sería una mejor opción a la larga por la facilidad con la que escala, pero implicaba una mayor dificultad de instalación, configuración y uso en general dado que nunca la he manejado.

En cuanto a bases de datos no relacionales pensé en utilizar mongoDB pero al no tener experiencia previa con la misma me decidí por MySQL y el formato de datos estructurado.

### Diagrama :

![This is a alt text.](/Database.png "This is a database diagram image.")

### Concurrencia :
Para el manejo de la concurrencia en la base de datos utilicé el sistema de transacciónes que provee MySQL, las mismas aseguran la atomicidad de un proceso sobre la db y permiten hacer rollbacks en caso de que ocurra algún problema en el proceso o commits si todo sale bien. 

Las operaciones concurrentes en el proyecto son:

* Transferencias -> Implican por un lado restar balance en la cuenta origen, por otro lado acreditar balance en la cuenta destino y por otro agregar la transacción al historial de transacciones.

* Adición de monedas -> Implican adherir la moneda nueva a la tabla maestra monedas y posteriormente generar todas las conversiónes desde y hacia la moneda con las otras monedas que ya estén presentes en el sistema para luego insertar esas conversiones en la tabla maestra conversiones.

## Lógica de negocios

El sistema se basa en una interfaz web para el front(React), una apiREST (ExpressJS,NodeJS) y una base de datos(MySQL).

A través de inputs en la interfaz se obtienen datos, estos datos se envían a un validador, cuando los datos son correctamente validados se envían peticiónes (post o get) a la apiREST, esta las maneja conectandose con la base de datos y obteniendo los datos necesarios, luego los envía como respuesta de la petición. Estos datos se obtienen nuevamente en la interfaz y se muestran al usuario.

En resumen: Interfaz -> Validador -> apiREST -> Base de datos -> apiREST -> Interfaz

## Testing

Se realizaron test unitarios para el backend utilizando Jest (login, register, accounts, transactions)

## Mejoras

### Frontend
* Parte visual más atractiva (frontend)
* Responsive design
* Testing

### Backend
* Encriptación de datos
* Aumentar testing
