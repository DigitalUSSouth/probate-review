/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  let current = new Date();
  let uuid = event["uuid"] ? event["uuid"] : AWS.util.uuid.v4();
  let lines = event["JobStatus"]["Blocks"]
    .filter((l) => l["BlockType"] === "LINE")
    .map((l) => ({
      id: l["Id"],
      text: l["Text"],
      wordIds: l["Relationships"][0]["Ids"],
      boundingBox: {
        height: l["Geometry"]["BoundingBox"]["Height"],
        width: l["Geometry"]["BoundingBox"]["Width"],
        left: l["Geometry"]["BoundingBox"]["Left"],
        top: l["Geometry"]["BoundingBox"]["Top"],
      },
    }));

  let words = event["JobStatus"]["Blocks"]
    .filter((l) => l["BlockType"] === "WORD")
    .map((w) => ({
      id: w["Id"],
      text: w["Text"],
      boundingBox: {
        height: w["Geometry"]["BoundingBox"]["Height"],
        width: w["Geometry"]["BoundingBox"]["Width"],
        left: w["Geometry"]["BoundingBox"]["Left"],
        top: w["Geometry"]["BoundingBox"]["Top"],
      },
    }));

  let lineItems = lines.map((l) => ({
    id: l.id,
    probateId: uuid,
    title: l.text,
    description: "",
    category: "",
    subcategory: "",
    quantity: 0,
    value: 0.0,
    wordIds: l.wordIds,
    boundingBox: l.boundingBox,
    createdAt: current.toISOString(),
    updatedAt: current.toISOString(),
    _version: 1,
    _lastChangedAt: current.getTime() / 1000,
  }));

  // Insert document, line items and probate record
  try {
    let params = {
      TableName: process.env.DOCUMENT_TABLE,
      Item: {
        id: uuid,
        lines,
        words,
        createdAt: current.toISOString(),
        updatedAt: current.toISOString(),
        _version: 1,
        _lastChangedAt: current.getTime() / 1000,
      },
    };
    await docClient.put(params).promise();

    params = {
      TableName: process.env.PROBATE_RECORD_TABLE,
      Item: {
        id: uuid,
        title: event['fileName'],
        deceasedId: '',
        appraiser: [],
        witness: [],
        totalValue: 0.00,
        reviewCount: 0,
        lines,
        words,
        createdAt: current.toISOString(),
        updatedAt: current.toISOString(),
        _version: 1,
        _lastChangedAt: current.getTime() / 1000,
      },
    };
    await docClient.put(params).promise();

    params = { RequestItems: {} };
    let items = [...lineItems];
    while (items.length > 0) {
      let batch = [];
      for (let i = 0; i < 25 && i < items.length; i++) {
        batch.push(items.shift());
      }
      params["RequestItems"][process.env.PROBATE_LINEITEM_TABLE] = batch.map(
        (l) => ({
          PutRequest: {
            Item: l,
          },
        })
      );
      await docClient.batchWrite(params).promise();
    }

  } catch (err) {
    return err;
  }

  console.log("put items called");
  // Insert Probate Record

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      `Hello from Lambda!  Docid: ${uuid}, line table: ${process.env.PROBATE_LINEITEM_TABLE}, record table: ${process.env.PROBATE_RECORD_TABLE}, Doc Table ${process.env.DOCUMENT_TABLE}, lines: ${lines.length}, words: ${words.length}`
    ),
  };
  return response;
};
