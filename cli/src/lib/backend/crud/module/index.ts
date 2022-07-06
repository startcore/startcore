import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addModule = (cwdProject: string, modelName: string): void => {
  const modulePath = join(
    cwdProject,
    `${modelName.toLowerCase()}.module.ts`,
  )
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory

  const sourceFile = project.addSourceFileAtPath(modulePath)
  const imports = [
    {
      items: ['Module'],
      from: '@nestjs/common',
    },
    {
      items: ['PrismaService'],
      from: 'src/prisma.service',
    },
    {
      items: [`${modelName}Service`],
      from: `./${modelName.toLowerCase()}.service`,
    },
    {
      items: [`${modelName}Controller`],
      from: `./${modelName.toLowerCase()}.controller`,
    },
  ]
  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const createControllers = (names: string[]) => {
    const res = []
    for (const name of names) {
      res.push(factory.createIdentifier(name))
    }

    return factory.createPropertyAssignment(
      'controllers',
      factory.createArrayLiteralExpression(res, true),
    )
  }

  const createProviders = (names: string[]) => {
    const res = []
    for (const name of names) {
      res.push(factory.createIdentifier(name))
    }

    return factory.createPropertyAssignment(
      'providers',
      factory.createArrayLiteralExpression(res, true),
    )
  }

  const module = factory.createClassDeclaration(
    [
      factory.createDecorator(
        factory.createCallExpression(
          factory.createIdentifier('Module'),
          undefined,
          [
            factory.createObjectLiteralExpression(
              [
                createControllers([`${modelName}Controller`]),
                createProviders([`${modelName}Service`, 'PrismaService']),
              ],
              true,
            ),
          ],
        ),
      ),
    ],
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`${modelName}Module`),
    undefined,
    undefined,
    [],
  )
  sourceFile.addStatements([printNode(module)])
  project.save()
}
