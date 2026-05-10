# Multi-instance deploy plan

Single-VPS deploy currently caps at ~95 rps (measured, keepalive load test PR #162). Fine for normal traffic + light promo. **Not** fine for HN frontpage (200–500 rps spike).

This doc lays out three escalation paths from "fine to ship" to "scales to viral spike," ordered by complexity. Pick when traffic/revenue justifies.

## Current state (single-instance)

```
            DNS (codecrispi.es A+AAAA)
                        ↓
            netcup VPS  (37.120.174.54)
                        ↓
                Caddy   (terminates TLS, routes by host)
                        ↓
                cc      (one nginx container, static files)
                        ↓
              dist/     (~30MB after PNG optimize)
```

Throughput ceiling = single nginx workers + Caddy CPU + VPS network. Tuned, but **vertical** ceiling.

## Path 1: Cloudflare in front of single VPS (cheapest)

**Win:** absorbs ~95% of traffic at the edge. Origin sees ~5% of visitor count for static assets, full traffic only for SPA routes that miss cache.

```
           Cloudflare CDN (free tier, 270 PoPs)
                ↓ (cache hit ~95%)
        netcup VPS  ← origin
```

**Setup:**
1. Add `codecrispi.es` to Cloudflare account
2. Update nameservers at registrar to Cloudflare's
3. Cache rule: cache everything except `/auth/*`, `/api/*`, `/health`
4. Cache rule: HTML respects `Cache-Control: max-age=300` (already set)
5. Origin: keep current netcup IP, Cloudflare proxies

**Dormant prep:** see [`CLOUDFLARE-PREP.md`](./CLOUDFLARE-PREP.md) — full runbook to pre-configure CF in DNS-only mode (gray cloud), so activation is a single per-record toggle when traffic forces it. Zero behavior change until activated.

**Effect:** capacity multiplies ~20x for static (assets, blog OG). HN-frontpage no longer breaks the box.

**Cost:** $0 (free tier). Caveat: Cloudflare sees user IPs + can MITM TLS. Acceptable for an open-source educational site; not for a service handling financial data.

**Risk:** Cloudflare outage = site down. Has happened (2022, ~6 hours). Mitigation: keep DNS TTL short so you can fail back to direct origin in 5 min.

**When to ship:** before any HN/reddit submission, if star count + outreach mode is starting.

## Path 2: Two-instance active-active (medium effort)

**Win:** redundancy + horizontal compute. If one VPS reboots, the other carries traffic.

```
              DNS round-robin or HAProxy
                       ↓
                  ┌────┴────┐
                  ↓         ↓
              VPS A      VPS B
            (primary) (secondary)
                  ↓         ↓
              Caddy     Caddy
                  ↓         ↓
                cc        cc
```

**Tooling pick:**
- **DNS round-robin** (simplest): apex A records → both IPs. Browsers pick one randomly. Doesn't handle health. Stale IP on cache miss = ~5min slow path.
- **HAProxy** (better): tiny third VPS in front routing health-aware. Adds ~1ms latency. Costs another EUR 4-7/mo at netcup.
- **Anycast IPs** (cleanest): only available with bigger providers (Hetzner Cloud, OVH). Costs more.

**Cert sharing:** caddy stack stores LE certs in `./data` per-VPS. Each box independently runs HTTP-01 challenge. Works but means 2x cert issuance traffic.

**Sync:** static-only stack — no database state on the VPS. Each box pulls from gitea on deploy. Independent. Easy.

**Effect:** doubles capacity, removes single-box failure mode.

**Cost:** +1 VPS at netcup ~EUR 4-7/mo. +HAProxy VPS if going that route.

**When to ship:** if Cloudflare path-1 isn't enough, OR if traffic is non-static enough that CDN cache-hit rate is poor (rare for this app).

## Path 3: Container orchestrator (k3s / docker-swarm)

**Win:** declarative scale-out, zero-downtime deploys, auto-restart.

```
            Cloudflare or HAProxy
                    ↓
            k3s ingress (traefik or nginx-ingress)
                    ↓
            ┌───────┼───────┐
            ↓       ↓       ↓
          cc-1    cc-2    cc-3      ← N replicas
```

**Tooling pick:**
- **k3s** — full Kubernetes, lighter than vanilla. Steepest learning curve, most flexibility. ~250MB ram per node beyond app
- **docker-swarm** — built into Docker, simpler. Handles 80% of k8s use cases. Can stop investing if you outgrow it
- **Nomad** — middle ground, less popular

**State:** stack already stateless per-replica — `dist/` baked into image. Replica count purely throughput-driven.

**Operational cost:** ops complexity. You go from "ssh, git pull, restart" to managing a cluster. Worth it only if:
- You're deploying 3+ stacks together (codecrispi.es + others)
- You want CI/CD without per-stack Caddyfile edits
- You're already running k8s for $work and can amortize learning

**Effect:** trivial scale to N replicas. Crash recovery + rolling deploys + autoscaling.

**Cost:** 3+ nodes minimum (1 control plane + 2 workers) → ~EUR 12-20/mo at netcup. Plus your time.

**When to ship:** when you have 5+ apps to host together. Single-app on k8s is overkill.

## Decision matrix

| Traffic regime | Recommended path |
|---|---|
| < 50 rps (current) | Stay single-instance |
| 50–200 rps sustained | Path 1 (Cloudflare) |
| 200–1000 rps spike (HN) | Path 1 + tuned cache TTLs |
| Sustained > 500 rps | Path 2 (active-active) |
| Multi-app cluster | Path 3 (k3s/swarm) |

## Concrete next-step (for THIS app)

If/when star count + outreach starts: **Path 1 only**. Free, fast (1 hour to set up), proven.

Don't build path 2 or 3 speculatively. Single VPS + Cloudflare handles HN frontpage cleanly. Defer infra until traffic forces it.

## Estimates (reference)

| Setup | Sustained rps ceiling | HN-spike survives | Setup effort | Monthly cost |
|---|---|---|---|---|
| Current (1 VPS, hardened) | ~95 | ❌ | done | EUR 4 |
| + Cloudflare (Path 1) | ~2000 | ✓ | 1h | EUR 4 |
| 2× VPS active-active (Path 2) | ~190 | ⚠ | 4h | EUR 8-15 |
| Path 1 + Path 2 combined | ~4000 | ✓✓ | 5h | EUR 8-15 |
| 3-node k3s + Cloudflare (Path 3) | ~6000 | ✓✓ | days | EUR 16+ |

## Out of scope here

- Database scaling — Supabase handles its own (managed)
- Realtime — Supabase Realtime channel scales with Supabase plan
- Static asset CDN BUT bypassing Cloudflare (e.g. R2 / S3 + CloudFront) — feasible but more moving parts than Cloudflare proxy mode
