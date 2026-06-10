const consumers = {
  A: [
    "@wl/feature-login",
    "@wl/feature-dashboard",
  ],

  B: [
    "@wl/feature-settings",
  ],

  C: [
    "@wl/feature-login",
    "@wl/feature-settings",
  ],
};

const consumer = process.argv[2];