const AWS = require('aws-sdk');
require('dotenv').config();

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const tableName = process.env.DYNAMODB_TABLE;
const snsTopicArn = process.env.SNS_TOPIC_ARN;

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
    // Save data to DynamoDB
    await dynamoDb.put(params).promise();

    // Publish message to SNS
    const snsParams = {
      TopicArn: snsTopicArn,
      Message: `New contact form submission:\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`,
      Subject: 'New Contact Form Submission'
    };

    await sns.publish(snsParams).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify({ message: 'Form submitted successfully!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify({ error: 'Could not submit form' }),
    };
  }
};
