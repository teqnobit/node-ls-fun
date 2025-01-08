const fs = require("node:fs/promises")
const path = require("node:path")

const directorio = process.argv[2] ?? '.'
// console.log(process.argv)

async function ls (directorio){
    let archivos
    try {
        archivos = await fs.readdir(directorio)
        // console.log(archivos)
    } catch {
        console.error(`No se pudo leer el directorio ${directorio}`)
        process.exit(1)
    }

    const promesasArchivos = archivos.map(async archivo => {
        const rutaArchivo = path.join(directorio, archivo)
        let stats

        try {
            stats = await fs.stat(rutaArchivo)
        } catch {
            console.error(`No se puede leer la ruta del archivo ${rutaArchivo}`)
            process.exit(1)
        }

        // es directorio?
        // tipo de archivo
        // tamaño del archivo
        // fecha de modificacion

        const isDirectory = stats.isDirectory()
        const isFile = isDirectory ? "d" : "f"
        const sizeFile = stats.size.toString()
        const fechaMod = stats.mtime.toLocaleString()

        return `${isFile} ${rutaArchivo.padEnd(20)} ${sizeFile.padStart(7)} ${fechaMod}`
    })

    const informacionArchivos = await Promise.all(promesasArchivos)

    informacionArchivos.forEach(archivo => console.log(archivo))
}

ls(directorio)


// let stats = fs.statSync("./package.json")
// console.log(
//     stats.isDirectory(),
//     stats.isFile(),
//     stats.size,
//     stats.atime
// )
