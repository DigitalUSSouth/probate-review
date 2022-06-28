// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { ProbateRecord, LineItem, Rect, Filing, Deceased, Document, Line, Word } = initSchema(schema);

export {
  ProbateRecord,
  LineItem,
  Rect,
  Filing,
  Deceased,
  Document,
  Line,
  Word
};