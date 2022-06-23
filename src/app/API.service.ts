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
  onCreateFiling: OnCreateFilingSubscription;
  onUpdateFiling: OnUpdateFilingSubscription;
  onDeleteFiling: OnDeleteFilingSubscription;
  onCreateDeceased: OnCreateDeceasedSubscription;
  onUpdateDeceased: OnUpdateDeceasedSubscription;
  onDeleteDeceased: OnDeleteDeceasedSubscription;
  onCreateRect: OnCreateRectSubscription;
  onUpdateRect: OnUpdateRectSubscription;
  onDeleteRect: OnDeleteRectSubscription;
  onCreateLineItem: OnCreateLineItemSubscription;
  onUpdateLineItem: OnUpdateLineItemSubscription;
  onDeleteLineItem: OnDeleteLineItemSubscription;
  onCreateDocument: OnCreateDocumentSubscription;
  onUpdateDocument: OnUpdateDocumentSubscription;
  onDeleteDocument: OnDeleteDocumentSubscription;
  onCreateLine: OnCreateLineSubscription;
  onUpdateLine: OnUpdateLineSubscription;
  onDeleteLine: OnDeleteLineSubscription;
  onCreateWord: OnCreateWordSubscription;
  onUpdateWord: OnUpdateWordSubscription;
  onDeleteWord: OnDeleteWordSubscription;
};

export type CreateProbateRecordInput = {
  id?: string | null;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
};

export type ModelProbateRecordConditionInput = {
  title?: ModelStringInput | null;
  deceasedId?: ModelIDInput | null;
  filingId?: ModelIDInput | null;
  appraiser?: ModelStringInput | null;
  witness?: ModelStringInput | null;
  lineItemIds?: ModelIDInput | null;
  totalValue?: ModelFloatInput | null;
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

export type ProbateRecord = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProbateRecordInput = {
  id: string;
  title?: string | null;
  deceasedId?: string | null;
  filingId?: string | null;
  appraiser?: Array<string | null> | null;
  witness?: Array<string | null> | null;
  lineItemIds?: Array<string | null> | null;
  totalValue?: number | null;
};

export type DeleteProbateRecordInput = {
  id: string;
};

export type CreateFilingInput = {
  id?: string | null;
  state: string;
  county: string;
  date: string;
  filer: string;
};

export type ModelFilingConditionInput = {
  state?: ModelStringInput | null;
  county?: ModelStringInput | null;
  date?: ModelStringInput | null;
  filer?: ModelStringInput | null;
  and?: Array<ModelFilingConditionInput | null> | null;
  or?: Array<ModelFilingConditionInput | null> | null;
  not?: ModelFilingConditionInput | null;
};

export type Filing = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateFilingInput = {
  id: string;
  state?: string | null;
  county?: string | null;
  date?: string | null;
  filer?: string | null;
};

export type DeleteFilingInput = {
  id: string;
};

export type CreateDeceasedInput = {
  id?: string | null;
  name: string;
  gender: string;
};

export type ModelDeceasedConditionInput = {
  name?: ModelStringInput | null;
  gender?: ModelStringInput | null;
  and?: Array<ModelDeceasedConditionInput | null> | null;
  or?: Array<ModelDeceasedConditionInput | null> | null;
  not?: ModelDeceasedConditionInput | null;
};

export type Deceased = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDeceasedInput = {
  id: string;
  name?: string | null;
  gender?: string | null;
};

export type DeleteDeceasedInput = {
  id: string;
};

export type CreateRectInput = {
  id?: string | null;
  left: number;
  top: number;
  width: number;
  height: number;
};

export type ModelRectConditionInput = {
  left?: ModelFloatInput | null;
  top?: ModelFloatInput | null;
  width?: ModelFloatInput | null;
  height?: ModelFloatInput | null;
  and?: Array<ModelRectConditionInput | null> | null;
  or?: Array<ModelRectConditionInput | null> | null;
  not?: ModelRectConditionInput | null;
};

export type Rect = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateRectInput = {
  id: string;
  left?: number | null;
  top?: number | null;
  width?: number | null;
  height?: number | null;
};

export type DeleteRectInput = {
  id: string;
};

export type CreateLineItemInput = {
  id?: string | null;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
};

export type ModelLineItemConditionInput = {
  title?: ModelStringInput | null;
  description?: ModelStringInput | null;
  category?: ModelStringInput | null;
  subcategory?: ModelStringInput | null;
  quantity?: ModelIntInput | null;
  value?: ModelFloatInput | null;
  and?: Array<ModelLineItemConditionInput | null> | null;
  or?: Array<ModelLineItemConditionInput | null> | null;
  not?: ModelLineItemConditionInput | null;
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

export type LineItem = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: Rect;
  createdAt: string;
  updatedAt: string;
};

export type UpdateLineItemInput = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  subcategory?: string | null;
  quantity?: number | null;
  value?: number | null;
};

export type DeleteLineItemInput = {
  id: string;
};

export type CreateDocumentInput = {
  id?: string | null;
  lineIds: Array<string | null>;
};

export type ModelDocumentConditionInput = {
  lineIds?: ModelIDInput | null;
  and?: Array<ModelDocumentConditionInput | null> | null;
  or?: Array<ModelDocumentConditionInput | null> | null;
  not?: ModelDocumentConditionInput | null;
};

export type Document = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDocumentInput = {
  id: string;
  lineIds?: Array<string | null> | null;
};

export type DeleteDocumentInput = {
  id: string;
};

export type CreateLineInput = {
  id?: string | null;
  wordIds: Array<string | null>;
};

export type ModelLineConditionInput = {
  wordIds?: ModelIDInput | null;
  and?: Array<ModelLineConditionInput | null> | null;
  or?: Array<ModelLineConditionInput | null> | null;
  not?: ModelLineConditionInput | null;
};

export type Line = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: Rect;
  createdAt: string;
  updatedAt: string;
};

export type UpdateLineInput = {
  id: string;
  wordIds?: Array<string | null> | null;
};

export type DeleteLineInput = {
  id: string;
};

export type CreateWordInput = {
  id?: string | null;
  text: string;
};

export type ModelWordConditionInput = {
  text?: ModelStringInput | null;
  and?: Array<ModelWordConditionInput | null> | null;
  or?: Array<ModelWordConditionInput | null> | null;
  not?: ModelWordConditionInput | null;
};

export type Word = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: Rect;
  createdAt: string;
  updatedAt: string;
};

export type UpdateWordInput = {
  id: string;
  text?: string | null;
};

export type DeleteWordInput = {
  id: string;
};

export type ModelProbateRecordFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  deceasedId?: ModelIDInput | null;
  filingId?: ModelIDInput | null;
  appraiser?: ModelStringInput | null;
  witness?: ModelStringInput | null;
  lineItemIds?: ModelIDInput | null;
  totalValue?: ModelFloatInput | null;
  and?: Array<ModelProbateRecordFilterInput | null> | null;
  or?: Array<ModelProbateRecordFilterInput | null> | null;
  not?: ModelProbateRecordFilterInput | null;
};

export type ModelProbateRecordConnection = {
  __typename: "ModelProbateRecordConnection";
  items: Array<ProbateRecord | null>;
  nextToken?: string | null;
};

export type ModelFilingFilterInput = {
  id?: ModelIDInput | null;
  state?: ModelStringInput | null;
  county?: ModelStringInput | null;
  date?: ModelStringInput | null;
  filer?: ModelStringInput | null;
  and?: Array<ModelFilingFilterInput | null> | null;
  or?: Array<ModelFilingFilterInput | null> | null;
  not?: ModelFilingFilterInput | null;
};

export type ModelFilingConnection = {
  __typename: "ModelFilingConnection";
  items: Array<Filing | null>;
  nextToken?: string | null;
};

export type ModelDeceasedFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  gender?: ModelStringInput | null;
  and?: Array<ModelDeceasedFilterInput | null> | null;
  or?: Array<ModelDeceasedFilterInput | null> | null;
  not?: ModelDeceasedFilterInput | null;
};

export type ModelDeceasedConnection = {
  __typename: "ModelDeceasedConnection";
  items: Array<Deceased | null>;
  nextToken?: string | null;
};

export type ModelRectFilterInput = {
  id?: ModelIDInput | null;
  left?: ModelFloatInput | null;
  top?: ModelFloatInput | null;
  width?: ModelFloatInput | null;
  height?: ModelFloatInput | null;
  and?: Array<ModelRectFilterInput | null> | null;
  or?: Array<ModelRectFilterInput | null> | null;
  not?: ModelRectFilterInput | null;
};

export type ModelRectConnection = {
  __typename: "ModelRectConnection";
  items: Array<Rect | null>;
  nextToken?: string | null;
};

export type ModelLineItemFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  description?: ModelStringInput | null;
  category?: ModelStringInput | null;
  subcategory?: ModelStringInput | null;
  quantity?: ModelIntInput | null;
  value?: ModelFloatInput | null;
  and?: Array<ModelLineItemFilterInput | null> | null;
  or?: Array<ModelLineItemFilterInput | null> | null;
  not?: ModelLineItemFilterInput | null;
};

export type ModelLineItemConnection = {
  __typename: "ModelLineItemConnection";
  items: Array<LineItem | null>;
  nextToken?: string | null;
};

export type ModelDocumentFilterInput = {
  id?: ModelIDInput | null;
  lineIds?: ModelIDInput | null;
  and?: Array<ModelDocumentFilterInput | null> | null;
  or?: Array<ModelDocumentFilterInput | null> | null;
  not?: ModelDocumentFilterInput | null;
};

export type ModelDocumentConnection = {
  __typename: "ModelDocumentConnection";
  items: Array<Document | null>;
  nextToken?: string | null;
};

export type ModelLineFilterInput = {
  id?: ModelIDInput | null;
  wordIds?: ModelIDInput | null;
  and?: Array<ModelLineFilterInput | null> | null;
  or?: Array<ModelLineFilterInput | null> | null;
  not?: ModelLineFilterInput | null;
};

export type ModelLineConnection = {
  __typename: "ModelLineConnection";
  items: Array<Line | null>;
  nextToken?: string | null;
};

export type ModelWordFilterInput = {
  id?: ModelIDInput | null;
  text?: ModelStringInput | null;
  and?: Array<ModelWordFilterInput | null> | null;
  or?: Array<ModelWordFilterInput | null> | null;
  not?: ModelWordFilterInput | null;
};

export type ModelWordConnection = {
  __typename: "ModelWordConnection";
  items: Array<Word | null>;
  nextToken?: string | null;
};

export type CreateProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateFilingMutation = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateFilingMutation = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type DeleteFilingMutation = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDeceasedMutation = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDeceasedMutation = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type DeleteDeceasedMutation = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateRectMutation = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type UpdateRectMutation = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type DeleteRectMutation = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateLineItemMutation = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateLineItemMutation = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type DeleteLineItemMutation = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateDocumentMutation = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDocumentMutation = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type DeleteDocumentMutation = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type CreateLineMutation = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateLineMutation = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type DeleteLineMutation = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateWordMutation = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateWordMutation = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type DeleteWordMutation = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type GetProbateRecordQuery = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
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
    lineItemIds: Array<string | null>;
    totalValue: number;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetFilingQuery = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type ListFilingsQuery = {
  __typename: "ModelFilingConnection";
  items: Array<{
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetDeceasedQuery = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type ListDeceasedsQuery = {
  __typename: "ModelDeceasedConnection";
  items: Array<{
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetRectQuery = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type ListRectsQuery = {
  __typename: "ModelRectConnection";
  items: Array<{
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetLineItemQuery = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ListLineItemsQuery = {
  __typename: "ModelLineItemConnection";
  items: Array<{
    __typename: "LineItem";
    id: string;
    title: string;
    description: string;
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetDocumentQuery = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type ListDocumentsQuery = {
  __typename: "ModelDocumentConnection";
  items: Array<{
    __typename: "Document";
    id: string;
    lineIds: Array<string | null>;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetLineQuery = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ListLinesQuery = {
  __typename: "ModelLineConnection";
  items: Array<{
    __typename: "Line";
    id: string;
    wordIds: Array<string | null>;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetWordQuery = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type ListWordsQuery = {
  __typename: "ModelWordConnection";
  items: Array<{
    __typename: "Word";
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceasedId: string;
  filingId: string;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  lineItemIds: Array<string | null>;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateFilingSubscription = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateFilingSubscription = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteFilingSubscription = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateDeceasedSubscription = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateDeceasedSubscription = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteDeceasedSubscription = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateRectSubscription = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateRectSubscription = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteRectSubscription = {
  __typename: "Rect";
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateLineItemSubscription = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateLineItemSubscription = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteLineItemSubscription = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnCreateDocumentSubscription = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateDocumentSubscription = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteDocumentSubscription = {
  __typename: "Document";
  id: string;
  lineIds: Array<string | null>;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateLineSubscription = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateLineSubscription = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteLineSubscription = {
  __typename: "Line";
  id: string;
  wordIds: Array<string | null>;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnCreateWordSubscription = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateWordSubscription = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteWordSubscription = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: {
    __typename: "Rect";
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
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
  async CreateFiling(
    input: CreateFilingInput,
    condition?: ModelFilingConditionInput
  ): Promise<CreateFilingMutation> {
    const statement = `mutation CreateFiling($input: CreateFilingInput!, $condition: ModelFilingConditionInput) {
        createFiling(input: $input, condition: $condition) {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
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
    return <CreateFilingMutation>response.data.createFiling;
  }
  async UpdateFiling(
    input: UpdateFilingInput,
    condition?: ModelFilingConditionInput
  ): Promise<UpdateFilingMutation> {
    const statement = `mutation UpdateFiling($input: UpdateFilingInput!, $condition: ModelFilingConditionInput) {
        updateFiling(input: $input, condition: $condition) {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
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
    return <UpdateFilingMutation>response.data.updateFiling;
  }
  async DeleteFiling(
    input: DeleteFilingInput,
    condition?: ModelFilingConditionInput
  ): Promise<DeleteFilingMutation> {
    const statement = `mutation DeleteFiling($input: DeleteFilingInput!, $condition: ModelFilingConditionInput) {
        deleteFiling(input: $input, condition: $condition) {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
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
    return <DeleteFilingMutation>response.data.deleteFiling;
  }
  async CreateDeceased(
    input: CreateDeceasedInput,
    condition?: ModelDeceasedConditionInput
  ): Promise<CreateDeceasedMutation> {
    const statement = `mutation CreateDeceased($input: CreateDeceasedInput!, $condition: ModelDeceasedConditionInput) {
        createDeceased(input: $input, condition: $condition) {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
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
    return <CreateDeceasedMutation>response.data.createDeceased;
  }
  async UpdateDeceased(
    input: UpdateDeceasedInput,
    condition?: ModelDeceasedConditionInput
  ): Promise<UpdateDeceasedMutation> {
    const statement = `mutation UpdateDeceased($input: UpdateDeceasedInput!, $condition: ModelDeceasedConditionInput) {
        updateDeceased(input: $input, condition: $condition) {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
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
    return <UpdateDeceasedMutation>response.data.updateDeceased;
  }
  async DeleteDeceased(
    input: DeleteDeceasedInput,
    condition?: ModelDeceasedConditionInput
  ): Promise<DeleteDeceasedMutation> {
    const statement = `mutation DeleteDeceased($input: DeleteDeceasedInput!, $condition: ModelDeceasedConditionInput) {
        deleteDeceased(input: $input, condition: $condition) {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
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
    return <DeleteDeceasedMutation>response.data.deleteDeceased;
  }
  async CreateRect(
    input: CreateRectInput,
    condition?: ModelRectConditionInput
  ): Promise<CreateRectMutation> {
    const statement = `mutation CreateRect($input: CreateRectInput!, $condition: ModelRectConditionInput) {
        createRect(input: $input, condition: $condition) {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
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
    return <CreateRectMutation>response.data.createRect;
  }
  async UpdateRect(
    input: UpdateRectInput,
    condition?: ModelRectConditionInput
  ): Promise<UpdateRectMutation> {
    const statement = `mutation UpdateRect($input: UpdateRectInput!, $condition: ModelRectConditionInput) {
        updateRect(input: $input, condition: $condition) {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
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
    return <UpdateRectMutation>response.data.updateRect;
  }
  async DeleteRect(
    input: DeleteRectInput,
    condition?: ModelRectConditionInput
  ): Promise<DeleteRectMutation> {
    const statement = `mutation DeleteRect($input: DeleteRectInput!, $condition: ModelRectConditionInput) {
        deleteRect(input: $input, condition: $condition) {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
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
    return <DeleteRectMutation>response.data.deleteRect;
  }
  async CreateLineItem(
    input: CreateLineItemInput,
    condition?: ModelLineItemConditionInput
  ): Promise<CreateLineItemMutation> {
    const statement = `mutation CreateLineItem($input: CreateLineItemInput!, $condition: ModelLineItemConditionInput) {
        createLineItem(input: $input, condition: $condition) {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <CreateLineItemMutation>response.data.createLineItem;
  }
  async UpdateLineItem(
    input: UpdateLineItemInput,
    condition?: ModelLineItemConditionInput
  ): Promise<UpdateLineItemMutation> {
    const statement = `mutation UpdateLineItem($input: UpdateLineItemInput!, $condition: ModelLineItemConditionInput) {
        updateLineItem(input: $input, condition: $condition) {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <UpdateLineItemMutation>response.data.updateLineItem;
  }
  async DeleteLineItem(
    input: DeleteLineItemInput,
    condition?: ModelLineItemConditionInput
  ): Promise<DeleteLineItemMutation> {
    const statement = `mutation DeleteLineItem($input: DeleteLineItemInput!, $condition: ModelLineItemConditionInput) {
        deleteLineItem(input: $input, condition: $condition) {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <DeleteLineItemMutation>response.data.deleteLineItem;
  }
  async CreateDocument(
    input: CreateDocumentInput,
    condition?: ModelDocumentConditionInput
  ): Promise<CreateDocumentMutation> {
    const statement = `mutation CreateDocument($input: CreateDocumentInput!, $condition: ModelDocumentConditionInput) {
        createDocument(input: $input, condition: $condition) {
          __typename
          id
          lineIds
          createdAt
          updatedAt
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
          lineIds
          createdAt
          updatedAt
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
          lineIds
          createdAt
          updatedAt
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
  async CreateLine(
    input: CreateLineInput,
    condition?: ModelLineConditionInput
  ): Promise<CreateLineMutation> {
    const statement = `mutation CreateLine($input: CreateLineInput!, $condition: ModelLineConditionInput) {
        createLine(input: $input, condition: $condition) {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <CreateLineMutation>response.data.createLine;
  }
  async UpdateLine(
    input: UpdateLineInput,
    condition?: ModelLineConditionInput
  ): Promise<UpdateLineMutation> {
    const statement = `mutation UpdateLine($input: UpdateLineInput!, $condition: ModelLineConditionInput) {
        updateLine(input: $input, condition: $condition) {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <UpdateLineMutation>response.data.updateLine;
  }
  async DeleteLine(
    input: DeleteLineInput,
    condition?: ModelLineConditionInput
  ): Promise<DeleteLineMutation> {
    const statement = `mutation DeleteLine($input: DeleteLineInput!, $condition: ModelLineConditionInput) {
        deleteLine(input: $input, condition: $condition) {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <DeleteLineMutation>response.data.deleteLine;
  }
  async CreateWord(
    input: CreateWordInput,
    condition?: ModelWordConditionInput
  ): Promise<CreateWordMutation> {
    const statement = `mutation CreateWord($input: CreateWordInput!, $condition: ModelWordConditionInput) {
        createWord(input: $input, condition: $condition) {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <CreateWordMutation>response.data.createWord;
  }
  async UpdateWord(
    input: UpdateWordInput,
    condition?: ModelWordConditionInput
  ): Promise<UpdateWordMutation> {
    const statement = `mutation UpdateWord($input: UpdateWordInput!, $condition: ModelWordConditionInput) {
        updateWord(input: $input, condition: $condition) {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <UpdateWordMutation>response.data.updateWord;
  }
  async DeleteWord(
    input: DeleteWordInput,
    condition?: ModelWordConditionInput
  ): Promise<DeleteWordMutation> {
    const statement = `mutation DeleteWord($input: DeleteWordInput!, $condition: ModelWordConditionInput) {
        deleteWord(input: $input, condition: $condition) {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
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
    return <DeleteWordMutation>response.data.deleteWord;
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
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
            lineItemIds
            totalValue
            createdAt
            updatedAt
          }
          nextToken
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
    const response = (await API.graphql({
      ...graphqlOperation(statement, gqlAPIServiceArguments),
      authMode: "AMAZON_COGNITO_USER_POOLS"}
    )) as any;
    return <ListProbateRecordsQuery>response.data.listProbateRecords;
  }
  async GetFiling(id: string): Promise<GetFilingQuery> {
    const statement = `query GetFiling($id: ID!) {
        getFiling(id: $id) {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetFilingQuery>response.data.getFiling;
  }
  async ListFilings(
    filter?: ModelFilingFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListFilingsQuery> {
    const statement = `query ListFilings($filter: ModelFilingFilterInput, $limit: Int, $nextToken: String) {
        listFilings(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            state
            county
            date
            filer
            createdAt
            updatedAt
          }
          nextToken
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
    return <ListFilingsQuery>response.data.listFilings;
  }
  async GetDeceased(id: string): Promise<GetDeceasedQuery> {
    const statement = `query GetDeceased($id: ID!) {
        getDeceased(id: $id) {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetDeceasedQuery>response.data.getDeceased;
  }
  async ListDeceaseds(
    filter?: ModelDeceasedFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListDeceasedsQuery> {
    const statement = `query ListDeceaseds($filter: ModelDeceasedFilterInput, $limit: Int, $nextToken: String) {
        listDeceaseds(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          nextToken
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
    return <ListDeceasedsQuery>response.data.listDeceaseds;
  }
  async GetRect(id: string): Promise<GetRectQuery> {
    const statement = `query GetRect($id: ID!) {
        getRect(id: $id) {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetRectQuery>response.data.getRect;
  }
  async ListRects(
    filter?: ModelRectFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListRectsQuery> {
    const statement = `query ListRects($filter: ModelRectFilterInput, $limit: Int, $nextToken: String) {
        listRects(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          nextToken
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
    return <ListRectsQuery>response.data.listRects;
  }
  async GetLineItem(id: string): Promise<GetLineItemQuery> {
    const statement = `query GetLineItem($id: ID!) {
        getLineItem(id: $id) {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetLineItemQuery>response.data.getLineItem;
  }
  async ListLineItems(
    filter?: ModelLineItemFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListLineItemsQuery> {
    const statement = `query ListLineItems($filter: ModelLineItemFilterInput, $limit: Int, $nextToken: String) {
        listLineItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            title
            description
            category
            subcategory
            quantity
            value
            createdAt
            updatedAt
          }
          nextToken
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
    return <ListLineItemsQuery>response.data.listLineItems;
  }
  async GetDocument(id: string): Promise<GetDocumentQuery> {
    const statement = `query GetDocument($id: ID!) {
        getDocument(id: $id) {
          __typename
          id
          lineIds
          createdAt
          updatedAt
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
            lineIds
            createdAt
            updatedAt
          }
          nextToken
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
  async GetLine(id: string): Promise<GetLineQuery> {
    const statement = `query GetLine($id: ID!) {
        getLine(id: $id) {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetLineQuery>response.data.getLine;
  }
  async ListLines(
    filter?: ModelLineFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListLinesQuery> {
    const statement = `query ListLines($filter: ModelLineFilterInput, $limit: Int, $nextToken: String) {
        listLines(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            wordIds
            createdAt
            updatedAt
          }
          nextToken
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
    return <ListLinesQuery>response.data.listLines;
  }
  async GetWord(id: string): Promise<GetWordQuery> {
    const statement = `query GetWord($id: ID!) {
        getWord(id: $id) {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetWordQuery>response.data.getWord;
  }
  async ListWords(
    filter?: ModelWordFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListWordsQuery> {
    const statement = `query ListWords($filter: ModelWordFilterInput, $limit: Int, $nextToken: String) {
        listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            text
            createdAt
            updatedAt
          }
          nextToken
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
    return <ListWordsQuery>response.data.listWords;
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
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
          lineItemIds
          totalValue
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteProbateRecord">>
  >;

  OnCreateFilingListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFiling">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateFiling {
        onCreateFiling {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateFiling">>
  >;

  OnUpdateFilingListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFiling">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateFiling {
        onUpdateFiling {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateFiling">>
  >;

  OnDeleteFilingListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFiling">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteFiling {
        onDeleteFiling {
          __typename
          id
          state
          county
          date
          filer
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteFiling">>
  >;

  OnCreateDeceasedListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDeceased">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateDeceased {
        onCreateDeceased {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDeceased">>
  >;

  OnUpdateDeceasedListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateDeceased">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateDeceased {
        onUpdateDeceased {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateDeceased">>
  >;

  OnDeleteDeceasedListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDeceased">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteDeceased {
        onDeleteDeceased {
          __typename
          id
          name
          gender
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDeceased">>
  >;

  OnCreateRectListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateRect">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateRect {
        onCreateRect {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateRect">>
  >;

  OnUpdateRectListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateRect">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateRect {
        onUpdateRect {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateRect">>
  >;

  OnDeleteRectListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteRect">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteRect {
        onDeleteRect {
          __typename
          id
          left
          top
          width
          height
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteRect">>
  >;

  OnCreateLineItemListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLineItem">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateLineItem {
        onCreateLineItem {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLineItem">>
  >;

  OnUpdateLineItemListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLineItem">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateLineItem {
        onUpdateLineItem {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLineItem">>
  >;

  OnDeleteLineItemListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLineItem">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteLineItem {
        onDeleteLineItem {
          __typename
          id
          title
          description
          category
          subcategory
          quantity
          value
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLineItem">>
  >;

  OnCreateDocumentListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDocument">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateDocument {
        onCreateDocument {
          __typename
          id
          lineIds
          createdAt
          updatedAt
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
          lineIds
          createdAt
          updatedAt
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
          lineIds
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDocument">>
  >;

  OnCreateLineListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLine">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateLine {
        onCreateLine {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLine">>
  >;

  OnUpdateLineListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLine">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateLine {
        onUpdateLine {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLine">>
  >;

  OnDeleteLineListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLine">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteLine {
        onDeleteLine {
          __typename
          id
          wordIds
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLine">>
  >;

  OnCreateWordListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateWord">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateWord {
        onCreateWord {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateWord">>
  >;

  OnUpdateWordListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateWord">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateWord {
        onUpdateWord {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateWord">>
  >;

  OnDeleteWordListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteWord">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteWord {
        onDeleteWord {
          __typename
          id
          text
          boundingBox {
            __typename
            id
            left
            top
            width
            height
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteWord">>
  >;
}
