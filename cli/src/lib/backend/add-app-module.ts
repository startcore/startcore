import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addAppModule = (cwdProject: string, settigns: any): void => {
  const modulePath = join(cwdProject, 'backend/src/app.module.ts')

  writeFileSync(modulePath, '', 'utf8')
  const project = new Project()
  const factory = ts.factory

  const sourceFile = project.addSourceFileAtPath(
    modulePath,
  )

  const imports = [
    {items: ['Module'], from: '@nestjs/common'},
    {items: ['AppController'], from: './app.controller'},
    {items: ['AppService'], from: './app.service'},
    ...settigns.models.map((model: any) => ({
      items: [`${model.modelName}Module`],
      from: `./${model.modelName.toLowerCase()}/${model.modelName.toLowerCase()}.module`,
    })),
  ]

  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const appModule = factory.createClassDeclaration(
    [
      factory.createDecorator(
        factory.createCallExpression(
          factory.createIdentifier('Module'),
          undefined,
          [
            factory.createObjectLiteralExpression(
              [
                factory.createPropertyAssignment(
                  factory.createIdentifier('imports'),
                  factory.createArrayLiteralExpression(
                    [
                      ...settigns.models.map((model: any) => factory.createIdentifier(`${model.modelName}Module`)),
                    ],
                    false,
                  ),
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('controllers'),
                  factory.createArrayLiteralExpression(
                    [factory.createIdentifier('AppController')],
                    false,
                  ),
                ),
                factory.createPropertyAssignment(
                  factory.createIdentifier('providers'),
                  factory.createArrayLiteralExpression(
                    [factory.createIdentifier('AppService')],
                    false,
                  ),
                ),
              ],
              true,
            ),
          ],
        ),
      ),
    ],
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier('AppModule'),
    undefined,
    undefined,
    [],
  )

  sourceFile.addStatements([printNode(appModule)])
  project.save()
}
