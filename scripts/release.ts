import fs from "fs-extra";
import path from "path";

const consumers = {
  A: {
    app: "consumer-a",
    features: ["feature-login", "feature-dashboard"],
  },
  B: {
    app: "consumer-b",
    features: ["feature-settings"],
  },
  C: {
    app: "consumer-c",
    features: ["feature-login", "feature-settings"],
  },
} as const;

type Consumer = keyof typeof consumers;

const SHARED_PACKAGES = ["shared-ui", "shared-utils"];

const ROOT_FILES = [
  "package.json",
  "pnpm-workspace.yaml",
  "tsconfig.json",
  "turbo.json",
  ".npmrc",
  ".gitignore",
];

async function copyIfExists(
  source: string,
  destination: string,
) {
  const exists = await fs.pathExists(source);

  if (!exists) {
    throw new Error(`Missing: ${source}`);
  }

  await fs.copy(source, destination);
}

async function copyRootFiles(outputDir: string) {
  for (const file of ROOT_FILES) {
    const source = path.join(process.cwd(), file);

    if (await fs.pathExists(source)) {
      await fs.copy(source, path.join(outputDir, file));
    }
  }
}

async function copyConsumerApp(
  appName: string,
  outputDir: string,
) {
  const source = path.join(
    process.cwd(),
    "apps",
    appName,
  );

  const destination = path.join(
    outputDir,
    "apps",
    appName,
  );

  console.log(`Copy app: ${appName}`);

  await copyIfExists(source, destination);
}

async function copyPackages(
  packages: string[],
  outputDir: string,
) {
  for (const pkg of packages) {
    const source = path.join(
      process.cwd(),
      "packages",
      pkg,
    );

    const destination = path.join(
      outputDir,
      "packages",
      pkg,
    );

    console.log(`Copy package: ${pkg}`);

    await copyIfExists(source, destination);
  }
}

async function main() {
  const consumer = process.argv[2] as Consumer;

  if (!consumer || !consumers[consumer]) {
    console.error("Usage: pnpm release A|B|C");
    process.exit(1);
  }

  const config = consumers[consumer];

  const outputDir = path.join(
    process.cwd(),
    "release",
    config.app,
  );

  await fs.emptyDir(outputDir);

  console.log(`Generating ${config.app}`);

  await copyRootFiles(outputDir);

  await copyConsumerApp(
    config.app,
    outputDir,
  );

  await copyPackages(
    SHARED_PACKAGES,
    outputDir,
  );

  await copyPackages(
    [...config.features],
    outputDir,
  );

  console.log(
    `Release generated at ${outputDir}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});