#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createRequire } from 'node:module';

const dependencyRoot = process.argv[2];
const siteRoot = process.argv[3];
if (!dependencyRoot || !siteRoot) {
  console.error('usage: node html-validate.mjs <dependency-root> <site-root>');
  process.exit(2);
}

const require = createRequire(`${dependencyRoot}/`);
const { HtmlValidate } = require('html-validate');
const validator = new HtmlValidate();
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.isFile() && path.endsWith('.html')) files.push(path);
  }
}
walk(siteRoot);

const problems = [];
for (const file of files) {
  const report = await validator.validateString(readFileSync(file, 'utf8'), {
    extends: ['html-validate:recommended'],
    rules: {
      'attr-quotes': 'off',
      'doctype-style': 'off',
      'element-required-content': 'off',
      'no-inline-style': 'off',
      'no-trailing-whitespace': 'off',
      'no-raw-characters': 'off',
      'prefer-native-element': 'off',
      'script-type': 'off',
      'valid-id': 'off',
    },
  });
  for (const result of report.results) {
    for (const message of result.messages) {
      problems.push(`${relative(siteRoot, file)}:${message.line}:${message.column}: ${message.message} (${message.ruleId})`);
    }
  }
}

if (problems.length) {
  console.error(`HTML validation failed (${problems.length}):`);
  for (const problem of problems.slice(0, 100)) console.error(`- ${problem}`);
  if (problems.length > 100) console.error(`- ...and ${problems.length - 100} more`);
  process.exit(1);
}

console.log(`HTML validation passed: ${files.length} HTML files`);
