import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_wEPQ8gI1A',
      userPoolClientId: '7vcf5k48cm83qrmjd4t0rgv3s0',
      signUpVerificationMethod: 'code',
      loginWith: {
        email: true,
        username: false,
      },
    },
  },
});

export default Amplify;






