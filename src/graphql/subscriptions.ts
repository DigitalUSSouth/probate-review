/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProbateRecord = /* GraphQL */ `
  subscription OnCreateProbateRecord {
    onCreateProbateRecord {
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
export const onUpdateProbateRecord = /* GraphQL */ `
  subscription OnUpdateProbateRecord {
    onUpdateProbateRecord {
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
export const onDeleteProbateRecord = /* GraphQL */ `
  subscription OnDeleteProbateRecord {
    onDeleteProbateRecord {
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
export const onCreateFiling = /* GraphQL */ `
  subscription OnCreateFiling {
    onCreateFiling {
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
export const onUpdateFiling = /* GraphQL */ `
  subscription OnUpdateFiling {
    onUpdateFiling {
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
export const onDeleteFiling = /* GraphQL */ `
  subscription OnDeleteFiling {
    onDeleteFiling {
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
export const onCreateDeceased = /* GraphQL */ `
  subscription OnCreateDeceased {
    onCreateDeceased {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDeceased = /* GraphQL */ `
  subscription OnUpdateDeceased {
    onUpdateDeceased {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDeceased = /* GraphQL */ `
  subscription OnDeleteDeceased {
    onDeleteDeceased {
      id
      name
      gender
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRect = /* GraphQL */ `
  subscription OnCreateRect {
    onCreateRect {
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
export const onUpdateRect = /* GraphQL */ `
  subscription OnUpdateRect {
    onUpdateRect {
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
export const onDeleteRect = /* GraphQL */ `
  subscription OnDeleteRect {
    onDeleteRect {
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
export const onCreateLineItem = /* GraphQL */ `
  subscription OnCreateLineItem {
    onCreateLineItem {
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
export const onUpdateLineItem = /* GraphQL */ `
  subscription OnUpdateLineItem {
    onUpdateLineItem {
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
export const onDeleteLineItem = /* GraphQL */ `
  subscription OnDeleteLineItem {
    onDeleteLineItem {
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
export const onCreateDocument = /* GraphQL */ `
  subscription OnCreateDocument {
    onCreateDocument {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateDocument = /* GraphQL */ `
  subscription OnUpdateDocument {
    onUpdateDocument {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteDocument = /* GraphQL */ `
  subscription OnDeleteDocument {
    onDeleteDocument {
      id
      lineIds
      createdAt
      updatedAt
    }
  }
`;
export const onCreateLine = /* GraphQL */ `
  subscription OnCreateLine {
    onCreateLine {
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
export const onUpdateLine = /* GraphQL */ `
  subscription OnUpdateLine {
    onUpdateLine {
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
export const onDeleteLine = /* GraphQL */ `
  subscription OnDeleteLine {
    onDeleteLine {
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
export const onCreateWord = /* GraphQL */ `
  subscription OnCreateWord {
    onCreateWord {
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
export const onUpdateWord = /* GraphQL */ `
  subscription OnUpdateWord {
    onUpdateWord {
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
export const onDeleteWord = /* GraphQL */ `
  subscription OnDeleteWord {
    onDeleteWord {
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
