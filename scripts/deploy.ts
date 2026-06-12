import { execSync } from "child_process";

execSync(`
git clone https://github.com/hrtbrxkxr/consumer-a.git tmp
`, {
  stdio: "inherit",
});

execSync(`
rsync -av --delete release/consumer-a/ tmp/
`, {
  stdio: "inherit",
});

execSync(`
cd tmp &&
git add . &&
git commit -m "Release" &&
git push
`, {
  stdio: "inherit",
});