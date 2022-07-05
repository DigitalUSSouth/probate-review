// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ProbateRecord, LineItem, Document, Rect, Word, Filing, Deceased, Line } = initSchema(schema);

export {
  ProbateRecord,
  LineItem,
  Document,
  Rect,
  Word,
  Filing,
  Deceased,
  Line
};