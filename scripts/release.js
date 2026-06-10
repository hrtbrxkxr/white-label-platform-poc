import fs from "fs-extra";

const consumers = {
  A: ["@wl/feature-login", "@wl/feature-dashboard"],
  B: ["@wl/feature-settings"],
  C: ["@wl/feature-login", "@wl/feature-settings"],
};

console.log(consumers);