import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addController = (cwdProject: string, modelName: string): void => {
  const modulePath = join(
    cwdProject,
    `backend/src/${modelName.toLowerCase()}/${modelName.toLowerCase()}.controller.ts`,
  )
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)
  const serviceName = `${modelName.toLowerCase()}Service`
  const imports = [
    {
      items: [
        'Controller',
        'Get',
        'Post',
        'Body',
        'Patch',
        'Param',
        'Delete',
        'Query',
      ],
      from: '@nestjs/common',
    },
    {
      items: [`${modelName}Service`],
      from: `./${modelName.toLowerCase()}.service`,
    },
    {
      items: [`Create${modelName}Dto`],
      from: `./dto/create-${modelName.toLowerCase()}.dto`,
    },
    {
      items: [`Update${modelName}Dto`],
      from: `./dto/update-${modelName.toLowerCase()}.dto`,
    },
  ]
  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const createConstructorWithServices = (services: { name: string, class: string }[]) =>
    factory.createConstructorDeclaration(
      undefined,
      undefined,
      services.map((service: { name: string; class: string }) =>
        factory.createParameterDeclaration(
          undefined,
          [
            factory.createModifier(ts.SyntaxKind.PrivateKeyword),
            factory.createModifier(ts.SyntaxKind.ReadonlyKeyword),
          ],
          undefined,
          factory.createIdentifier(service.name),
          undefined,
          factory.createTypeReferenceNode(
            factory.createIdentifier(service.class),
          ),
        ),
      ),
      factory.createBlock([], false),
    )
  const createHandler = ({
    method,
    url,
    functionName,
    body,
    queries,
    params,
    block,
  }: {
    method: string,
    url?: string,
    functionName: string,
    body?: {
      name: string,
      class: string,
    },
    queries?: {
      name: string,
      type: ts.KeywordTypeSyntaxKind,
    }[],
    params?: {
      name: string,
      type: ts.KeywordTypeSyntaxKind,
    }[],
    block: ts.Block,
  }) =>
    factory.createMethodDeclaration(
      [
        factory.createDecorator(
          factory.createCallExpression(
            factory.createIdentifier(method),
            undefined,
            url ? [factory.createStringLiteral(url)] : [],
          ),
        ),
      ],
      undefined,
      undefined,
      factory.createIdentifier(functionName),
      undefined,
      undefined,
      [
        ...(body ?
          [
            factory.createParameterDeclaration(
              [
                factory.createDecorator(
                  factory.createCallExpression(
                    factory.createIdentifier('Body'),
                    undefined,
                    [],
                  ),
                ),
              ],
              undefined,
              undefined,
              factory.createIdentifier(body.name),
              undefined,
              factory.createTypeReferenceNode(
                factory.createIdentifier(body.class),
              ),
            ),
          ] :
          []),
        ...(Array.isArray(queries) ?
          queries.map(query =>
            factory.createParameterDeclaration(
              [
                factory.createDecorator(
                  factory.createCallExpression(
                    factory.createIdentifier('Query'),
                    undefined,
                    [factory.createStringLiteral(query.name)],
                  ),
                ),
              ],
              undefined,
              undefined,
              factory.createIdentifier(query.name),
              undefined,
              factory.createKeywordTypeNode(query.type),
            ),
          ) :
          []),
        ...(Array.isArray(params) ?
          params.map(param =>
            factory.createParameterDeclaration(
              [
                factory.createDecorator(
                  factory.createCallExpression(
                    factory.createIdentifier('Param'),
                    undefined,
                    [factory.createStringLiteral(param.name)],
                  ),
                ),
              ],
              undefined,
              undefined,
              factory.createIdentifier(param.name),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ),
          ) :
          []),
      ],
      undefined,
      block,
    )

  const controller = factory.createClassDeclaration(
    [
      factory.createDecorator(
        factory.createCallExpression(
          factory.createIdentifier('Controller'),
          undefined,
          [factory.createStringLiteral(modelName.toLowerCase())],
        ),
      ),
    ],
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`${modelName}Controller`),
    undefined,
    undefined,
    [
      createConstructorWithServices([
        {name: serviceName, class: `${modelName}Service`},
      ]),
      createHandler({
        method: 'Post',
        functionName: 'create',
        body: {name: `create${modelName}Dto`, class: `Create${modelName}Dto`},
        block: factory.createBlock(
          [
            factory.createReturnStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier(serviceName),
                  ),
                  factory.createIdentifier('create'),
                ),
                undefined,
                [factory.createIdentifier(`create${modelName}Dto`)],
              ),
            ),
          ],
          true,
        ),
      }),
      createHandler({
        method: 'Get',
        functionName: 'findAll',
        queries: [
          {name: 'skip', type: ts.SyntaxKind.NumberKeyword},
          {name: 'take', type: ts.SyntaxKind.NumberKeyword},
        ],
        block: factory.createBlock(
          [
            factory.createReturnStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier(serviceName),
                  ),
                  factory.createIdentifier('findAll'),
                ),
                undefined,
                [
                  factory.createObjectLiteralExpression(
                    [
                      factory.createShorthandPropertyAssignment(
                        factory.createIdentifier('skip'),
                      ),
                      factory.createShorthandPropertyAssignment(
                        factory.createIdentifier('take'),
                      ),
                    ],
                    true,
                  ),
                ],
              ),
            ),
          ],
          true,
        ),
      }),
      createHandler({
        method: 'Get',
        url: ':id',
        functionName: 'findOne',
        params: [{name: 'id', type: ts.SyntaxKind.StringKeyword}],
        block: factory.createBlock(
          [
            factory.createReturnStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier(serviceName),
                  ),
                  factory.createIdentifier('findOne'),
                ),
                undefined,
                [
                  factory.createObjectLiteralExpression(
                    [
                      factory.createShorthandPropertyAssignment(
                        factory.createIdentifier('id'),
                      ),
                    ],
                    false,
                  ),
                ],
              ),
            ),
          ],
          true,
        ),
      }),
      createHandler({
        method: 'Patch',
        url: ':id',
        functionName: 'update',
        params: [{name: 'id', type: ts.SyntaxKind.StringKeyword}],
        body: {name: `update${modelName}Dto`, class: `Update${modelName}Dto`},
        block: factory.createBlock(
          [
            factory.createReturnStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier(serviceName),
                  ),
                  factory.createIdentifier('update'),
                ),
                undefined,
                [
                  factory.createObjectLiteralExpression(
                    [
                      factory.createPropertyAssignment(
                        factory.createIdentifier('where'),
                        factory.createObjectLiteralExpression(
                          [
                            factory.createShorthandPropertyAssignment(
                              factory.createIdentifier('id'),
                            ),
                          ],
                          false,
                        ),
                      ),
                      factory.createPropertyAssignment(
                        factory.createIdentifier('data'),
                        factory.createIdentifier(`update${modelName}Dto`),
                      ),
                    ],
                    true,
                  ),
                ],
              ),
            ),
          ],
          true,
        ),
      }),
      createHandler({
        method: 'Delete',
        url: ':id',
        functionName: 'delete',
        params: [{name: 'id', type: ts.SyntaxKind.StringKeyword}],
        block: factory.createBlock(
          [
            factory.createReturnStatement(
              factory.createCallExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier(serviceName),
                  ),
                  factory.createIdentifier('delete'),
                ),
                undefined,
                [
                  factory.createObjectLiteralExpression(
                    [
                      factory.createShorthandPropertyAssignment(
                        factory.createIdentifier('id'),
                      ),
                    ],
                    false,
                  ),
                ],
              ),
            ),
          ],
          true,
        ),
      }),
    ],
  )
  sourceFile.addStatements([printNode(controller)])
  project.save()
}
