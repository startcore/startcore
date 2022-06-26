import {Command} from '@oclif/core'
import jsonfilesystem from './filesystem.json'
import * as fs from 'node:fs/promises'

const staticFile = (fs: any) => (req: any, res: any, next: any) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next()
  }

  try {
    if (!(req.url === '/' || fs.statSync(req.url))) {
      return next()
    }
  // eslint-disable-next-line unicorn/prefer-optional-catch-binding
  } catch (error) {
    return next()
  }

  let path = '/'
  path = req.url === '/' ? '/index.html' : req.url

  res.send(fs.readFileSync(path, 'utf8'))
}

export default class Ui extends Command {
  async run(): Promise<void> {
    const express = require('express')
    const app = express()
    const cors = require('cors')
    const bodyParser = require('body-parser')
    const {fs: memfs, vol} = require('memfs')

    vol.fromJSON(jsonfilesystem, '/')
    const port = 34_563

    app.use(cors())
    app.use(bodyParser.json())
    app.use(staticFile(memfs))
    app.get('/config', async (req: any, res: any) => {
      const config = await fs.readFile('startcore.config.json', 'utf8')
      res.send(config)
    })

    app.post('/config', async (req: any, res: any) => {
      await fs.writeFile(
        'startcore.config.json',
        JSON.stringify(req.body, null, 2),
      )
      res.send('ok')
    })

    app.listen(port, () => {
      console.log(`Front app listening http://localhost:${port}`)
    })
  }
}
