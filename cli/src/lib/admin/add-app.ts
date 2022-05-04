import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addApp = (cwdProject: string, models: any[]): void => {
  const modulePath = join(cwdProject, 'admin/src/App.tsx')
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory

  const sourceFile = project.addSourceFileAtPath(modulePath)

  const imports = [
    {
      items: ['Admin', 'Resource'],
      from: 'react-admin',
    },
    {
      items: ['dataProvider'],
      from: './dataProvider',
    },
    ...models.map(model => ({
      items: [`${model.modelName}List`],
      from: `./${model.modelName.toLowerCase()}`,
    })),
  ]
  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const app = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('App'),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(
              factory.createJsxElement(
                factory.createJsxOpeningElement(
                  factory.createIdentifier('Admin'),
                  undefined,
                  factory.createJsxAttributes([
                    factory.createJsxAttribute(
                      factory.createIdentifier('dataProvider'),
                      factory.createJsxExpression(
                        undefined,
                        factory.createIdentifier('dataProvider'),
                      ),
                    ),
                  ]),
                ),

                models.map(model =>
                  factory.createJsxSelfClosingElement(
                    factory.createIdentifier('Resource'),
                    undefined,
                    factory.createJsxAttributes([
                      factory.createJsxAttribute(
                        factory.createIdentifier('name'),
                        factory.createStringLiteral(
                          model.modelName.toLowerCase(),
                        ),
                      ),
                      factory.createJsxAttribute(
                        factory.createIdentifier('list'),
                        factory.createJsxExpression(
                          undefined,
                          factory.createIdentifier(
                            `${model.modelName}List`,
                          ),
                        ),
                      ),
                    ]),
                  ),
                ),
                factory.createJsxClosingElement(
                  factory.createIdentifier('Admin'),
                ),
              ),
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )

  const exportApp = factory.createExportAssignment(
    undefined,
    undefined,
    undefined,
    factory.createIdentifier('App'),
  )

  sourceFile.addStatements([printNode(app), printNode(exportApp)])
  project.save()
}
