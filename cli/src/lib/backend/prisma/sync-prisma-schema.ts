import {writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {config, execCustom} from '../../utils'
import {initPrismaSchema} from './prisma-file'

const getModel = (modelName: string, fields: string): string =>
  `
model ${modelName} {
  ${fields}
}
`

const getField = (field: config['models'][string]['fields'][string]) => {
  const name = field.name
  const type = `${field.type}${field.modifiers.isArray ? '[]' : ''}${field.modifiers.isOptional ? '?' : ''}`
  let attributes = ''
  for (const key in field.attributes) {
    if (key in field.attributes) {
      if (key === '@id') {
        attributes += `${key} `
      }

      if (key === '@default') {
        attributes += `${key}(${field.attributes[key]?.value}) `
      }
    }
  }

  return `${name} ${type} ${attributes}`
}

export const syncPrismaSchema = async (cwdProject: string, models: config['models']): Promise<void> => {
  let schema = initPrismaSchema
  for (const model of Object.values(models)) {
    schema += getModel(model.name, Object.values(model.fields).map(element => getField(element)).join('\n  '))
  }

  writeFileSync(join(cwdProject, 'backend/prisma/schema.prisma'), schema, 'utf8')
  await execCustom(join(cwdProject, 'backend'), 'yarn prisma migrate dev')
}
