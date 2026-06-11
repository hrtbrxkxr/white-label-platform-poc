import fs from "fs-extra";
import path from "path";

const consumers = {
  A: ["feature-login", "feature-dashboard"],
  B: ["feature-settings"],
  C: ["feature-login", "feature-settings"],
} as const;

type Consumer = keyof typeof consumers;

async function copyRootFiles(outputDir: string) {
  const rootFiles = [
    "package.json",
    "pnpm-workspace.yaml",
    "tsconfig.json",
    ".gitignore",
  ];

  for (const file of rootFiles) {
    const source = path.join(process.cwd(), file);

    if (await fs.pathExists(source)) {
      await fs.copy(source, path.join(outputDir, file));
    }
  }
}

async function copyConsumerApp(consumer: Consumer, outputDir: string) {
  const appName = `consumer-${consumer.toLowerCase()}`;

  const source = path.join(process.cwd(), "apps", appName);

  const destination = path.join(outputDir, "apps", appName);

  await fs.copy(source, destination);
}

async function copySharedPackages(outputDir: string) {
  const sharedPackages = ["shared-ui", "shared-utils"];

  for (const pkg of sharedPackages) {
    await fs.copy(
      path.join(process.cwd(), "packages", pkg),
      path.join(outputDir, "packages", pkg),
    );
  }
}

async function copyFeatures(consumer: Consumer, outputDir: string) {
  for (const feature of consumers[consumer]) {
    await fs.copy(
      path.join(process.cwd(), "packages", feature),
      path.join(outputDir, "packages", feature),
    );
  }
}

async function main() {
  const consumer = process.argv[2] as Consumer;

  if (!consumer || !consumers[consumer]) {
    console.error("Usage: pnpm release A|B|C");
    process.exit(1);
  }

  const outputDir = path.join(
    process.cwd(),
    "release",
    `consumer-${consumer.toLowerCase()}`,
  );

  await fs.emptyDir(outputDir);

  await copyRootFiles(outputDir);

  await copyConsumerApp(consumer, outputDir);

  await copySharedPackages(outputDir);

  await copyFeatures(consumer, outputDir);

  console.log(`Release generated: consumer-${consumer.toLowerCase()}`);
}

main().catch(console.error);
