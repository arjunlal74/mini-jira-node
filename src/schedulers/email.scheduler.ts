import SendReminderJob from "../jobs/TestJob";

export const registerEmailSchedulers = async () => {
  await SendReminderJob.dispatch(
    { userId: 1 },
    {
      repeat: { cron: "0 9 * * *" }, // daily 9 AM
    }
  );

  console.log("📧 Email schedulers registered");
};
