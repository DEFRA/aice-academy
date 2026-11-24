// PostToolUse hook: after Claude edits a file, run the tests related to it.
// If they fail, exit code 2 sends the failure back to Claude to fix straight away.
import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

let raw = ''
for await (const chunk of process.stdin) raw += chunk

let input = {}
try {
  input = JSON.parse(raw)
} catch {
  process.exit(0)
}

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const file = input.tool_input?.file_path
if (!file) process.exit(0)

const rel = path.relative(projectDir, path.resolve(projectDir, file))
if (!rel.startsWith('src')) process.exit(0)

const pkgPath = path.join(projectDir, 'package.json')
if (!existsSync(pkgPath)) process.exit(0)
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const deps = { ...pkg.dependencies, ...pkg.devDependencies }
const runner = deps.vitest ? 'vitest' : deps.jest ? 'jest' : null
if (!runner) process.exit(0)

let command
if (/\.(m?js|cjs|ts)$/.test(rel)) {
  command =
    runner === 'vitest'
      ? `npx vitest related --run "${rel}"`
      : `npx jest --findRelatedTests "${rel}" --passWithNoTests`
} else if (/\.njk$/.test(rel)) {
  // A view changed: run the tests in the same feature folder.
  const testFile = path.join(path.dirname(rel), 'controller.test.js')
  if (!existsSync(path.join(projectDir, testFile))) process.exit(0)
  command = runner === 'vitest' ? `npx vitest run "${testFile}"` : `npx jest "${testFile}"`
} else {
  process.exit(0)
}

try {
  execSync(command, { cwd: projectDir, stdio: 'pipe', timeout: 120000 })
  process.exit(0)
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`
    .trim()
    .split('\n')
    .slice(-40)
    .join('\n')
  console.error(`Tests related to ${rel} are failing. Fix this before moving on.\n\n${output}`)
  process.exit(2)
}
