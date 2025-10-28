import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      EXPO_PUBLIC_IP: process.env.EXPO_PUBLIC_IP,
      eas: {
        projectId: "a66742f4-89db-4b58-a8af-ac792a364d1c"
      },
    },
  };
};
