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
Finalmente solo queda modificar el archivo .env para incluir el resto de información,
USERNAME y PASSWORD son nuestros datos de inicio de sesión de inacap. Periodo,
matrícula y secciones son los id de esas cosas respectivamente, los podemos
obtener con las herramientas de desarrollador al ver cualquier clase en el tablero
académico. SHEET_NAME es el nombre de la hoja en particular del cuaderno de las
hojas de cálculo que creamos, es necesario crear una hoja por semestre. SHEET_ID
es el id de la hoja de cálculo, lo podemos copiar desde la url, y RANGES son los
rangos separados por comas y signos menos donde se van a subir los datos, si no se
cambia el orden de las tablas de la plantilla no hace falta cambiar esto.
