import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'
import {getTsType} from './utils'
import {config} from '../../../utils'

export const addUpdateDto = (cwdProject: string, model: config['models'][string]): void => {
  const modulePath = join(
    cwdProject,
    `dto/base.update-${model.name.toLowerCase()}.dto.ts`,
  )
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)

  const dtoCreate = factory.createClassDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`Update${model.name}Dto`),
    undefined,
    undefined,
    Object.values(model.fields).filter(field => field.isUpdate).map(field => factory.createPropertyDeclaration(
      undefined,
      undefined,
      factory.createIdentifier(field.name),
      factory.createToken(ts.SyntaxKind.QuestionToken),
      field.modifiers.isArray ? factory.createArrayTypeNode(getTsType(field.type)) : getTsType(field.type),
      // eslint-disable-next-line unicorn/no-useless-undefined
      undefined,
    )),
  )

  sourceFile.addStatements(
    [printNode(dtoCreate)],
  )
  project.save()
}

