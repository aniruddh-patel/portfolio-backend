const AWS = require('aws-sdk');
require('dotenv').config();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE;

module.exports.submitContactForm = async (event) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Item: {
      email: data.email,
      name: data.name,
      subject: data.subject,
      message: data.message,
      submittedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
        "Access-Control-Allow-Methods": "POST" // Allow only GET request 
      },
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*", // Allow from anywhere 
        "Access-Control-Allow-Methods": "POST" // Allow only GET request 
      },
      body: JSON.stringify({ error: 'Could not submit form' }),
    };
  }
};
