// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ProbateRecord, Document, LineItem, Rect, Word, Filing, Deceased, Line } = initSchema(schema);

export {
  ProbateRecord,
  Document,
  LineItem,
  Rect,
  Word,
  Filing,
  Deceased,
  Line
};