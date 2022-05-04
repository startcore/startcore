import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addService = (cwdProject: string, modelName: string): void => {
  const modulePath = join(cwdProject, `backend/src/${modelName.toLowerCase()}/${modelName.toLowerCase()}.service.ts`)
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)
  const imports = [
    {items: ['Injectable'], from: '@nestjs/common'},
    {items: ['Prisma', `${modelName}`], from: '@prisma/client'},
    {items: ['PrismaService'], from: 'src/prisma.service'},
    {items: [`Create${modelName}Dto`], from: `./dto/create-${modelName.toLowerCase()}.dto`},
    {items: [`Update${modelName}Dto`], from: `./dto/update-${modelName.toLowerCase()}.dto`},
  ]

  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const createConstructorWithServices = (services: any[]) =>
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
  }: {
    name: string,
    parameters: ts.ParameterDeclaration[],
    returnType: ts.TypeReferenceNode,
    block:ts.Block,
  }) =>
    factory.createMethodDeclaration(
      undefined,
      undefined,
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
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier(`${modelName}Service`),
    undefined,
    undefined,
    [
      createConstructorWithServices([{name: 'prisma', class: 'PrismaService'}]),
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
                  factory.createIdentifier('prisma'),
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
          ]),
        )],
        returnType: factory.createTypeReferenceNode(
          factory.createIdentifier('Promise'),
          [factory.createArrayTypeNode(factory.createTypeReferenceNode(
            factory.createIdentifier(modelName),
          ))],
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
                    factory.createIdentifier('prisma'),
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
                ],
                true,
              )],
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
                  factory.createIdentifier('prisma'),
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
                    factory.createIdentifier('prisma'),
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
                  factory.createIdentifier('prisma'),
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
