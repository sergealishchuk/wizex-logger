export default async (ms) => {
  await new Promise(resolve => setTimeout(resolve, ms));
};
