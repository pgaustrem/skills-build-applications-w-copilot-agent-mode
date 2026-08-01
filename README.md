# Build Applications with GitHub Copilot Agent Mode

<img src="https://octodex.github.com/images/Professortocat_v2.png" align="right" height="200px" />

Hey pgaustrem!

Mona here. I'm done preparing your exercise. Hope you enjoy! 💚

Remember, it's self-paced so feel free to take a break! ☕️

[![](https://img.shields.io/badge/Go%20to%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/pgaustrem/skills-build-applications-w-copilot-agent-mode/issues/1)

## OctoFit Tracker frontend environment setup

The React presentation tier uses the Vite environment variable `VITE_CODESPACE_NAME` to build a Codespaces-safe API base URL.

- When `VITE_CODESPACE_NAME` is defined, the frontend targets:
  `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/...`
- When it is not defined, the frontend falls back to:
  `http://localhost:8000/api/...`

For a Codespaces session, define the variable in the local frontend environment file, for example:

```env
VITE_CODESPACE_NAME=<your-codespace-name>
```

This value should live in `.env.local` for local Vite development and should not be committed to version control.

