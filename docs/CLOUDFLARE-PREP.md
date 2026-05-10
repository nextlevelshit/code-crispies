# Cloudflare dormant setup (free tier)

Pre-configured Cloudflare account for codecrispi.es. **Proxy stays OFF** (gray cloud, DNS-only). Traffic goes direct to netcup. When HN/reddit spike forces it, flip one toggle per record to **orange cloud** → traffic now absorbed by CF edge.

## Why dormant?

- Zero behavior change vs current state — traffic still direct
- CF account configured, nameservers transferred, rules ready
- Activation = single toggle in CF dashboard. No code change, no DNS propagation wait. ~5 min from spike → mitigation.
- Revertible — flip back to gray cloud → back to direct origin

## One-time setup (user-only, ~30 min)

### 1. Create Cloudflare account

- https://dash.cloudflare.com/sign-up
- Use a real email (LE renewals + abuse alerts route here)
- Enable 2FA at account level

### 2. Add site

- "Add a Site" → enter `codecrispi.es`
- Plan: **Free**
- CF scans current DNS at netcup; verify it imports:
  - A `codecrispi.es` → `37.120.174.54`
  - AAAA `codecrispi.es` → `2a03:4000:6:776d:34d0:3dff:feb9:d51a`
  - A `www.codecrispi.es` → `37.120.174.54`
  - AAAA `www.codecrispi.es` → `2a03:4000:6:776d:34d0:3dff:feb9:d51a`
  - (No MX — no email at apex)
  - (Any TXT records for DKIM/SPF/verification — preserve)

### 3. Set ALL records to DNS-only (gray cloud)

Critical step. Per record in the DNS list:
- Toggle the orange cloud icon → **gray cloud**
- This means: CF answers DNS queries but does NOT proxy the traffic
- Traffic flows: client → CF DNS resolution → direct connect to netcup
- CF sees the DNS query but never the HTTP request

### 4. Change nameservers at netcup

- CF dashboard shows the two NS records to set (e.g. `nina.ns.cloudflare.com` + `walt.ns.cloudflare.com`)
- Log into netcup customer portal → DNS → change nameservers for `codecrispi.es`
- Wait for propagation (~5min–24h depending on TTL of current netcup NS records)
- CF dashboard turns "Active" once it detects the NS change

### 5. Pre-configure cache rules (dormant)

These rules ONLY take effect when proxy is ON (orange). Configuring now = ready to flip:

**Cache Rule 1: Cache everything static**
- Hostname: `codecrispi.es` OR `www.codecrispi.es`
- AND URI Path matches `\.(js|css|png|jpg|svg|ico|webmanifest|woff2?|ttf|map)$`
- THEN: Cache eligibility → Eligible for cache, Edge TTL → 1 year

**Cache Rule 2: Cache HTML for 5 minutes**
- Hostname matches
- AND URI Path matches `\.html$` OR ends with `/`
- THEN: Edge TTL → 5 min

**Bypass: API + auth**
- URI Path starts with `/api/` OR `/auth/` OR `/health`
- THEN: Cache eligibility → Bypass

### 6. Verify direct origin still works

```bash
# DNS now from CF (gray cloud = same IP)
dig +short codecrispi.es @1.1.1.1
# expect: 37.120.174.54

# HTTPS still hits netcup (Caddy cert)
curl -sI https://codecrispi.es/ | grep -i server
# expect: Server: Caddy (NOT Cloudflare)
```

## Activation (when ready, ~5 min)

For each of the 4 records (apex A+AAAA, www A+AAAA):

1. CF dashboard → DNS → Records
2. Click the gray cloud icon next to the record
3. It turns **orange** → CF is now proxying

Verify:

```bash
# DNS now returns CF anycast IPs
dig +short codecrispi.es @1.1.1.1
# expect: 104.x.x.x or 172.x.x.x (CF IPs)

curl -sI https://codecrispi.es/ | grep -i server
# expect: Server: cloudflare
```

CF requests new edge TLS cert automatically (~30s). HTTPS keeps working through the swap because CF Universal SSL provisions in parallel.

## Rollback (~30 sec)

Click orange cloud → gray cloud per record. Traffic immediately falls back to direct origin. CF cache continues serving stale content for ~30 seconds while routing transitions.

## What you give up

- **Origin TLS termination** → CF re-terminates at edge with their cert. Your Caddy LE cert still works in parallel; CF's just takes precedence at the edge
- **Real client IPs** → arrive in `CF-Connecting-IP` header; nginx logs show CF IPs in `$remote_addr` unless you configure `real_ip_header` (see below)
- **No JS injection** — CF doesn't inject scripts on free tier (Pro+ has the option for analytics; off by default)
- **Privacy** — CF sees full URL + user IP for every cached miss

## Optional: real client IP at origin

If you want real IPs in nginx logs after CF activation, add to `nginx.conf` http block:

```nginx
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
real_ip_header CF-Connecting-IP;
```

(CF IP list: https://www.cloudflare.com/ips/ — update on schedule)

Defer this until activation; works fine without for free-tier needs.

## Cost

**EUR 0/mo for free tier.** Unlimited bandwidth + requests. Pro ($20/mo) only adds WAF + image polish — not needed for this app.

## Activation triggers (when to flip)

- Show HN / reddit /r/programming / dev.to frontpage submission planned in <2 days
- Sustained > 50 rps measured against current ceiling
- DDoS attempt observed in nginx logs
- Star count crosses 500 (likely future popularity)

## What this PR adds

`docs/CLOUDFLARE-PREP.md` — this file. No code change, no infra change.
The user-side setup steps stay user-only (CF account, registrar nameserver change). Activation runbook documented for when needed.
