import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'
import {getTsType, modelType} from './utils'

export const addCreateDto = (cwdProject: string, model: modelType): void => {
  const modulePath = join(
    cwdProject,
    `backend/src/${model.modelName.toLowerCase()}/dto/create-${model.modelName.toLowerCase()}.dto.ts`,
  )
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)

  const dtoCreate = factory.createClassDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`Create${model.modelName}Dto`),
    undefined,
    undefined,
    model.fields.filter(field => field.isCreate).map(field => factory.createPropertyDeclaration(
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

