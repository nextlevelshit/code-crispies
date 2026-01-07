Format all lesson JSON files including localized versions.

Run prettier on all lesson files:
```bash
npx prettier --write "lessons/**/*.json"
```

This formats both root lessons (`lessons/*.json`) and localized lessons (`lessons/ar/`, `lessons/de/`, `lessons/es/`, `lessons/pl/`, `lessons/uk/`).
