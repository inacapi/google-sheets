import fs from 'fs'

const main = () => {
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

    const config = fs.readFileSync('config.json', 'utf-8')
    console.log(config)
}

const intervalo = 1000 * 2
setInterval(main, intervalo)