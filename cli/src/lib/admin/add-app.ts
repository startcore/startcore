/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'
import {config} from '../utils'

export const addApp = (cwdProject: string, models: config['models']): void => {
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
    ...Object.values(models).map(model => ({
      items: [
        `${model.name}List`,
        Object.values(model.fields).some(field => field.isUpdate) ?
          `${model.name}Edit` :
          '',
        Object.values(model.fields).some(field => field.isCreate) ?
          `${model.name}Create` :
          '',
      ],
      from: `./${model.name.toLowerCase()}`,
    })),
  ]
  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items.filter(item => item !== ''),
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

                Object.values(models).map(model =>
                  factory.createJsxSelfClosingElement(
                    factory.createIdentifier('Resource'),
                    undefined,
                    factory.createJsxAttributes(
                      // @ts-ignore
                      [
                        factory.createJsxAttribute(
                          factory.createIdentifier('name'),
                          factory.createStringLiteral(model.name.toLowerCase()),
                        ),
                        factory.createJsxAttribute(
                          factory.createIdentifier('list'),
                          factory.createJsxExpression(
                            undefined,
                            factory.createIdentifier(`${model.name}List`),
                          ),
                        ),
                        Object.values(model.fields).some(
                          field => field.isUpdate,
                        ) ?
                          factory.createJsxAttribute(
                            factory.createIdentifier('edit'),
                            factory.createJsxExpression(
                              undefined,
                              factory.createIdentifier(`${model.name}Edit`),
                            ),
                          ) :
                          null,
                        Object.values(model.fields).some(
                          field => field.isCreate,
                        ) ?
                          factory.createJsxAttribute(
                            factory.createIdentifier('create'),
                            factory.createJsxExpression(
                              undefined,
                              factory.createIdentifier(`${model.name}Create`),
                            ),
                          ) :
                          null,
                      ].filter(item => item !== null),
                    ),
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
