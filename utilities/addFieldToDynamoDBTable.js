const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region:'us-east-1'
});
const YOUR_TABLE_NAME = 'LineItem-beqt2gcegrb5zgftexccfcexgy-staging';

async function main(event, context) {
    let tableContents;
    try{
        //get items from dynamo
        const params = {
            TableName: `${YOUR_TABLE_NAME}`,
        };
        tableContents = await scanDB(params);
    }catch(err){
        console.log(err);
        return err;
    }
    let calls = [];
    const FIELD_NAME = 'lowerTitle';
    tableContents.forEach(function(value){
        console.log('updating ' + value.id);
        let fieldValue = value['title'].toLowerCase();

        let params = {
            ExpressionAttributeValues: {
                ":lowerTitle": fieldValue,
            },
            Key: {
                "id": value.id
            },
            TableName: `${YOUR_TABLE_NAME}`,
            UpdateExpression: "SET lowerTitle = :lowerTitle",
            };
        calls.push(dynamoDb.update(params).promise());
    });
    let response;
    try{
        response = await Promise.all(calls);
    }catch(err){
        console.log(err);
    }
    return response;
}
async function scanDB(params) {
    let dynamoContents = [];
    let items;
    do{
        items =  await dynamoDb.scan(params).promise();
        items.Items.forEach((item) => dynamoContents.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");
    return dynamoContents;
};
main();