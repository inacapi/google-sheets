# google-sheets
Aplicación para obtener las notas de un semestre específico y subirlas a google
sheets.

## Google cloud
Para usar la aplicación debemos tener un proyecto en google cloud que tenga la
api de google sheets activa. Debemos generar una cuenta de servicio y generar
las credenciales para usarla. Tenemos que guardar el archivo de credenciales con
como `credentials.json`, y lo dejamos en la raíz del proyecto. El video siguiente
muestra cómo hacerlo:
[Demo]()

## Plantilla para las notas
Las notas deben subirse a una hoja de cálculo. Recomiendo usar [esta](https://docs.google.com/spreadsheets/d/1d-Msd7tkd-620jALFpxMG8eG5GTKe-sj1XTuVdxJTRE/edit?usp=sharing)
porque el código tiene por defecto las celdas asignadas en base a esa plantilla.
Pueden hacer una copia y modificarla a gusto. Ciertas celdas traen alertas para no
editarlas, son celdas que contienen funciones, solo se activan cuando están
los demás datos necesarios. Es importante que la hoja la compartamos con
la cuenta de servicio que creamos antes, podemos usar el correo que trae,
sino lo hacemos el programa no va a funcionar porque la cuenta no tiene
acceso a la hoja de cálculo. Tenemos que darle el permiso de editor.

La plantilla de notas se ve así:
![Screenshot_20230105_212231](https://user-images.githubusercontent.com/22999877/210904849-bb9bbb58-7ab2-4f7b-a952-ba56991140eb.jpeg)

## Variables de entorno
Por último debemos reemplazar las variables de entorno necesarias.
| KEY | DESCRIPTION |
| --- | --- |
| USERNAME | Nombre de usuario de inacap (tiene que ser el correo) |
| PASSWORD | Contraseña de inacap |
| PERIODO | El id del periodo |
| MATRICULA | El id de nuestra matrícula |
| SECCIONES | Los de id de nuestras secciones para ese periodo |
| SHEET_NAME | El nombre de la hoja en que subir los datos |
| SHEET_ID | El id de la hoja de cálculo |
| RANGES | Los rangos donde subir los datos en la hoja |

- PERIODO, MATRICULA y SECCIONES las podemos obtener a través de las herramientas
de desarrollador viendo las peticiones que se envían a la api de inacap al pulsar
cada asignatura en el tablero académico.
- RANGES no hace cambiarlo si no cambiamos el orden de las tablas en la plantilla.
