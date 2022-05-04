import {ts} from 'ts-morph'
const factory = ts.factory

export const typeSlalar = {
  String: 'String',
  Boolean: 'Boolean',
  Int: 'Int',
  BigInt: 'BigInt',
  Float: 'Float',
  Decimal: 'Decimal',
  DateTime: 'DateTime',
  Json: 'Json',
  Bytes: 'Bytes',
  // Unsupported: 'Unsupported',
} as const

export const getTsType = (type: string) => {
  const prismaType2TsType: {[key: string]: any} = {
    String: factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    Boolean: factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
    Int: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    BigInt: factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword),
    Float: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    Decimal: factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    DateTime: factory.createTypeReferenceNode(factory.createIdentifier('Date')),
    Json: factory.createKeywordTypeNode(ts.SyntaxKind.ObjectKeyword),
    Bytes: factory.createTypeReferenceNode(factory.createIdentifier('Buffer')),
  }
  return prismaType2TsType[type]
}

export type modelType = {
  modelName: string;
  fields: {
    name: string;
    type: keyof typeof typeSlalar;
    modifiers: {
      isArray: boolean;
      isOptional: boolean;
    };
    attributes: {
      '@default': {
        value: string;
      };
    };
    isCreate: boolean;
    isUpdate: boolean;
  }[];
};

export const functions = {
  uuid: 'uuid',
} as const
