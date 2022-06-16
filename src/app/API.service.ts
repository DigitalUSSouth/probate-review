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
  onCreateLineItem: OnCreateLineItemSubscription;
  onUpdateLineItem: OnUpdateLineItemSubscription;
  onDeleteLineItem: OnDeleteLineItemSubscription;
  onCreateRect: OnCreateRectSubscription;
  onUpdateRect: OnUpdateRectSubscription;
  onDeleteRect: OnDeleteRectSubscription;
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
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  totalValue: number;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type ModelProbateRecordConditionInput = {
  title?: ModelStringInput | null;
  appraiser?: ModelStringInput | null;
  witness?: ModelStringInput | null;
  totalValue?: ModelFloatInput | null;
  and?: Array<ModelProbateRecordConditionInput | null> | null;
  or?: Array<ModelProbateRecordConditionInput | null> | null;
  not?: ModelProbateRecordConditionInput | null;
  probateRecordDeceasedId?: ModelIDInput | null;
  probateRecordFilingId?: ModelIDInput | null;
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

export type ProbateRecord = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: Deceased;
  filing: Filing;
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: ModelLineItemConnection | null;
  totalValue: number;
  document: Document;
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type Deceased = {
  __typename: "Deceased";
  id: string;
  name: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
};

export type Filing = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: ProbateRecord;
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
};

export type ModelLineItemConnection = {
  __typename: "ModelLineItemConnection";
  items: Array<LineItem | null>;
  nextToken?: string | null;
};

export type LineItem = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: ProbateRecord;
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: Line;
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
};

export type Line = {
  __typename: "Line";
  id: string;
  text: string;
  words?: ModelWordConnection | null;
  boundingBox: Rect;
  createdAt: string;
  updatedAt: string;
  lineBoundingBoxId: string;
};

export type ModelWordConnection = {
  __typename: "ModelWordConnection";
  items: Array<Word | null>;
  nextToken?: string | null;
};

export type Word = {
  __typename: "Word";
  id: string;
  text: string;
  boundingBox: Rect;
  createdAt: string;
  updatedAt: string;
  lineWordsId: string;
  wordBoundingBoxId: string;
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

export type Document = {
  __typename: "Document";
  id: string;
  lines: Array<Line | null>;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProbateRecordInput = {
  id: string;
  title?: string | null;
  appraiser?: Array<string | null> | null;
  witness?: Array<string | null> | null;
  totalValue?: number | null;
  probateRecordDeceasedId?: string | null;
  probateRecordFilingId?: string | null;
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
  filingProbateId: string;
};

export type ModelFilingConditionInput = {
  state?: ModelStringInput | null;
  county?: ModelStringInput | null;
  date?: ModelStringInput | null;
  filer?: ModelStringInput | null;
  and?: Array<ModelFilingConditionInput | null> | null;
  or?: Array<ModelFilingConditionInput | null> | null;
  not?: ModelFilingConditionInput | null;
  filingProbateId?: ModelIDInput | null;
};

export type UpdateFilingInput = {
  id: string;
  state?: string | null;
  county?: string | null;
  date?: string | null;
  filer?: string | null;
  filingProbateId?: string | null;
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

export type UpdateDeceasedInput = {
  id: string;
  name?: string | null;
  gender?: string | null;
};

export type DeleteDeceasedInput = {
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
  probateRecordItemsId: string;
  lineItemLineId: string;
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
  probateRecordItemsId?: ModelIDInput | null;
  lineItemLineId?: ModelIDInput | null;
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

export type UpdateLineItemInput = {
  id: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
  subcategory?: string | null;
  quantity?: number | null;
  value?: number | null;
  probateRecordItemsId?: string | null;
  lineItemLineId?: string | null;
};

export type DeleteLineItemInput = {
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

export type CreateDocumentInput = {
  id?: string | null;
};

export type ModelDocumentConditionInput = {
  and?: Array<ModelDocumentConditionInput | null> | null;
  or?: Array<ModelDocumentConditionInput | null> | null;
  not?: ModelDocumentConditionInput | null;
};

export type UpdateDocumentInput = {
  id: string;
};

export type DeleteDocumentInput = {
  id: string;
};

export type CreateLineInput = {
  id?: string | null;
  text: string;
  lineBoundingBoxId: string;
};

export type ModelLineConditionInput = {
  text?: ModelStringInput | null;
  and?: Array<ModelLineConditionInput | null> | null;
  or?: Array<ModelLineConditionInput | null> | null;
  not?: ModelLineConditionInput | null;
  lineBoundingBoxId?: ModelIDInput | null;
};

export type UpdateLineInput = {
  id: string;
  text?: string | null;
  lineBoundingBoxId?: string | null;
};

export type DeleteLineInput = {
  id: string;
};

export type CreateWordInput = {
  id?: string | null;
  text: string;
  lineWordsId: string;
  wordBoundingBoxId: string;
};

export type ModelWordConditionInput = {
  text?: ModelStringInput | null;
  and?: Array<ModelWordConditionInput | null> | null;
  or?: Array<ModelWordConditionInput | null> | null;
  not?: ModelWordConditionInput | null;
  lineWordsId?: ModelIDInput | null;
  wordBoundingBoxId?: ModelIDInput | null;
};

export type UpdateWordInput = {
  id: string;
  text?: string | null;
  lineWordsId?: string | null;
  wordBoundingBoxId?: string | null;
};

export type DeleteWordInput = {
  id: string;
};

export type ModelProbateRecordFilterInput = {
  id?: ModelIDInput | null;
  title?: ModelStringInput | null;
  appraiser?: ModelStringInput | null;
  witness?: ModelStringInput | null;
  totalValue?: ModelFloatInput | null;
  and?: Array<ModelProbateRecordFilterInput | null> | null;
  or?: Array<ModelProbateRecordFilterInput | null> | null;
  not?: ModelProbateRecordFilterInput | null;
  probateRecordDeceasedId?: ModelIDInput | null;
  probateRecordFilingId?: ModelIDInput | null;
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
  filingProbateId?: ModelIDInput | null;
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
  probateRecordItemsId?: ModelIDInput | null;
  lineItemLineId?: ModelIDInput | null;
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
};

export type ModelLineFilterInput = {
  id?: ModelIDInput | null;
  text?: ModelStringInput | null;
  and?: Array<ModelLineFilterInput | null> | null;
  or?: Array<ModelLineFilterInput | null> | null;
  not?: ModelLineFilterInput | null;
  lineBoundingBoxId?: ModelIDInput | null;
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
  lineWordsId?: ModelIDInput | null;
  wordBoundingBoxId?: ModelIDInput | null;
};

export type CreateProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type UpdateProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type DeleteProbateRecordMutation = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type CreateFilingMutation = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
};

export type UpdateFilingMutation = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
};

export type DeleteFilingMutation = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
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

export type CreateLineItemMutation = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
};

export type UpdateLineItemMutation = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
};

export type DeleteLineItemMutation = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
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

export type CreateDocumentMutation = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type UpdateDocumentMutation = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type DeleteDocumentMutation = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type CreateLineMutation = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
};

export type UpdateLineMutation = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
};

export type DeleteLineMutation = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
};

export type GetProbateRecordQuery = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type ListProbateRecordsQuery = {
  __typename: "ModelProbateRecordConnection";
  items: Array<{
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
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
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
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
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
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

export type GetLineItemQuery = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
};

export type ListLineItemsQuery = {
  __typename: "ModelLineItemConnection";
  items: Array<{
    __typename: "LineItem";
    id: string;
    title: string;
    description: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    category: string;
    subcategory: string;
    quantity: number;
    value: number;
    line: {
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordItemsId: string;
    lineItemLineId: string;
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

export type GetDocumentQuery = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type ListDocumentsQuery = {
  __typename: "ModelDocumentConnection";
  items: Array<{
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type GetLineQuery = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
};

export type ListLinesQuery = {
  __typename: "ModelLineConnection";
  items: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
};

export type ListWordsQuery = {
  __typename: "ModelWordConnection";
  items: Array<{
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
    lineWordsId: string;
    wordBoundingBoxId: string;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type OnUpdateProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type OnDeleteProbateRecordSubscription = {
  __typename: "ProbateRecord";
  id: string;
  title: string;
  deceased: {
    __typename: "Deceased";
    id: string;
    name: string;
    gender: string;
    createdAt: string;
    updatedAt: string;
  };
  filing: {
    __typename: "Filing";
    id: string;
    state: string;
    county: string;
    date: string;
    filer: string;
    probate: {
      __typename: "ProbateRecord";
      id: string;
      title: string;
      appraiser: Array<string | null>;
      witness: Array<string | null>;
      totalValue: number;
      createdAt: string;
      updatedAt: string;
      probateRecordDeceasedId: string;
      probateRecordFilingId: string;
    };
    createdAt: string;
    updatedAt: string;
    filingProbateId: string;
  };
  appraiser: Array<string | null>;
  witness: Array<string | null>;
  items?: {
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
      probateRecordItemsId: string;
      lineItemLineId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
  totalValue: number;
  document: {
    __typename: "Document";
    id: string;
    lines: Array<{
      __typename: "Line";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineBoundingBoxId: string;
    } | null>;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordDeceasedId: string;
  probateRecordFilingId: string;
};

export type OnCreateFilingSubscription = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
};

export type OnUpdateFilingSubscription = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
};

export type OnDeleteFilingSubscription = {
  __typename: "Filing";
  id: string;
  state: string;
  county: string;
  date: string;
  filer: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  createdAt: string;
  updatedAt: string;
  filingProbateId: string;
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

export type OnCreateLineItemSubscription = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
};

export type OnUpdateLineItemSubscription = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
};

export type OnDeleteLineItemSubscription = {
  __typename: "LineItem";
  id: string;
  title: string;
  description: string;
  probate: {
    __typename: "ProbateRecord";
    id: string;
    title: string;
    deceased: {
      __typename: "Deceased";
      id: string;
      name: string;
      gender: string;
      createdAt: string;
      updatedAt: string;
    };
    filing: {
      __typename: "Filing";
      id: string;
      state: string;
      county: string;
      date: string;
      filer: string;
      createdAt: string;
      updatedAt: string;
      filingProbateId: string;
    };
    appraiser: Array<string | null>;
    witness: Array<string | null>;
    items?: {
      __typename: "ModelLineItemConnection";
      nextToken?: string | null;
    } | null;
    totalValue: number;
    document: {
      __typename: "Document";
      id: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    probateRecordDeceasedId: string;
    probateRecordFilingId: string;
  };
  category: string;
  subcategory: string;
  quantity: number;
  value: number;
  line: {
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  };
  createdAt: string;
  updatedAt: string;
  probateRecordItemsId: string;
  lineItemLineId: string;
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

export type OnCreateDocumentSubscription = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateDocumentSubscription = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteDocumentSubscription = {
  __typename: "Document";
  id: string;
  lines: Array<{
    __typename: "Line";
    id: string;
    text: string;
    words?: {
      __typename: "ModelWordConnection";
      nextToken?: string | null;
    } | null;
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
    lineBoundingBoxId: string;
  } | null>;
  createdAt: string;
  updatedAt: string;
};

export type OnCreateLineSubscription = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
};

export type OnUpdateLineSubscription = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
};

export type OnDeleteLineSubscription = {
  __typename: "Line";
  id: string;
  text: string;
  words?: {
    __typename: "ModelWordConnection";
    items: Array<{
      __typename: "Word";
      id: string;
      text: string;
      createdAt: string;
      updatedAt: string;
      lineWordsId: string;
      wordBoundingBoxId: string;
    } | null>;
    nextToken?: string | null;
  } | null;
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
  lineBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
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
  lineWordsId: string;
  wordBoundingBoxId: string;
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
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
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
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
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
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
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
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
  async GetLineItem(id: string): Promise<GetLineItemQuery> {
    const statement = `query GetLineItem($id: ID!) {
        getLineItem(id: $id) {
          __typename
          id
          title
          description
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
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
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            category
            subcategory
            quantity
            value
            line {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
            probateRecordItemsId
            lineItemLineId
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
  async GetDocument(id: string): Promise<GetDocumentQuery> {
    const statement = `query GetDocument($id: ID!) {
        getDocument(id: $id) {
          __typename
          id
          lines {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
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
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
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
            lineWordsId
            wordBoundingBoxId
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
          deceased {
            __typename
            id
            name
            gender
            createdAt
            updatedAt
          }
          filing {
            __typename
            id
            state
            county
            date
            filer
            probate {
              __typename
              id
              title
              appraiser
              witness
              totalValue
              createdAt
              updatedAt
              probateRecordDeceasedId
              probateRecordFilingId
            }
            createdAt
            updatedAt
            filingProbateId
          }
          appraiser
          witness
          items {
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
              probateRecordItemsId
              lineItemLineId
            }
            nextToken
          }
          totalValue
          document {
            __typename
            id
            lines {
              __typename
              id
              text
              createdAt
              updatedAt
              lineBoundingBoxId
            }
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
          probateRecordDeceasedId
          probateRecordFilingId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          createdAt
          updatedAt
          filingProbateId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
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
          probate {
            __typename
            id
            title
            deceased {
              __typename
              id
              name
              gender
              createdAt
              updatedAt
            }
            filing {
              __typename
              id
              state
              county
              date
              filer
              createdAt
              updatedAt
              filingProbateId
            }
            appraiser
            witness
            items {
              __typename
              nextToken
            }
            totalValue
            document {
              __typename
              id
              createdAt
              updatedAt
            }
            createdAt
            updatedAt
            probateRecordDeceasedId
            probateRecordFilingId
          }
          category
          subcategory
          quantity
          value
          line {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
          createdAt
          updatedAt
          probateRecordItemsId
          lineItemLineId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLineItem">>
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
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
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
          lines {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
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
          lines {
            __typename
            id
            text
            words {
              __typename
              nextToken
            }
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
            lineBoundingBoxId
          }
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
          text
          words {
            __typename
            items {
              __typename
              id
              text
              createdAt
              updatedAt
              lineWordsId
              wordBoundingBoxId
            }
            nextToken
          }
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
          lineBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
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
          lineWordsId
          wordBoundingBoxId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteWord">>
  >;
}
