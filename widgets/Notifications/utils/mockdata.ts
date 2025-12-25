export const mockNotifications = [
  {
    id: 1,
    title: "Low calories",
    description: "You need to eat something!",
    createdAt: new Date(new Date().getTime() - 5 * 60 * 1000),
  },
  {
    id: 2,
    title: "Workout completed",
    description: "Congrats on finishing your session!",
    createdAt: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: "New recipe available",
    description: "Check out our new healthy recipe.",
    createdAt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    title: "Weekly challenge",
    description: "You completed 5 workouts this week!",
    createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: "Monthly summary",
    description: "Here is your monthly performance summary.",
    createdAt: new Date(new Date().getTime() - 20 * 24 * 60 * 60 * 1000),
  },
  {
    id: 6,
    title: "Welcome back",
    description: "It's been a while! Start tracking again.",
    createdAt: new Date(new Date().getTime() - 40 * 24 * 60 * 60 * 1000),
  },
];
