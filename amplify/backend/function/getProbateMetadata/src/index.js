const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const METADATABUCKET = 'probate-metadata';
const client = new S3Client({ region: "us-east-1" });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    const METADATABUCKET = 'probate-metadata';
    const PATH = '/record/';
    const key = event.path.substring(PATH.length) + '.json';
    console.log('key is ' + key);
    
    // https://github.com/aws/aws-sdk-js-v3/issues/1877
    const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

    const command = new GetObjectCommand({Bucket: METADATABUCKET, Key: key, ResponseContentType: 'application/json'});
    const { Body } = await client.send(command);
    const bodyContents = await streamToString(Body);
    console.log(bodyContents);
    
    return {
        statusCode: 200,
    //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }, 
        body: bodyContents,
    };
};
