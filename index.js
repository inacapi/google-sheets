import { obtener_token, seccion, subir_datos } from './utils.js'
import fs from 'fs'

const main = async () => {
    const env = ['USERNAME', 'PASSWORD', 'PERIODO', 'MATRICULA', 'SECCIONES', 'SHEET_NAME', 'SHEET_ID', 'RANGES']
    for (const variable of env) {
        if (!process.env[variable]) {
            console.log(`Falta la variable de entorno ${variable}`)
            return
        }
    }

    if (!fs.existsSync('credentials.json')) {
        console.log('No se encontró el archivo credentials.json')
        return
    }

    const token = await obtener_token(process.env.USERNAME, process.env.PASSWORD)
    if (token.error) {
        console.log(token.error)
        return
    }

    let datos = []
    process.env.SECCIONES.split(',').forEach((id_seccion) => {
        datos.push(seccion(token['token'], process.env.MATRICULA, id_seccion, process.env.PERIODO))
    })

    datos = await Promise.all(datos)
    subir_datos(datos)
}

main()