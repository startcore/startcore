const hddfs = require('fs')    // Hard drive

const pathFolder123 = '../front/build'

const readFolder = (pathFolder, addPath = './') => {
  let res = {}
  const files = hddfs.readdirSync(pathFolder, {withFileTypes: true})
  for (const file of files) {
    if (file.isDirectory()) {
      const resLocal = readFolder(pathFolder + '/' + file.name, addPath + file.name + '/')
      res = {
        ...res,
        ...resLocal,
      }
      continue
    }

    res[addPath + file.name] = hddfs.readFileSync(pathFolder + '/' + file.name, 'utf8')
  }

  return res
}

hddfs.writeFileSync('filesystem.json', JSON.stringify(readFolder(pathFolder123)))
