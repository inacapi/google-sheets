import { fetch, CookieJar } from 'node-fetch-cookies'
import { parse } from 'node-html-parser'
import { google } from 'googleapis'

const adfs = 'https://adfs.inacap.cl/adfs/ls/?wtrealm=https://siga.inacap.cl/sts/&wa=wsignin1.0&wreply=https://siga.inacap.cl/sts/&wctx=https%3a%2f%2fadfs.inacap.cl%2fadfs%2fls%2f%3fwreply%3dhttps%3a%2f%2fwww.inacap.cl%2ftportalvp%2fintranet-alumno%26wtrealm%3dhttps%3a%2f%2fwww.inacap.cl%2f'
const sts = 'https://siga.inacap.cl/sts/'

export const obtener_token = async (nombre, contraseña) => {
    const cookieJar = new CookieJar()
    const respuesta = await fetch(cookieJar, adfs, {
        method: 'POST',
        body: new URLSearchParams({
            'UserName': nombre,
            'Password': contraseña,
            'AuthMethod': 'FormsAuthentication'
        })
    })

    const data = await respuesta.text()
    if (data && !data.includes('Working...')) {
        return { error: 'Usuario o contraseña incorrectos', token: '' }
    }

    const document = parse(data)
    const wresult = document.querySelector('input[name="wresult"]')
    if (!wresult) {
        return { error: 'No se pudo obtener el token', token: '' }
    }

    await fetch(cookieJar, sts, {
        method: 'POST',
        headers: { 'Referer': 'https://adfs.inacap.cl/' },
        body: new URLSearchParams({
            'wresult': wresult.getAttribute('value'),
            'wa': 'wsignin1.0',
            'wctx': 'https://adfs.inacap.cl/adfs/ls/?wreply=https://www.inacap.cl/tportalvp/intranet-alumno&amp;wtrealm=https://www.inacap.cl/'
        })
    })

    for (const cookie of cookieJar.cookiesAll()) {
        if (cookie.name === 'HTPSESIONIC') {
            return { error: '', token: cookie.value }
        }
    }

    return { error: 'No se pudo obtener el token', token: '' }
}

export const seccion = async (token, matricula, seccion, periodo) => {
    const url = 'https://siga.inacap.cl/Inacap.Siga.ResumenAcademico/api/seccion'
    const respuesta = await fetch(null, url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `HTPSESIONIC=${token}`
        },
        body: JSON.stringify({
            matrNcorr: matricula,
            seccCcod: seccion,
            periCcod: periodo,
            ssecNcorr: '0',
            carrCcod: '0',
        })
    })

    if (!respuesta.ok) {
        if (respuesta.status === 401) {
            return { error: 'El token venció', data: {}, status: 401 }
        }
        return { error: 'Error desconocido', data: {}, status: respuesta.status }
    }

    return { error: '', data: await respuesta.json() }
}

export const subir_datos = async (datos_secciones) => {
    const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        keyFile: 'credentials.json',
    })
    const client = await auth.getClient()
    const sheets = google.sheets({ version: 'v4', auth: client })
    const rangos = process.env.RANGES.split(',').map(r => r.split('-'))

    const datos = []
    for (const [i, seccion] of Object.entries(datos_secciones)) {
        const notas = { values: [], range: `${process.env.SHEET_NAME}!${rangos[i][1]}` }
        const metadatos = { values: [], range: `${process.env.SHEET_NAME}!${rangos[i][0]}`, majorDimension: 'COLUMNS' }

        if (seccion.error || seccion.data.notas.length === 0) continue

        for (const evaluacion of seccion.data.notas) {
            notas['values'].push([
                evaluacion['caliFevaluacion'], evaluacion['caliNponderacion'],
                parse_number(evaluacion['calaNnota']), parse_number(evaluacion['promedioCalificacion'])
            ])
            if (metadatos['values'].length !== 1) {
                metadatos['values'].push([
                    evaluacion['asigTdesc'], evaluacion['nombreProfesor'],
                    evaluacion['sitfCcod'], evaluacion['cargNasistencia'],
                    evaluacion['cargNnotaPresentacion'], evaluacion['cargNnotaFinal']
                ])
            }
        }

        datos.push(notas, metadatos)
    }

    sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: process.env.SHEET_ID,
        requestBody: { valueInputOption: 'USER_ENTERED', data: datos }
    })
}

const parse_number = (str) => {
    const number = parseFloat(str)
    return isNaN(number) ? '' : number * 10
}