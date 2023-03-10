import { obtener_token, seccion, subir_datos } from './utils.js'
import fs from 'fs'

const main = async () => {
    const env = ['USERNAME', 'PASSWORD', 'PERIODO', 'MATRICULA', 'SECCIONES', 'SHEET_NAME', 'SHEET_ID', 'RANGES', 'INTERVAL']
    for (const variable of env) {
        if (!process.env[variable]) {
            console.log(`Falta la variable de entorno ${variable}`)
            return
        }
    }

    if (!fs.existsSync('credentials.json')) {
        console.log('No se encontrĂ³ el archivo credentials.json')
        return
    }

    const token = await obtener_token(process.env.USERNAME, process.env.PASSWORD)
    if (token.error) {
        console.log(token.error)
        return
    }

    let datos = []
    process.env.SECCIONES.split(',').forEach((id_seccion) => {
        console.log(`Obteniendo datos de ${process.env.PERIODO}:${id_seccion}:${process.env.MATRICULA}...`)
        datos.push(seccion(token['token'], process.env.MATRICULA, id_seccion, process.env.PERIODO))
    })

    datos = await Promise.all(datos)
    console.log('Subiendo datos a Google Sheets...')
    subir_datos(datos)

    const interval = parseFloat(process.env.INTERVAL) || 30
    console.log(`Esperando ${interval} minutos...`)
    setTimeout(main, 1000 * 60 * interval)
}

main()