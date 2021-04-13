export interface IClaimSchema {
  $id: string;
  $schema: string;
  properties: {
    [key: string]: {
      $ref?: string;
      type?: string;
      format?: string;
    };
  };
  title: string;
}

export interface IClaimType {
  hash: string;
  owner: string | null;
  schema: IClaimSchema;
}
