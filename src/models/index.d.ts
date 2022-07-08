import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class Rect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  constructor(init: ModelInit<Rect>);
}

export declare class Word {
  readonly id: string;
  readonly text: string;
  readonly boundingBox?: Rect | null;
  constructor(init: ModelInit<Word>);
}

export declare class Filing {
  readonly id: string;
  readonly state: string;
  readonly county: string;
  readonly date: string;
  readonly filer: string;
  constructor(init: ModelInit<Filing>);
}

export declare class Deceased {
  readonly id: string;
  readonly name: string;
  readonly gender: string;
  constructor(init: ModelInit<Deceased>);
}

export declare class Line {
  readonly id: string;
  readonly wordIds: (string | null)[];
  readonly boundingBox: Rect;
  constructor(init: ModelInit<Line>);
}

type ProbateRecordMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LineItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DocumentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ProbateRecord {
  readonly id: string;
  readonly title: string;
  readonly deceasedId: string;
  readonly filingId: string;
  readonly appraiser: (string | null)[];
  readonly witness: (string | null)[];
  readonly lineItems?: (LineItem | null)[] | null;
  readonly words: (Word | null)[];
  readonly totalValue: number;
  readonly reviewCount: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ProbateRecord, ProbateRecordMetaData>);
  static copyOf(source: ProbateRecord, mutator: (draft: MutableModel<ProbateRecord, ProbateRecordMetaData>) => MutableModel<ProbateRecord, ProbateRecordMetaData> | void): ProbateRecord;
}

export declare class LineItem {
  readonly id: string;
  readonly probateId: string;
  readonly wordIds: (string | null)[];
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly subcategory: string;
  readonly quantity: number;
  readonly value: number;
  readonly boundingBox?: Rect | null;
  readonly attributeForId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<LineItem, LineItemMetaData>);
  static copyOf(source: LineItem, mutator: (draft: MutableModel<LineItem, LineItemMetaData>) => MutableModel<LineItem, LineItemMetaData> | void): LineItem;
}

export declare class Document {
  readonly id: string;
  readonly lines: (Line | null)[];
  readonly words: (Word | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Document, DocumentMetaData>);
  static copyOf(source: Document, mutator: (draft: MutableModel<Document, DocumentMetaData>) => MutableModel<Document, DocumentMetaData> | void): Document;
}