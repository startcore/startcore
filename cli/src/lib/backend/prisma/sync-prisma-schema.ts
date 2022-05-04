import {writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {execCustom} from '../../utils'
import {initPrismaSchema} from './prisma-file'

const getModel = (modelName: string, fields: string): string =>
  `
model ${modelName} {
  ${fields}
}
`

const getField = (field: any) => {
  const name = field.name
  const type = `${field.type}${field.modifiers.isArray ? '[]' : ''}${field.modifiers.isOptional ? '?' : ''}`
  let attributes = ''
  for (const key in field.attributes) {
    if(field.attributes[key] === '') {
      attributes += `${key} `
    } else {
      attributes += `${key}(${field.attributes[key].value}) `
    }
  }

  return `${name} ${type} ${attributes}`
}

export const syncPrismaSchema = async (cwdProject: string, models: any): Promise<void> => {
  let schema = initPrismaSchema
  for (const model of models) {
    schema += getModel(model.modelName, model.fields.map((element:any) => getField(element)).join('\n  '))
  }

  writeFileSync(join(cwdProject, 'backend/prisma/schema.prisma'), schema, 'utf8')
  await execCustom(join(cwdProject, 'backend'), 'yarn prisma generate')
}
