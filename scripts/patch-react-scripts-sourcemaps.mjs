import fs from "fs";
import path from "path";

const webpackConfigPath = path.join(
  process.cwd(),
  "node_modules/react-scripts/config/webpack.config.js"
);

if (!fs.existsSync(webpackConfigPath)) {
  process.exit(0);
}

const source = fs.readFileSync(webpackConfigPath, "utf8");
const original = "exclude: /@babel(?:\\/|\\\\{1,2})runtime/,";
const replacement =
  "exclude: /@babel(?:\\/|\\\\{1,2})runtime|leaflet|react-leaflet/,";

if (source.includes(replacement)) {
  process.exit(0);
}

if (!source.includes(original)) {
  throw new Error(
    "Could not find the react-scripts source-map-loader rule to patch"
  );
}

fs.writeFileSync(
  webpackConfigPath,
  source.replace(original, replacement),
  "utf8"
);
