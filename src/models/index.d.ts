import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ProbateRecordMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LineItemMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type RectMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type FilingMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DeceasedMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DocumentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LineMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type WordMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class ProbateRecord {
  readonly id: string;
  readonly title: string;
  readonly deceasedId: string;
  readonly filingId: string;
  readonly appraiser: (string | null)[];
  readonly witness: (string | null)[];
  readonly lineItems: (LineItem | null)[];
  readonly totalValue: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<ProbateRecord, ProbateRecordMetaData>);
  static copyOf(source: ProbateRecord, mutator: (draft: MutableModel<ProbateRecord, ProbateRecordMetaData>) => MutableModel<ProbateRecord, ProbateRecordMetaData> | void): ProbateRecord;
}

export declare class LineItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly subcategory: string;
  readonly quantity: number;
  readonly value: number;
  readonly boundingBox: Rect;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly probateRecordLineItemsId?: string | null;
  readonly lineItemBoundingBoxId: string;
  constructor(init: ModelInit<LineItem, LineItemMetaData>);
  static copyOf(source: LineItem, mutator: (draft: MutableModel<LineItem, LineItemMetaData>) => MutableModel<LineItem, LineItemMetaData> | void): LineItem;
}

export declare class Rect {
  readonly id: string;
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Rect, RectMetaData>);
  static copyOf(source: Rect, mutator: (draft: MutableModel<Rect, RectMetaData>) => MutableModel<Rect, RectMetaData> | void): Rect;
}

export declare class Filing {
  readonly id: string;
  readonly state: string;
  readonly county: string;
  readonly date: string;
  readonly filer: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Filing, FilingMetaData>);
  static copyOf(source: Filing, mutator: (draft: MutableModel<Filing, FilingMetaData>) => MutableModel<Filing, FilingMetaData> | void): Filing;
}

export declare class Deceased {
  readonly id: string;
  readonly name: string;
  readonly gender: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Deceased, DeceasedMetaData>);
  static copyOf(source: Deceased, mutator: (draft: MutableModel<Deceased, DeceasedMetaData>) => MutableModel<Deceased, DeceasedMetaData> | void): Deceased;
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

export declare class Line {
  readonly id: string;
  readonly wordIds: (string | null)[];
  readonly boundingBox: Rect;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly documentLinesId?: string | null;
  readonly lineBoundingBoxId: string;
  constructor(init: ModelInit<Line, LineMetaData>);
  static copyOf(source: Line, mutator: (draft: MutableModel<Line, LineMetaData>) => MutableModel<Line, LineMetaData> | void): Line;
}

export declare class Word {
  readonly id: string;
  readonly text: string;
  readonly boundingBox: Rect;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly documentWordsId?: string | null;
  readonly wordBoundingBoxId: string;
  constructor(init: ModelInit<Word, WordMetaData>);
  static copyOf(source: Word, mutator: (draft: MutableModel<Word, WordMetaData>) => MutableModel<Word, WordMetaData> | void): Word;
}