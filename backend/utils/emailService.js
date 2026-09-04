const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  // In production, IAM roles on the EC2 instance should provide credentials automatically.
  // Locally, you can use AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env
});

const sendEmail = async (to, subject, html) => {
  try {
    const payload = {
      to,
      subject,
      html
    };

    const command = new InvokeCommand({
      FunctionName: process.env.LAMBDA_EMAIL_FUNCTION_NAME || 'quickspace-email-sender',
      Payload: Buffer.from(JSON.stringify(payload)),
      InvocationType: 'RequestResponse'
    });

    const response = await lambdaClient.send(command);
    
    const result = JSON.parse(Buffer.from(response.Payload).toString());
    
    if (result.success) {
      console.log("✅ Email sent successfully via AWS Lambda");
      return true;
    } else {
      console.error("❌ Lambda returned an error: ", result.error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error invoking Lambda email function: ", error);
    return false;
  }
};

module.exports = {
  sendEmail
};
