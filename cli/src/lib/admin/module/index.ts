import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs'

export const addModule = (cwdProject: string, model: any): void => {
  const moduleFolder = join(
    cwdProject,
    `admin/src/${model.modelName.toLowerCase()}`,
  )
  if (existsSync(moduleFolder)) {
    rmSync(moduleFolder, {recursive: true, force: true})
  }

  mkdirSync(moduleFolder)
  writeFileSync(join(moduleFolder, 'index.tsx'), '', 'utf8')

  const project = new Project()
  const factory = ts.factory

  const sourceFile = project.addSourceFileAtPath(
    join(moduleFolder, 'index.tsx'),
  )

  const imports = [
    {
      items: ['Datagrid', 'List', 'TextField'],
      from: 'react-admin',
    },
  ]
  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const app = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(`${model.modelName}List`),
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
                  factory.createIdentifier('List'),
                  undefined,
                  factory.createJsxAttributes([]),
                ),
                [
                  factory.createJsxElement(
                    factory.createJsxOpeningElement(
                      factory.createIdentifier('Datagrid'),
                      undefined,
                      factory.createJsxAttributes([
                        factory.createJsxAttribute(
                          factory.createIdentifier('rowClick'),
                          factory.createStringLiteral('edit'),
                        ),
                      ]),
                    ),
                    model.fields.map((field: any) =>
                      factory.createJsxSelfClosingElement(
                        factory.createIdentifier('TextField'),
                        undefined,
                        factory.createJsxAttributes([
                          factory.createJsxAttribute(
                            factory.createIdentifier('source'),
                            factory.createStringLiteral(field.name),
                          ),
                        ]),
                      ),
                    ),
                    factory.createJsxClosingElement(
                      factory.createIdentifier('Datagrid'),
                    ),
                  ),
                ],
                factory.createJsxClosingElement(
                  factory.createIdentifier('List'),
                ),
              ),
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )

  sourceFile.addStatements([printNode(app)])
  project.save()
}
