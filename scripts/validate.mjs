import { lstat, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import Ajv from "ajv";
import { parse } from "yaml";

const schema = JSON.parse(await readFile("schemas/competition.schema.json", "utf8"));
const validator = new Ajv({ allErrors: true, format: "full" });
const validate = validator.compile(schema);
const folders = await readdir("competitions", { withFileTypes: true });
if (folders.length === 0) throw new Error("Add at least one competition.");

for (const folder of folders) {
  const path = join("competitions", folder.name);
  if (!folder.isDirectory()) throw new Error(`${path} must be a directory.`);

  const metadata = parse(await readRegularFile(join(path, "competition.yaml")), { maxAliasCount: 0 });
  if (!validate(metadata)) throw new Error(`${path}: ${validator.errorsText(validate.errors)}`);
  if (metadata.slug !== folder.name) throw new Error(`${path}: slug must match the folder name.`);

  const readme = await readRegularFile(join(path, "README.md"));
  const sections = readme.trim().split(/\r?\n[ \t]*\r?\n/);
  if (!sections[0]?.startsWith("# ") || !sections[1]?.trim() ||
      sections[2]?.trim() !== "## How to start" || !sections[3]?.trim()) {
    throw new Error(`${path}: README needs a title, a summary, and a How to start section.`);
  }

  if (metadata.deadline) {
    const { at, day, time_zone: timeZone } = metadata.deadline;
    const formatter = new Intl.DateTimeFormat("sv-SE", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const deadlineDay = day ?? formatter.format(new Date(at));
    if (metadata.opens_on && metadata.opens_on > deadlineDay) {
      throw new Error(`${path}: opens_on falls after the deadline.`);
    }
  }
}

console.log(`Validated ${folders.length} competitions.`);

async function readRegularFile(path) {
  if (!(await lstat(path)).isFile()) throw new Error(`${path} must be a regular file.`);
  return readFile(path, "utf8");
}
