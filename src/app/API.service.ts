/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateProbateRecord: OnCreateProbateRecordSubscription;
  onUpdateProbateRecord: OnUpdateProbateRecordSubscription;
  onDeleteProbateRecord: OnDeleteProbateRecordSubscription;
  onCreateDocument: OnCreateDocumentSubscription;
  onUpdateDocument: OnUpdateDocumentSubscription;
  onDeleteDocument: OnDeleteDocumentSubscription;
};

export type CreateProbateRecordInput = {
  id?: string | null;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<LineItemInput | null>;
  words: Array<WordInput | null>;
  totalValue: number;
  reviewCount: number;
  _version?: number | null;
};

export type LineItemInput = {
  id?: string | null;
  wordIds: Array<string | null>;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox?: RectInput | null;
  attributeForId: string;
};

export type RectInput = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type WordInput = {
  id?: string | null;
  text: string;
  boundingBox?: RectInput | null;
};

export type ModelProbateRecordConditionInput = {
  title?: ModelStringInput | null;
  deceasedId?: ModelIDInput | null;
  filingId?: ModelIDInput | null;
  appraiser?: ModelStringInput | null;
  witness?: ModelStringInput | null;
  totalValue?: ModelFloatInput | null;
  reviewCount?: ModelIntInput | null;
  and?: Array<ModelProbateRecordConditionInput | null> | null;
  or?: Array<ModelProbateRecordConditionInput | null> | null;
  not?: ModelProbateRecordConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelFloatInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelIntInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ProbateRecord = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<LineItem | null>;
  words: Array<Word | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type LineItem = {
  __typename: "LineItem";
  id: string;
  wordIds: Array<string | null>;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox?: Rect | null;
  attributeForId: string;
};

export type Rect = {
  __typename: "Rect";
  left: number;
  top: number;
  width: number;
  height: number;
};

export type Word = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox?: Rect | null;
};

export type UpdateProbateRecordInput = {
  id: string;
  title?: string | null;
  deceasedId?: string | null;
  filingId?: string | null;
  appraiser?: Array<string | null> | null;
  witness?: Array<string | null> | null;
  lineItems?: Array<LineItemInput | null> | null;
  words?: Array<WordInput | null> | null;
  totalValue?: number | null;
  reviewCount?: number | null;
  _version?: number | null;
};

export type DeleteProbateRecordInput = {
  id: string;
  _version?: number | null;
};

export type CreateDocumentInput = {
  id?: string | null;
  lines: Array<LineInput | null>;
  words: Array<WordInput | null>;
  _version?: number | null;
};

export type LineInput = {
  id?: string | null;
  wordIds: Array<string | null>;
  boundingBox: RectInput;
};

export type ModelDocumentConditionInput = {
  and?: Array<ModelDocumentConditionInput | null> | null;
  or?: Array<ModelDocumentConditionInput | null> | null;
  not?: ModelDocumentConditionInput | null;
};

export type Document = {
  __typename: "Document";
  id: string;
  lines: Array<Line | null>;
  words: Array<Word | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type Line = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: Rect;
};

export type UpdateDocumentInput = {
  id: string;
  lines?: Array<LineInput | null> | null;
  words?: Array<WordInput | null> | null;
  _version?: number | null;
};

export type DeleteDocumentInput = {
  id: string;
  _version?: number | null;
};

export type ModelProbateRecordFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  deceasedId?: ModelIDInput | null;
  filingId?: ModelIDInput | null;
  appraiser?: ModelStringInput | null;
  witness?: ModelStringInput | null;
  totalValue?: ModelFloatInput | null;
  reviewCount?: ModelIntInput | null;
  and?: Array<ModelProbateRecordFilterInput | null> | null;
  or?: Array<ModelProbateRecordFilterInput | null> | null;
  not?: ModelProbateRecordFilterInput | null;
};

export type ModelProbateRecordConnection = {
  __typename: "ModelProbateRecordConnection";
  items: Array<ProbateRecord | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelDocumentFilterInput = {
  id?: ModelIDInput | null;
  and?: Array<ModelDocumentFilterInput | null> | null;
  or?: Array<ModelDocumentFilterInput | null> | null;
  not?: ModelDocumentFilterInput | null;
};

export type ModelDocumentConnection = {
  __typename: "ModelDocumentConnection";
  items: Array<Document | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type CreateProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateDocumentMutation = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateDocumentMutation = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteDocumentMutation = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type GetProbateRecordQuery = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListProbateRecordsQuery = {
  __typename: "ModelProbateRecordConnection";
  items: Array<{
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceasedId: string;
    filingId: string;
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    lineItems: Array<{
      __typename: "LineItem";
      id: string;
      wordIds: Array<string | null>;
      title: string;
      description: string;
      category: string;
      subcategory: string;
      quantity: number;
      value: number;
      boundingBox?: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
      attributeForId: string;
    } | null>;
    words: Array<{
      __typename: "Word";
      id: string;
      text: string;
      boundingBox?: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
    } | null>;
    totalValue: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncProbateRecordsQuery = {
  __typename: "ModelProbateRecordConnection";
  items: Array<{
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceasedId: string;
    filingId: string;
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    lineItems: Array<{
      __typename: "LineItem";
      id: string;
      wordIds: Array<string | null>;
      title: string;
      description: string;
      category: string;
      subcategory: string;
      quantity: number;
      value: number;
      boundingBox?: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
      attributeForId: string;
    } | null>;
    words: Array<{
      __typename: "Word";
      id: string;
      text: string;
      boundingBox?: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
    } | null>;
    totalValue: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetDocumentQuery = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListDocumentsQuery = {
  __typename: "ModelDocumentConnection";
  items: Array<{
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      wordIds: Array<string | null>;
      boundingBox: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      };
    } | null>;
    words: Array<{
      __typename: "Word";
      id: string;
      text: string;
      boundingBox?: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
    } | null>;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncDocumentsQuery = {
  __typename: "ModelDocumentConnection";
  items: Array<{
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      wordIds: Array<string | null>;
      boundingBox: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      };
    } | null>;
    words: Array<{
      __typename: "Word";
      id: string;
      text: string;
      boundingBox?: {
        __typename: "Rect";
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
    } | null>;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type OnCreateProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItems: Array<{
    __typename: "LineItem";
    id: string;
    wordIds: Array<string | null>;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
    attributeForId: string;
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  totalValue: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateDocumentSubscription = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateDocumentSubscription = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteDocumentSubscription = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    boundingBox: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    };
  } | null>;
  words: Array<{
    __typename: "Word";
    id: string;
    text: string;
    boundingBox?: {
      __typename: "Rect";
      left: number;
      top: number;
      width: number;
      height: number;
    } | null;
  } | null>;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateProbateRecord(
    input: CreateProbateRecordInput,
    condition?: ModelProbateRecordConditionInput
  ): Promise<CreateProbateRecordMutation> {
    const statement = `mutation CreateProbateRecord($input: CreateProbateRecordInput!, $condition: ModelProbateRecordConditionInput) {
        createProbateRecord(input: $input, condition: $condition) {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateProbateRecordMutation>response.data.createProbateRecord;
  }
  async UpdateProbateRecord(
    input: UpdateProbateRecordInput,
    condition?: ModelProbateRecordConditionInput
  ): Promise<UpdateProbateRecordMutation> {
    const statement = `mutation UpdateProbateRecord($input: UpdateProbateRecordInput!, $condition: ModelProbateRecordConditionInput) {
        updateProbateRecord(input: $input, condition: $condition) {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateProbateRecordMutation>response.data.updateProbateRecord;
  }
  async DeleteProbateRecord(
    input: DeleteProbateRecordInput,
    condition?: ModelProbateRecordConditionInput
  ): Promise<DeleteProbateRecordMutation> {
    const statement = `mutation DeleteProbateRecord($input: DeleteProbateRecordInput!, $condition: ModelProbateRecordConditionInput) {
        deleteProbateRecord(input: $input, condition: $condition) {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteProbateRecordMutation>response.data.deleteProbateRecord;
  }
  async CreateDocument(
    input: CreateDocumentInput,
    condition?: ModelDocumentConditionInput
  ): Promise<CreateDocumentMutation> {
    const statement = `mutation CreateDocument($input: CreateDocumentInput!, $condition: ModelDocumentConditionInput) {
        createDocument(input: $input, condition: $condition) {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateDocumentMutation>response.data.createDocument;
  }
  async UpdateDocument(
    input: UpdateDocumentInput,
    condition?: ModelDocumentConditionInput
  ): Promise<UpdateDocumentMutation> {
    const statement = `mutation UpdateDocument($input: UpdateDocumentInput!, $condition: ModelDocumentConditionInput) {
        updateDocument(input: $input, condition: $condition) {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateDocumentMutation>response.data.updateDocument;
  }
  async DeleteDocument(
    input: DeleteDocumentInput,
    condition?: ModelDocumentConditionInput
  ): Promise<DeleteDocumentMutation> {
    const statement = `mutation DeleteDocument($input: DeleteDocumentInput!, $condition: ModelDocumentConditionInput) {
        deleteDocument(input: $input, condition: $condition) {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteDocumentMutation>response.data.deleteDocument;
  }
  async GetProbateRecord(id: string): Promise<GetProbateRecordQuery> {
    const statement = `query GetProbateRecord($id: ID!) {
        getProbateRecord(id: $id) {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetProbateRecordQuery>response.data.getProbateRecord;
  }
  async ListProbateRecords(
    filter?: ModelProbateRecordFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListProbateRecordsQuery> {
    const statement = `query ListProbateRecords($filter: ModelProbateRecordFilterInput, $limit: Int, $nextToken: String) {
        listProbateRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            title
            deceasedId
            filingId
            appraiser
            witness
            lineItems {
              __typename
              id
              wordIds
              title
              description
              category
              subcategory
              quantity
              value
              boundingBox {
                __typename
                left
                top
                width
                height
              }
              attributeForId
            }
            words {
              __typename
              id
              text
              boundingBox {
                __typename
                left
                top
                width
                height
              }
            }
            totalValue
            reviewCount
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListProbateRecordsQuery>response.data.listProbateRecords;
  }
  async SyncProbateRecords(
    filter?: ModelProbateRecordFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncProbateRecordsQuery> {
    const statement = `query SyncProbateRecords($filter: ModelProbateRecordFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncProbateRecords(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            title
            deceasedId
            filingId
            appraiser
            witness
            lineItems {
              __typename
              id
              wordIds
              title
              description
              category
              subcategory
              quantity
              value
              boundingBox {
                __typename
                left
                top
                width
                height
              }
              attributeForId
            }
            words {
              __typename
              id
              text
              boundingBox {
                __typename
                left
                top
                width
                height
              }
            }
            totalValue
            reviewCount
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncProbateRecordsQuery>response.data.syncProbateRecords;
  }
  async GetDocument(id: string): Promise<GetDocumentQuery> {
    const statement = `query GetDocument($id: ID!) {
        getDocument(id: $id) {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetDocumentQuery>response.data.getDocument;
  }
  async ListDocuments(
    filter?: ModelDocumentFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListDocumentsQuery> {
    const statement = `query ListDocuments($filter: ModelDocumentFilterInput, $limit: Int, $nextToken: String) {
        listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            lines {
              __typename
              id
              wordIds
              boundingBox {
                __typename
                left
                top
                width
                height
              }
            }
            words {
              __typename
              id
              text
              boundingBox {
                __typename
                left
                top
                width
                height
              }
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListDocumentsQuery>response.data.listDocuments;
  }
  async SyncDocuments(
    filter?: ModelDocumentFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncDocumentsQuery> {
    const statement = `query SyncDocuments($filter: ModelDocumentFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncDocuments(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            lines {
              __typename
              id
              wordIds
              boundingBox {
                __typename
                left
                top
                width
                height
              }
            }
            words {
              __typename
              id
              text
              boundingBox {
                __typename
                left
                top
                width
                height
              }
            }
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncDocumentsQuery>response.data.syncDocuments;
  }
  OnCreateProbateRecordListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateProbateRecord">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateProbateRecord {
        onCreateProbateRecord {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateProbateRecord">>
  >;

  OnUpdateProbateRecordListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateProbateRecord">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateProbateRecord {
        onUpdateProbateRecord {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateProbateRecord">>
  >;

  OnDeleteProbateRecordListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteProbateRecord">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteProbateRecord {
        onDeleteProbateRecord {
          __typename
          id
          title
          deceasedId
          filingId
          appraiser
          witness
          lineItems {
            __typename
            id
            wordIds
            title
            description
            category
            subcategory
            quantity
            value
            boundingBox {
              __typename
              left
              top
              width
              height
            }
            attributeForId
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          totalValue
          reviewCount
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteProbateRecord">>
  >;

  OnCreateDocumentListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDocument">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateDocument {
        onCreateDocument {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDocument">>
  >;

  OnUpdateDocumentListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateDocument">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateDocument {
        onUpdateDocument {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateDocument">>
  >;

  OnDeleteDocumentListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDocument">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteDocument {
        onDeleteDocument {
          __typename
          id
          lines {
            __typename
            id
            wordIds
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          words {
            __typename
            id
            text
            boundingBox {
              __typename
              left
              top
              width
              height
            }
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDocument">>
  >;
}
