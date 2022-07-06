/* eslint-disable unicorn/no-useless-undefined */
import {Project, ts, printNode} from 'ts-morph'
import {join} from 'node:path'
import {writeFileSync} from 'node:fs'

export const addController = (cwdProject: string, modelName: string): void => {
  const modulePath = join(
    cwdProject,
    `${modelName.toLowerCase()}.controller.ts`,
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
      ],
      from: '@nestjs/common',
    },
    {
      items: [`${modelName}Service`],
      from: `./${modelName.toLowerCase()}.service`,
    },
    {
      items: [`Base${modelName}Controller`],
      from: `src/baseModule/${modelName.toLowerCase()}/base.${modelName.toLowerCase()}.controller`,
    },
  ]
  for (const importItem of imports) {
    sourceFile.addImportDeclaration({
      namedImports: importItem.items,
      moduleSpecifier: importItem.from,
      isTypeOnly: false,
    })
  }

  const createConstructorWithServices = (
    services: { name: string; class: string }[],
  ) =>
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
    [factory.createHeritageClause(
      ts.SyntaxKind.ExtendsKeyword,
      [factory.createExpressionWithTypeArguments(
        factory.createIdentifier(`Base${modelName}Controller`),
        undefined,
      )],
    )],
    [
      createConstructorWithServices([
        {name: serviceName, class: `${modelName}Service`},
      ]),
    ],
  )
  sourceFile.addStatements([printNode(controller)])
  project.save()
}
