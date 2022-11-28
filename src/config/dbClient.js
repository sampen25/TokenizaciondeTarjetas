import AWS from "aws-sdk";

var region = "us-east-2";

const docClient = new AWS.DynamoDB.DocumentClient({
    region: region
});
export { docClient };