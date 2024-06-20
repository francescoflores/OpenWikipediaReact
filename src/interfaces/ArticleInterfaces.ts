export interface IParagraph {
  title: string;
  text: string;
  images?: string[];
  tables?: ITable[];
  level: number;
}

export interface ITable {
  caption: string;
  rows: { [key: string]: (string | ITable)[] };
}

export interface IArticle {
  title: string;
  url: string;
  paragraphs: IParagraph[];
  infoTable: ITable;
}

export interface RouteParams {
  title: string;
}

export interface IMinimalArticle {
  title: string;
  url: string;
}

export interface IndexElement {
  title:string;
  level:number;
}

