/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProbateRecord = /* GraphQL */ `
  mutation CreateProbateRecord(
    $input: CreateProbateRecordInput!
    $condition: ModelProbateRecordConditionInput
  ) {
    createProbateRecord(input: $input, condition: $condition) {
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
export const updateProbateRecord = /* GraphQL */ `
  mutation UpdateProbateRecord(
    $input: UpdateProbateRecordInput!
    $condition: ModelProbateRecordConditionInput
  ) {
    updateProbateRecord(input: $input, condition: $condition) {
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
export const deleteProbateRecord = /* GraphQL */ `
  mutation DeleteProbateRecord(
    $input: DeleteProbateRecordInput!
    $condition: ModelProbateRecordConditionInput
  ) {
    deleteProbateRecord(input: $input, condition: $condition) {
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
export const createFiling = /* GraphQL */ `
  mutation CreateFiling(
    $input: CreateFilingInput!
    $condition: ModelFilingConditionInput
  ) {
    createFiling(input: $input, condition: $condition) {
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
export const updateFiling = /* GraphQL */ `
  mutation UpdateFiling(
    $input: UpdateFilingInput!
    $condition: ModelFilingConditionInput
  ) {
    updateFiling(input: $input, condition: $condition) {
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
export const deleteFiling = /* GraphQL */ `
  mutation DeleteFiling(
    $input: DeleteFilingInput!
    $condition: ModelFilingConditionInput
  ) {
    deleteFiling(input: $input, condition: $condition) {
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
export const createDeceased = /* GraphQL */ `
  mutation CreateDeceased(
    $input: CreateDeceasedInput!
    $condition: ModelDeceasedConditionInput
  ) {
    createDeceased(input: $input, condition: $condition) {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const updateDeceased = /* GraphQL */ `
  mutation UpdateDeceased(
    $input: UpdateDeceasedInput!
    $condition: ModelDeceasedConditionInput
  ) {
    updateDeceased(input: $input, condition: $condition) {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const deleteDeceased = /* GraphQL */ `
  mutation DeleteDeceased(
    $input: DeleteDeceasedInput!
    $condition: ModelDeceasedConditionInput
  ) {
    deleteDeceased(input: $input, condition: $condition) {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const createRect = /* GraphQL */ `
  mutation CreateRect(
    $input: CreateRectInput!
    $condition: ModelRectConditionInput
  ) {
    createRect(input: $input, condition: $condition) {
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
export const updateRect = /* GraphQL */ `
  mutation UpdateRect(
    $input: UpdateRectInput!
    $condition: ModelRectConditionInput
  ) {
    updateRect(input: $input, condition: $condition) {
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
export const deleteRect = /* GraphQL */ `
  mutation DeleteRect(
    $input: DeleteRectInput!
    $condition: ModelRectConditionInput
  ) {
    deleteRect(input: $input, condition: $condition) {
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
export const createLineItem = /* GraphQL */ `
  mutation CreateLineItem(
    $input: CreateLineItemInput!
    $condition: ModelLineItemConditionInput
  ) {
    createLineItem(input: $input, condition: $condition) {
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
export const updateLineItem = /* GraphQL */ `
  mutation UpdateLineItem(
    $input: UpdateLineItemInput!
    $condition: ModelLineItemConditionInput
  ) {
    updateLineItem(input: $input, condition: $condition) {
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
export const deleteLineItem = /* GraphQL */ `
  mutation DeleteLineItem(
    $input: DeleteLineItemInput!
    $condition: ModelLineItemConditionInput
  ) {
    deleteLineItem(input: $input, condition: $condition) {
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
export const createDocument = /* GraphQL */ `
  mutation CreateDocument(
    $input: CreateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    createDocument(input: $input, condition: $condition) {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const updateDocument = /* GraphQL */ `
  mutation UpdateDocument(
    $input: UpdateDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    updateDocument(input: $input, condition: $condition) {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const deleteDocument = /* GraphQL */ `
  mutation DeleteDocument(
    $input: DeleteDocumentInput!
    $condition: ModelDocumentConditionInput
  ) {
    deleteDocument(input: $input, condition: $condition) {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const createLine = /* GraphQL */ `
  mutation CreateLine(
    $input: CreateLineInput!
    $condition: ModelLineConditionInput
  ) {
    createLine(input: $input, condition: $condition) {
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
export const updateLine = /* GraphQL */ `
  mutation UpdateLine(
    $input: UpdateLineInput!
    $condition: ModelLineConditionInput
  ) {
    updateLine(input: $input, condition: $condition) {
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
export const deleteLine = /* GraphQL */ `
  mutation DeleteLine(
    $input: DeleteLineInput!
    $condition: ModelLineConditionInput
  ) {
    deleteLine(input: $input, condition: $condition) {
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
export const createWord = /* GraphQL */ `
  mutation CreateWord(
    $input: CreateWordInput!
    $condition: ModelWordConditionInput
  ) {
    createWord(input: $input, condition: $condition) {
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
export const updateWord = /* GraphQL */ `
  mutation UpdateWord(
    $input: UpdateWordInput!
    $condition: ModelWordConditionInput
  ) {
    updateWord(input: $input, condition: $condition) {
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
export const deleteWord = /* GraphQL */ `
  mutation DeleteWord(
    $input: DeleteWordInput!
    $condition: ModelWordConditionInput
  ) {
    deleteWord(input: $input, condition: $condition) {
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
