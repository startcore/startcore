import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'
import {getTsType} from './utils'
import {config} from '../../../utils'

export const addCreateDto = (cwdProject: string, model: config['models'][string]): void => {
  const modulePath = join(
    cwdProject,
    `dto/base.create-${model.name.toLowerCase()}.dto.ts`,
  )
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)

  const dtoCreate = factory.createClassDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`Create${model.name}Dto`),
    undefined,
    undefined,
    Object.values(model.fields).filter(field => field.isCreate).map(field => factory.createPropertyDeclaration(
      undefined,
      undefined,
      factory.createIdentifier(field.name),
      // factory.createToken(ts.SyntaxKind.QuestionToken),
      undefined,
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

