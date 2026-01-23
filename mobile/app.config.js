import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      EXPO_PUBLIC_IP: process.env.EXPO_PUBLIC_IP,
      eas: {
        projectId: "dc58b9ec-6bf9-410a-9428-ac56e1b95c4e"
      },
    },
  };
};
