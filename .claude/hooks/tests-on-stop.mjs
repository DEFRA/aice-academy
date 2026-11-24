// Stop hook: before Claude says it has finished, run the whole test suite
// if any code has changed. If tests fail, exit code 2 keeps Claude working on the fix.
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

// Avoid an endless loop: if we already sent Claude back once, let it stop.
if (input.stop_hook_active) process.exit(0)

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
const pkgPath = path.join(projectDir, 'package.json')
if (!existsSync(pkgPath)) process.exit(0)
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
if (!pkg.scripts?.test) process.exit(0)

// Only run when code or tests have changed since the last commit.
let changed = ''
try {
  changed = execSync('git status --porcelain', { cwd: projectDir, stdio: 'pipe' }).toString()
} catch {
  process.exit(0)
}

const codeChanged = changed
  .split('\n')
  .map((line) => line.slice(3).trim())
  .some((file) => /^(src|test|tests)\//.test(file) || /\.(m?js|njk)$/.test(file))
if (!codeChanged) process.exit(0)

try {
  execSync('npm test --silent', { cwd: projectDir, stdio: 'pipe', timeout: 300000 })
  process.exit(0)
} catch (error) {
  const output = `${error.stdout ?? ''}${error.stderr ?? ''}`
    .trim()
    .split('\n')
    .slice(-60)
    .join('\n')
  console.error(
    `The test suite is failing, so this work isn't finished yet. Fix the failures, then finish.\n\n${output}`
  )
  process.exit(2)
}
