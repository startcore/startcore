/* eslint-disable unicorn/no-useless-undefined */
import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addService = (cwdProject: string, modelName: string): void => {
  const modulePath = join(cwdProject, `${modelName.toLowerCase()}.service.ts`)
  writeFileSync(modulePath, '', 'utf8')

  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(modulePath)
  const imports = [
    {items: ['Injectable'], from: '@nestjs/common'},
    {items: ['PrismaService'], from: 'src/prisma.service'},
    {items: [`Base${modelName}Service`], from: `src/baseModule/${modelName.toLowerCase()}/base.${modelName.toLowerCase()}.service`},
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
        [factory.createExpressionStatement(factory.createCallExpression(
          factory.createSuper(),
          undefined,
          services.map((service: { name: string; class: string }) =>
            factory.createIdentifier(service.name)),
        ))],
        true,
      ),
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
    [factory.createHeritageClause(
      ts.SyntaxKind.ExtendsKeyword,
      [factory.createExpressionWithTypeArguments(
        factory.createIdentifier(`Base${modelName}Service`),
        undefined,
      )],
    )],
    [
      createConstructorWithServices([{name: 'prisma', class: 'PrismaService'}]),
    ],
  )
  sourceFile.addStatements(
    [printNode(controller)],
  )
  project.save()
}
