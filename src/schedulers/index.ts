export const registerAllSchedulers = async () => {
  await Promise.all([
    import("./email.scheduler").then(m => m.registerEmailSchedulers()),
  ]);

  console.log("⏰ All schedulers registered");
};
