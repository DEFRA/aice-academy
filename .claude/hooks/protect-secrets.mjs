// PreToolUse hook: stops Claude reading or changing secrets files.
// Exit code 2 blocks the tool call and tells Claude why.
let raw = ''
for await (const chunk of process.stdin) raw += chunk

let input = {}
try {
  input = JSON.parse(raw)
} catch {
  process.exit(0)
}

const toolInput = input.tool_input ?? {}
const target = String(toolInput.file_path ?? toolInput.path ?? toolInput.command ?? '')

const secretPatterns = [
  /(^|[/\s'"=<])\.env(\.[\w-]+)?($|[\s'";|&>])/,
  /\.pem($|[\s'";|&>])/,
  /\.key($|[\s'";|&>])/,
  /(^|[/\s'"])secrets?(\.[a-z]+)?($|[/\s'";|&>])/i,
  /id_rsa/
]

const allowed = /\.env\.example($|[\s'";|&>])/

if (!allowed.test(target) && secretPatterns.some((pattern) => pattern.test(target))) {
  console.error(
    'Blocked by the team rules: secrets files are off limits. ' +
      'Secrets live in the CDP Portal, not in the repo. ' +
      'Ask the service owner if you think you need this.'
  )
  process.exit(2)
}

process.exit(0)
