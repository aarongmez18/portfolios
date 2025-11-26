
export interface CommandDefinition {
  dynamic?: boolean;
  output?: string[];
}

export interface CommandFile {
  commands: { [key: string]: CommandDefinition };
}


export interface FileSystem {
  [key: string]: FileSystem | string;
}
