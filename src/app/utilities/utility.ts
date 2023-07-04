import { Word } from "../API.service";

export function removeDynamoFields(object: any): any {
  const copy = {...object};
  delete copy['__typename'];
  delete copy['createdAt'];
  delete copy['updatedAt'];

  if('lineItems' in object) {
    // we are updating a Probate Record
    delete copy['lineItems'];
    copy['words'] = (copy['words'] as Word[]).map(w => ({
      id: w.id,
      text: w.text,
      boundingBox: removeDynamoFields(w.boundingBox),
      lineIndex: w.lineIndex
    }));
  }

  console.log('updated object');
  console.log(copy);
  return copy;
}
