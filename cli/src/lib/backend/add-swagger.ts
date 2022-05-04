import {Project, ts, printNode} from 'ts-morph'
import path = require('node:path')
import {execCustom} from '../utils'

export const addSwagger = async (cwdProject: string, nameProject: string): Promise<void> => {
  await execCustom(path.join(cwdProject, 'backend'), 'yarn add @nestjs/swagger swagger-ui-express')
  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(path.join(cwdProject, 'backend/src/main.ts'))

  sourceFile.addImportDeclaration({
    namedImports: [
      'SwaggerModule', 'DocumentBuilder',
    ],
    moduleSpecifier: '@nestjs/swagger',
  })
  const config = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier('config'),
        undefined,
        undefined,
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createCallExpression(
              factory.createPropertyAccessExpression(
                factory.createCallExpression(
                  factory.createPropertyAccessExpression(
                    factory.createCallExpression(
                      factory.createPropertyAccessExpression(
                        factory.createCallExpression(
                          factory.createPropertyAccessExpression(
                            factory.createNewExpression(
                              factory.createIdentifier('DocumentBuilder'),
                              undefined,
                              [],
                            ),
                            factory.createIdentifier('setTitle'),
                          ),
                          undefined,
                          [factory.createStringLiteral(`${nameProject} example`)],
                        ),
                        factory.createIdentifier('setDescription'),
                      ),
                      undefined,
                      [factory.createStringLiteral(`The ${nameProject} API description`)],
                    ),
                    factory.createIdentifier('setVersion'),
                  ),
                  undefined,
                  [factory.createStringLiteral('1.0')],
                ),
                factory.createIdentifier('addTag'),
              ),
              undefined,
              [factory.createStringLiteral(nameProject)],
            ),
            factory.createIdentifier('build'),
          ),
          undefined,
          [],
        ),
      )],
      ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags,
    ),
  )
  const document = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(
        factory.createIdentifier('document'),
        undefined,
        undefined,
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createIdentifier('SwaggerModule'),
            factory.createIdentifier('createDocument'),
          ),
          undefined,
          [
            factory.createIdentifier('app'),
            factory.createIdentifier('config'),
          ],
        ),
      )],
      ts.NodeFlags.Const | ts.NodeFlags.AwaitContext | ts.NodeFlags.ContextFlags | ts.NodeFlags.TypeExcludesFlags,
    ),
  )

  const setup = factory.createExpressionStatement(factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier('SwaggerModule'),
      factory.createIdentifier('setup'),
    ),
    undefined,
    [
      factory.createStringLiteral('api'),
      factory.createIdentifier('app'),
      factory.createIdentifier('document'),
    ],
  ))
  sourceFile.getFunctionOrThrow('bootstrap').insertStatements(1,
    [printNode(config),
      printNode(document),
      printNode(setup)],
  )

  project.save()
}

