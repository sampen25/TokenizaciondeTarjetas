import AWS from "aws-sdk";

var region = "us-east-2";
//var accessKeyId = "AKIA5JG45MMHJW2ONSKR"; //dotenv.AWS_ACCESS_KEY_ID;
//var secretAccessKey = "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"; //dotenv.AWS_SECRET_ACCESS_KEY;

const docClient = new AWS.DynamoDB.DocumentClient({
    region: region
    //accessKeyId: accessKeyId,
    //secretAccessKey: secretAccessKey,
});
export { docClient };