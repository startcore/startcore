import {Project, ts, printNode} from 'ts-morph'
import path = require('node:path')

export const setSettings = (cwdProject: string): void => {
  const project = new Project()
  const factory = ts.factory
  const sourceFile = project.addSourceFileAtPath(path.join(cwdProject, 'backend/src/main.ts'))

  const enableCors = factory.createExpressionStatement(factory.createCallExpression(
    factory.createPropertyAccessExpression(
      factory.createIdentifier('app'),
      factory.createIdentifier('enableCors'),
    ),
    undefined,
    [factory.createObjectLiteralExpression(
      [
        factory.createPropertyAssignment(
          factory.createIdentifier('credentials'),
          factory.createTrue(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier('origin'),
          factory.createArrayLiteralExpression(
            [factory.createStringLiteral('http://localhost:3000')],
            false,
          ),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier('methods'),
          factory.createStringLiteral('GET,HEAD,PUT,PATCH,POST,DELETE'),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier('preflightContinue'),
          factory.createFalse(),
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier('optionsSuccessStatus'),
          factory.createNumericLiteral('204'),
        ),
      ],
      true,
    )],
  ))
  const count = sourceFile.getFunctionOrThrow('bootstrap').getBodyOrThrow().getChildren()[1].getChildCount()
  sourceFile.getFunctionOrThrow('bootstrap').getBodyOrThrow().getChildren()[1].getChildren()[count - 1].replaceWithText('await app.listen(8000);')
  sourceFile.getFunctionOrThrow('bootstrap').insertStatements(count - 1,
    [printNode(enableCors)],
  )
  project.save()
}
