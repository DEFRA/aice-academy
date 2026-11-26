---
number: 4
slug: start-your-service
title: Start your service
time: About 2 minutes
see: "A tab called Your service, showing a GOV.UK page with the heading Home. That's Defra's starting point for building services, running in your codespace."
stuck:
  - problem: Nothing happened when I pasted
    fix: Select inside the terminal panel first, so it's ready for typing. Then paste again. Your browser may ask permission to paste. Allow it.
  - problem: The Your service tab didn't open
    fix: 'At the bottom of the codespace, select the Ports tab (next to Terminal). Find the row with 3000 in it and select the small globe icon on that row.'
  - problem: It says something about port 3000 already in use
    fix: Your service is already running. Use the Ports tab to open it, as above.
---

## What you're about to do

You'll tell your codespace to start your practice service, so you can see it working.

## Do this

1. Select inside the terminal panel at the bottom of your codespace.
2. Copy this instruction, paste it into the terminal and press **Enter**:

```bash
npm run dev
```

To paste, press **Ctrl** and **V** together (on a Mac, **Cmd** and **V**).

3. Wait about 20 seconds. More text scrolls past, ending with **Server started successfully**.
4. A tab called **Your service** opens inside your codespace.

## Leave it running

This terminal is now busy running your service. Leave it alone. In the next step you'll open a second terminal for Claude.
