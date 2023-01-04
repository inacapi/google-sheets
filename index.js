import fs from 'fs'
import { obtener_token, seccion as obtener_datos_seccion } from './utils.js'

const main = async () => {
    if (!process.env.USERNAME) {
        console.log('Falta la variable de entorno USERNAME')
        return
    }

    if (!process.env.PASSWORD) {
        console.log('Falta la variable de entorno PASSWORD')
        return
    }

    if (!process.env.SHEET_ID) {
        console.log('Falta la variable de entorno SHEET_ID')
        return
    }

    if (!process.env.SEMESTER) {
        console.log('Falta la variable de entorno SEMESTER')
        return
    }

    const token = await obtener_token(process.env.USERNAME, process.env.PASSWORD)
    if (token.error) {
        console.log(token.error)
        return
    }

    const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))[process.env.SEMESTER]
    let datos_secciones = []

    for (let seccion of config['secciones']) {
        datos_secciones.push(obtener_datos_seccion(token['token'], config['matricula'], seccion, config['periodo']))
    }

    datos_secciones = await Promise.all(datos_secciones)

    subir_datos(datos_secciones)
}

main()