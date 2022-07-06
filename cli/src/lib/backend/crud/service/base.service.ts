import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addServiceBase = (cwdProject: string, modelName: string): void => {
  const modulePath = join(cwdProject, `base.${modelName.toLowerCase()}.service.ts`)
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)
  const imports = [
    {items: ['Injectable'], from: '@nestjs/common'},
    {items: ['Prisma', `${modelName}`], from: '@prisma/client'},
    {items: ['PrismaService'], from: 'src/prisma.service'},
    {items: [`Create${modelName}Dto`], from: `./dto/base.create-${modelName.toLowerCase()}.dto`},
    {items: [`Update${modelName}Dto`], from: `./dto/base.update-${modelName.toLowerCase()}.dto`},
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
      services.map((service: { name: string; class: string }) => factory.createParameterDeclaration(
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
      )),
      factory.createBlock(
        [],
        false,
      ),
    )
  const createServiceMethod = ({
    name,
    parameters,
    returnType,
    block,
    isAsync,
  }: {
    name: string,
    parameters: ts.ParameterDeclaration[],
    returnType: ts.TypeReferenceNode,
    block:ts.Block,
    isAsync?: boolean,
  }) =>
    factory.createMethodDeclaration(
      undefined,
      isAsync ? [factory.createModifier(ts.SyntaxKind.AsyncKeyword)] : undefined,
      undefined,
      factory.createIdentifier(name),
      undefined,
      undefined,
      parameters,
      returnType,
      block,
    )

  const controller = factory.createClassDeclaration(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [factory.createDecorator(factory.createCallExpression(
      factory.createIdentifier('Injectable'),
    ))],
    [factory.createModifier(ts.SyntaxKind.ExportKeyword), factory.createModifier(ts.SyntaxKind.AbstractKeyword)],
    factory.createIdentifier(`Base${modelName}Service`),
    undefined,
    undefined,
    [
      createConstructorWithServices([{name: 'prismaBase', class: 'PrismaService'}]),
      createServiceMethod({
        name: 'create',
        parameters: [factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(`create${modelName}Dto`),
          undefined,
          factory.createTypeReferenceNode(
            factory.createQualifiedName(
              factory.createIdentifier('Prisma'),
              factory.createIdentifier(`${modelName}CreateInput`),
            ),
          ),
        )],
        returnType: factory.createTypeReferenceNode(
          factory.createIdentifier('Promise'),
          [factory.createTypeReferenceNode(
            factory.createIdentifier(modelName),
          )],
        ),
        block: factory.createBlock(
          [factory.createReturnStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createThis(),
                  factory.createIdentifier('prismaBase'),
                ),
                factory.createIdentifier(modelName.toLowerCase()),
              ),
              factory.createIdentifier('create'),
            ),
            undefined,
            [factory.createObjectLiteralExpression(
              [factory.createPropertyAssignment(
                factory.createIdentifier('data'),
                factory.createIdentifier(`create${modelName}Dto`),
              )],
              true,
            )],
          ))],
          true,
        ),
      }),
      createServiceMethod({
        name: 'findAll',
        isAsync: true,
        parameters: [factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('params'),
          undefined,
          factory.createTypeLiteralNode([
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('skip'),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ),
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('take'),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ),
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('sortField'),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ),
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('sortOrder'),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ),
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('filter'),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            ),
          ]),
        )],
        returnType: factory.createTypeReferenceNode(
          factory.createIdentifier('Promise'),
          [factory.createTypeLiteralNode([
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('total'),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            ),
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('data'),
              undefined,
              factory.createArrayTypeNode(factory.createTypeReferenceNode(
                factory.createIdentifier(modelName),
              )),
            ),
          ])],
        ),
        block: factory.createBlock(
          [
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [factory.createVariableDeclaration(
                  factory.createObjectBindingPattern([
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('skip'),
                    ),
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('take'),
                    ),
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('sortField'),
                    ),
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('sortOrder'),
                    ),
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('filter'),
                    ),
                  ]),
                  undefined,
                  undefined,
                  factory.createIdentifier('params'),
                )],
                ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags,
              ),
            ),
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [factory.createVariableDeclaration(
                  factory.createArrayBindingPattern([
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('total'),
                    ),
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('data'),
                    ),
                  ]),
                  undefined,
                  undefined,
                  factory.createAwaitExpression(factory.createCallExpression(
                    factory.createPropertyAccessExpression(
                      factory.createPropertyAccessExpression(
                        factory.createThis(),
                        factory.createIdentifier('prismaBase'),
                      ),
                      factory.createIdentifier('$transaction'),
                    ),
                    undefined,
                    [factory.createArrayLiteralExpression(
                      [
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createPropertyAccessExpression(
                              factory.createPropertyAccessExpression(
                                factory.createThis(),
                                factory.createIdentifier('prismaBase'),
                              ),
                              factory.createIdentifier(modelName.toLowerCase()),
                            ),
                            factory.createIdentifier('count'),
                          ),
                          undefined,
                          [factory.createObjectLiteralExpression(
                            [factory.createPropertyAssignment(
                              factory.createIdentifier('where'),
                              factory.createIdentifier('filter'),
                            )],
                            true,
                          )],
                        ),
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createPropertyAccessExpression(
                              factory.createPropertyAccessExpression(
                                factory.createThis(),
                                factory.createIdentifier('prismaBase'),
                              ),
                              factory.createIdentifier(modelName.toLowerCase()),
                            ),
                            factory.createIdentifier('findMany'),
                          ),
                          undefined,
                          [factory.createObjectLiteralExpression(
                            [
                              factory.createShorthandPropertyAssignment(
                                factory.createIdentifier('skip'),
                              ),
                              factory.createShorthandPropertyAssignment(
                                factory.createIdentifier('take'),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('orderBy'),
                                factory.createConditionalExpression(
                                  factory.createIdentifier('sortField'),
                                  factory.createToken(ts.SyntaxKind.QuestionToken),
                                  factory.createObjectLiteralExpression(
                                    [factory.createPropertyAssignment(
                                      factory.createComputedPropertyName(factory.createIdentifier('sortField')),
                                      factory.createCallExpression(
                                        factory.createPropertyAccessExpression(
                                          factory.createIdentifier('sortOrder'),
                                          factory.createIdentifier('toLowerCase'),
                                        ),
                                        undefined,
                                        [],
                                      ),
                                    )],
                                    false,
                                  ),
                                  factory.createToken(ts.SyntaxKind.ColonToken),
                                  factory.createIdentifier('undefined'),
                                ),
                              ),
                              factory.createPropertyAssignment(
                                factory.createIdentifier('where'),
                                factory.createIdentifier('filter'),
                              ),
                            ],
                            true,
                          )],
                        ),
                      ],
                      true,
                    )],
                  )),
                )],
                ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags,
              ),
            ),
            factory.createReturnStatement(factory.createObjectLiteralExpression(
              [
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier('total'),
                ),
                factory.createShorthandPropertyAssignment(
                  factory.createIdentifier('data'),
                ),
              ],
              true,
            )),
          ],
          true,
        ),
      }),
      createServiceMethod({
        name: 'findOne',
        parameters: [factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier(`${modelName.toLowerCase()}WhereUniqueInput`),
          undefined,
          factory.createTypeReferenceNode(
            factory.createQualifiedName(
              factory.createIdentifier('Prisma'),
              factory.createIdentifier(`${modelName}WhereUniqueInput`),
            ),
          ),
        )],
        returnType: factory.createTypeReferenceNode(
          factory.createIdentifier('Promise'),
          [factory.createUnionTypeNode([
            factory.createTypeReferenceNode(
              factory.createIdentifier(modelName),
            ),
            factory.createLiteralTypeNode(factory.createNull()),
          ])],
        ),
        block: factory.createBlock(
          [factory.createReturnStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createThis(),
                  factory.createIdentifier('prismaBase'),
                ),
                factory.createIdentifier(modelName.toLowerCase()),
              ),
              factory.createIdentifier('findUnique'),
            ),
            undefined,
            [factory.createObjectLiteralExpression(
              [factory.createPropertyAssignment(
                factory.createIdentifier('where'),
                factory.createIdentifier(`${modelName.toLowerCase()}WhereUniqueInput`),
              )],
              true,
            )],
          ))],
          true,
        ),
      }),
      createServiceMethod({
        name: 'update',
        parameters: [factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('params'),
          undefined,
          factory.createTypeLiteralNode([
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('where'),
              undefined,
              factory.createTypeReferenceNode(
                factory.createQualifiedName(
                  factory.createIdentifier('Prisma'),
                  factory.createIdentifier(`${modelName}WhereUniqueInput`),
                ),
              ),
            ),
            factory.createPropertySignature(
              undefined,
              factory.createIdentifier('data'),
              undefined,
              factory.createTypeReferenceNode(
                factory.createQualifiedName(
                  factory.createIdentifier('Prisma'),
                  factory.createIdentifier(`${modelName}UpdateInput`),
                ),
              ),
            ),
          ]),
        )],
        returnType: factory.createTypeReferenceNode(
          factory.createIdentifier('Promise'),
          [factory.createTypeReferenceNode(
            factory.createIdentifier(modelName),
          )],
        ),
        block: factory.createBlock(
          [
            factory.createVariableStatement(
              undefined,
              factory.createVariableDeclarationList(
                [factory.createVariableDeclaration(
                  factory.createObjectBindingPattern([
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('where'),
                    ),
                    factory.createBindingElement(
                      undefined,
                      undefined,
                      factory.createIdentifier('data'),
                    ),
                  ]),
                  undefined,
                  undefined,
                  factory.createIdentifier('params'),
                )],
                ts.NodeFlags.Const,
              ),
            ),
            factory.createReturnStatement(factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createPropertyAccessExpression(
                    factory.createThis(),
                    factory.createIdentifier('prismaBase'),
                  ),
                  factory.createIdentifier(modelName.toLowerCase()),
                ),
                factory.createIdentifier('update'),
              ),
              undefined,
              [factory.createObjectLiteralExpression(
                [
                  factory.createShorthandPropertyAssignment(
                    factory.createIdentifier('data'),
                  ),
                  factory.createShorthandPropertyAssignment(
                    factory.createIdentifier('where'),
                  ),
                ],
                true,
              )],
            )),
          ],
          true,
        ),
      }),
      createServiceMethod({
        name: 'delete',
        parameters: [factory.createParameterDeclaration(
          undefined,
          undefined,
          undefined,
          factory.createIdentifier('where'),
          undefined,
          factory.createTypeReferenceNode(
            factory.createQualifiedName(
              factory.createIdentifier('Prisma'),
              factory.createIdentifier(`${modelName}WhereUniqueInput`),
            ),
          ),
        )],
        returnType: factory.createTypeReferenceNode(
          factory.createIdentifier('Promise'),
          [factory.createTypeReferenceNode(
            factory.createIdentifier(modelName),
          )],
        ),
        block: factory.createBlock(
          [factory.createReturnStatement(factory.createCallExpression(
            factory.createPropertyAccessExpression(
              factory.createPropertyAccessExpression(
                factory.createPropertyAccessExpression(
                  factory.createThis(),
                  factory.createIdentifier('prismaBase'),
                ),
                factory.createIdentifier(modelName.toLowerCase()),
              ),
              factory.createIdentifier('delete'),
            ),
            undefined,
            [factory.createObjectLiteralExpression(
              [factory.createShorthandPropertyAssignment(
                factory.createIdentifier('where'),
              )],
              true,
            )],
          ))],
          true,
        ),
      }),
    ],
  )
  sourceFile.addStatements(
    [printNode(controller)],
  )
  project.save()
}
