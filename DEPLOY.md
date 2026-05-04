# Deploy runbook — cc (code-crispies)

Derived from [`netcup/DEPLOY-TEMPLATE.md`](https://git.librete.ch/libretech/netcup/src/branch/main/DEPLOY-TEMPLATE.md).
Section ordering and headings stable across stacks.

## 1. Target

| Field | Value |
|-------|-------|
| Vhost | `cc.cloud.librete.ch` |
| Server path | `/srv/cc/` |
| Repo | `git.librete.ch/public/code-crispies` |
| Image source | build from source on remote (Dockerfile) — image tag `${CC_IMAGE:-cc:local}` |
| Cert | edge caddy via INWX DNS-01 |
| Edge net container name | `cc` (matches `caddy/Caddyfile` reverse_proxy target on `:80`) |

## 2. Required env / secrets

`/srv/cc/.env` (gitignored, mode 0600): only set if non-default behavior is needed (e.g. `CC_IMAGE` to use a registry-published tag).

## 3. First-time deploy

```sh
ssh netcup 'docker network ls | grep -q edge || docker network create edge'
ssh netcup 'mkdir -p /srv && cd /srv && git clone ssh://tengo@git.librete.ch:41240/public/code-crispies.git cc'
ssh netcup 'cd /srv/cc && docker compose up -d --build'
```

## 4. Update deploy

```sh
n-deploy cc
# = git push → ssh 'cd /srv/cc && git pull --ff-only && docker compose pull && docker compose up -d'
```

For source rebuilds:

```sh
ssh netcup 'cd /srv/cc && git pull --ff-only && docker compose up -d --build'
```

## 5. Smoke / health

```sh
n-ping cc.cloud.librete.ch
n-cert cc.cloud.librete.ch
n-svcs cc
```

UI smoke: lessons load, interactive Tailwind/CSS sandbox renders.

## 6. Logs + troubleshooting

| Symptom | First check |
|---------|-------------|
| 502 from edge | `cc` not up or off `edge` net |
| Stale assets | rebuild image (`up -d --build`); browser cache |

## 7. Rollback

```sh
ssh netcup 'cd /srv/cc && git log --oneline -n 5'
ssh netcup 'cd /srv/cc && git reset --hard <previous-sha> && docker compose up -d --build'
```

## 8. Stack-specific notes

- Stateless: no persistent volumes worth preserving (content is shipped in the image).
- Pure static / Node-built site; no database.

## 9. Issue tracking

- Deploy issues: `git.librete.ch/public/code-crispies/issues`
- Cross-stack: `libretech/netcup`
- After every deploy: append to `netcup/deployments.md`.
