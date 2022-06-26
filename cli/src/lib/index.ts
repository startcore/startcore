import * as fs from 'node:fs'
import {readFileSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {syncAdmin} from './admin'
import {addAppModule} from './backend/add-app-module'
import {addCrud} from './backend/crud'
import {syncPrismaSchema} from './backend/prisma'
import {config} from './utils'
export {createBackend} from './backend'
export {createAdmin} from './admin'
export {createFront} from './front'

const addSettingsFile = (path: string) => {
  writeFileSync(join(path, 'startcore.config.json'), JSON.stringify(config, null, 2), 'utf8')
}

export const initFolder = (name: string): string => {
  fs.mkdirSync(join(process.cwd(), name))
  addSettingsFile(join(process.cwd(), name))
  return join(process.cwd(), name)
}

export const sync = (): void => {
  const schema = readFileSync(
    join(process.cwd(), 'startcore.config.json'),
    'utf8',
  )
  const settings = JSON.parse(schema) as config
  syncPrismaSchema(process.cwd(), settings.models)
  for (const model of Object.values(settings.models)) {
    addCrud(process.cwd(), model)
  }

  addAppModule(process.cwd(), settings)
  syncAdmin(process.cwd(), settings)
}
