module.exports = function(serverless) {
    const stage = serverless.processedInput.options.stage || 'dev';
  
    if (stage === 'prod') {
      serverless.service.provider.environment.SQS_QUEUE_URL = {
        'Fn::GetAtt': ['TaskQueue', 'Arn']
      };
    } else if (stage === 'local') {
      serverless.service.provider.environment.SQS_QUEUE_URL = 'http://localhost:4566/000000000000/your-queue-name';
    } else {
      serverless.service.provider.environment.SQS_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/000000000000/your-dev-queue-name';
    }
  };
  