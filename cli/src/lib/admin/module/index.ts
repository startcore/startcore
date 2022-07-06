import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs'
import {config} from '../../utils'

export const addModule = (
  cwdProject: string,
  model: config['models'][number],
): void => {
  const moduleFolder = join(
    cwdProject,
    `admin/src/${model.name.toLowerCase()}`,
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
      items: [
        'Create',
        'Datagrid',
        'Edit',
        'List',
        'SimpleForm',
        'TextField',
        'TextInput',
      ],
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

  const list = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(`${model.name}List`),
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
                    Object.values(model.fields).map(field =>
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

  const create = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(`${model.name}Create`),
          undefined,
          undefined,
          factory.createArrowFunction(
            undefined,
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier('props'),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
              ),
            ],
            undefined,
            factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            factory.createParenthesizedExpression(
              factory.createJsxElement(
                factory.createJsxOpeningElement(
                  factory.createIdentifier('Create'),
                  undefined,
                  factory.createJsxAttributes([
                    factory.createJsxSpreadAttribute(
                      factory.createIdentifier('props'),
                    ),
                  ]),
                ),
                [
                  factory.createJsxElement(
                    factory.createJsxOpeningElement(
                      factory.createIdentifier('SimpleForm'),
                      undefined,
                      factory.createJsxAttributes([]),
                    ),
                    Object.values(model.fields)
                    .filter(field => field.isCreate)
                    .map(field =>
                      factory.createJsxSelfClosingElement(
                        factory.createIdentifier('TextInput'),
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
                      factory.createIdentifier('SimpleForm'),
                    ),
                  ),
                ],
                factory.createJsxClosingElement(
                  factory.createIdentifier('Create'),
                ),
              ),
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )

  const edit = factory.createVariableStatement(
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier(`${model.name}Edit`),
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
                  factory.createIdentifier('Edit'),
                  undefined,
                  factory.createJsxAttributes([]),
                ),
                [
                  factory.createJsxElement(
                    factory.createJsxOpeningElement(
                      factory.createIdentifier('SimpleForm'),
                      undefined,
                      factory.createJsxAttributes([]),
                    ),
                    Object.values(model.fields)
                    .filter(field => field.isUpdate)
                    .map(field =>
                      factory.createJsxSelfClosingElement(
                        factory.createIdentifier('TextInput'),
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
                      factory.createIdentifier('SimpleForm'),
                    ),
                  ),
                ],
                factory.createJsxClosingElement(
                  factory.createIdentifier('Edit'),
                ),
              ),
            ),
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )

  sourceFile.addStatements([
    printNode(list),
    Object.values(model.fields).some(field => field.isUpdate) ?
      printNode(edit) :
      '',
    Object.values(model.fields).some(field => field.isCreate) ?
      printNode(create) :
      '',
  ])
  project.save()
}
