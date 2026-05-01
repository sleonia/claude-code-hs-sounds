#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

/**
 * Build script for creating distributable plugin packages
 *
 * Usage: node scripts/build.mjs [agent]
 *
 * Args:
 *   agent - Agent name to build (default: 'all', or specify 'claude' or 'opencode')
 */
async function build(agent) {
  if (!agent || agent === "all") {
    console.log("Building all packages...");
    await build("claude");
    await build("opencode");
    return;
  }

  console.log(`Building agent package for: ${agent}`);

  const distDir = path.join(projectRoot, "dist", agent);
  const agentSrcDir = path.join(projectRoot, "src", agent);
  const sharedSrcDir = path.join(projectRoot, "src", "shared", "src");
  const soundpackDir = path.join(projectRoot, "soundpack");
  const metaFile = path.join(projectRoot, "meta.json");

  // Verify source directories and files exist
  const requiredPaths = [
    { path: agentSrcDir, type: "dir", name: "Agent source directory" },
    { path: sharedSrcDir, type: "dir", name: "Shared source directory" },
    { path: soundpackDir, type: "dir", name: "Soundpack directory" },
    { path: metaFile, type: "file", name: "Meta file" },
  ];

  for (const { path: p, type, name } of requiredPaths) {
    const exists =
      type === "dir"
        ? fs.existsSync(p) && fs.statSync(p).isDirectory()
        : fs.existsSync(p);
    if (!exists) {
      console.error(`Error: ${name} not found at ${p}`);
      process.exit(1);
    }
  }

  try {
    // 1. Create dist/<agent>/ directory
    console.log(`Creating directory: ${distDir}`);
    fs.mkdirSync(distDir, { recursive: true });

    // 2. Copy src/<agent>/ → dist/<agent>/ (recursive)
    console.log(`Copying agent source: ${agentSrcDir} → ${distDir}`);
    fs.cpSync(agentSrcDir, distDir, { recursive: true });

    // 3. Copy src/shared/src/ → dist/<agent>/src/shared/ (recursive)
    const sharedDestDir = path.join(distDir, "src", "shared");
    console.log(`Copying shared source: ${sharedSrcDir} → ${sharedDestDir}`);
    fs.mkdirSync(path.join(distDir, "src"), { recursive: true });
    fs.cpSync(sharedSrcDir, sharedDestDir, { recursive: true });

    // 4. Copy soundpack/ → dist/<agent>/soundpack/ (recursive)
    const soundpackDestDir = path.join(distDir, "soundpack");
    console.log(`Copying soundpack: ${soundpackDir} → ${soundpackDestDir}`);
    fs.cpSync(soundpackDir, soundpackDestDir, { recursive: true });

    // 5. Copy meta.json → dist/<agent>/meta.json
    const metaDestFile = path.join(distDir, "meta.json");
    console.log(`Copying meta.json: ${metaFile} → ${metaDestFile}`);
    fs.copyFileSync(metaFile, metaDestFile);

    // 6. Rewrite imports in .mjs files to use "./shared/" instead of "../../shared/src/"
    console.log("Rewriting imports in .mjs files...");
    rewriteImports(distDir, projectRoot);

    console.log(`\nBuild complete! Distribution created at: ${distDir}`);
  } catch (error) {
    console.error(`Error during build: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Rewrite import paths in .mjs files to use correct relative paths
 * @param {string} dir - Directory to scan for .mjs files
 * @param {string} baseDir - Base directory for relative path output
 */
function rewriteImports(dir, baseDir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // Recursively process subdirectories
      rewriteImports(fullPath, baseDir);
    } else if (file.isFile() && file.name.endsWith(".mjs")) {
      // Read the file content
      let content = fs.readFileSync(fullPath, "utf-8");

      // Replace "../../shared/src/" with "./shared/"
      const originalContent = content;
      content = content.replace(/\.\.\/\.\.\/shared\/src\//g, "./shared/");

      // Only write if content changed
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(
          `  Updated imports in: ${path.relative(baseDir, fullPath)}`,
        );
      }
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const agent = args[0] || "claude";

build(agent);
