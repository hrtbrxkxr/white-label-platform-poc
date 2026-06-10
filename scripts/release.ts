import fs from "fs-extra";
import path from "path";

const consumers = {
  A: ["feature-login", "feature-dashboard"],
  B: ["feature-settings"],
  C: ["feature-login", "feature-settings"],
} as const;

type Consumer = keyof typeof consumers;

async function main() {
  const consumer = process.argv[2] as Consumer;

  if (!consumer || !consumers[consumer]) {
    console.error("Usage: pnpm release A|B|C");
    process.exit(1);
  }

  const outputDir = path.join(
    process.cwd(),
    "release",
    `consumer-${consumer.toLowerCase()}`
  );

  await fs.emptyDir(outputDir);

  // copy selected features
  for (const feature of consumers[consumer]) {
    const source = path.join(process.cwd(), "packages", feature);

    const destination = path.join(
      outputDir,
      "packages",
      feature
    );

    console.log(`Copying ${feature}`);

    await fs.copy(source, destination);
  }

  console.log(`Consumer ${consumer} release generated`);
}

main().catch(console.error);