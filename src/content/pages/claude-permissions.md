Claude always asks before doing anything that changes your work or runs a program. That keeps you in charge. Here's how to decide what to say.

## What it looks like

Claude shows what it wants to do, such as running a command or changing a file, and gives you choices. Use the arrow keys to pick one and press **Enter**.

## Usually safe to allow

- **Running tests,** such as `npm test`. Tests only check things, they don't change anything.
- **Reading files.** Claude needs to look at the code to help.
- **Creating or changing files in your practice service.** That's how the team builds. You can always go back to a saved checkpoint.
- **Installing the service's building blocks,** such as `npm install`.
- **Saving a checkpoint,** such as `git commit`.

## Stop and ask first

Say no, then ask "Why do you need to do that?" if Claude wants to:

- delete lots of files
- install something new it hasn't explained
- share or send your work anywhere outside your codespace
- touch passwords, keys or files called `.env`

The team's automatic checks block passwords and secrets files anyway, but it's good to know.

## Allow it every time

Some choices say something like "Yes, and don't ask again" for that kind of action. That's fine for running tests. For anything else, it's fine to keep saying yes each time while you're learning.

## If you said the wrong thing

Don't worry. Tell Claude what happened, for example "I said no by mistake, please try again." If something changed that you didn't want, ask "Undo that change."
