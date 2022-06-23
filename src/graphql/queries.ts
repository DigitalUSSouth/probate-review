/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProbateRecord = /* GraphQL */ `
  query GetProbateRecord($id: ID!) {
    getProbateRecord(id: $id) {
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
  }
`;
export const listProbateRecords = /* GraphQL */ `
  query ListProbateRecords(
    $filter: ModelProbateRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProbateRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
  }
`;
export const getFiling = /* GraphQL */ `
  query GetFiling($id: ID!) {
    getFiling(id: $id) {
      id
      state
      county
      date
      filer
      createdAt
      updatedAt
    }
  }
`;
export const listFilings = /* GraphQL */ `
  query ListFilings(
    $filter: ModelFilingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFilings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
  }
`;
export const getDeceased = /* GraphQL */ `
  query GetDeceased($id: ID!) {
    getDeceased(id: $id) {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const listDeceaseds = /* GraphQL */ `
  query ListDeceaseds(
    $filter: ModelDeceasedFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDeceaseds(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        gender
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRect = /* GraphQL */ `
  query GetRect($id: ID!) {
    getRect(id: $id) {
      id
      left
      top
      width
      height
      createdAt
      updatedAt
    }
  }
`;
export const listRects = /* GraphQL */ `
  query ListRects(
    $filter: ModelRectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
  }
`;
export const getLineItem = /* GraphQL */ `
  query GetLineItem($id: ID!) {
    getLineItem(id: $id) {
      id
      title
      description
      category
      subcategory
      quantity
      value
      boundingBox {
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
  }
`;
export const listLineItems = /* GraphQL */ `
  query ListLineItems(
    $filter: ModelLineItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLineItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
  }
`;
export const getDocument = /* GraphQL */ `
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const listDocuments = /* GraphQL */ `
  query ListDocuments(
    $filter: ModelDocumentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        lineIds
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getLine = /* GraphQL */ `
  query GetLine($id: ID!) {
    getLine(id: $id) {
      id
      wordIds
      boundingBox {
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
  }
`;
export const listLines = /* GraphQL */ `
  query ListLines(
    $filter: ModelLineFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLines(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        wordIds
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getWord = /* GraphQL */ `
  query GetWord($id: ID!) {
    getWord(id: $id) {
      id
      text
      boundingBox {
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
  }
`;
export const listWords = /* GraphQL */ `
  query ListWords(
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
