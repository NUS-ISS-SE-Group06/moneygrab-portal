// src/aws-exports.js
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_XI7LG9T1f',
      userPoolClientId: '4lcfgcumiu5derbjmd2fm1io34',
      region: 'ap-southeast-1',
      // Add these if you have identity pool
      // identityPoolId: 'your-identity-pool-id',
      
      // Optional: Add these if needed
      loginWith: {
        oauth: {
          domain: 'ap-southeast-1xi7lg9t1f.auth.ap-southeast-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: ['http://localhost:3000/','https://d1yicjgl958p45.cloudfront.net/'],
          redirectSignOut: ['http://localhost:3000/','https://d1yicjgl958p45.cloudfront.net/'],
          responseType: 'code'
        },
        username: true,
        email: false, // Set to true if you want email login
        phone_number: false // Set to true if you want phone login
      }
    }
  }
};

export default awsConfig;