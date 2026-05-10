# Traveloop DevOps & Infrastructure

## 1. Testing Workflow

### Unit & Integration (Vitest)
```bash
npm run test
```

### E2E (Playwright)
```bash
# Run tests
npx playwright test

# UI mode
npx playwright test --ui
```

## 2. Docker Setup

### Local Development
```bash
docker-compose up -d
```
Runs the app at `http://localhost:3000` and a PostgreSQL instance.

### Production Build
```bash
docker build -t traveloop-prod .
```

## 3. CI/CD Pipeline
- **CI**: Runs on every PR to `main`. Checks linting, types, unit tests, and build.
- **Deploy**: Runs on push to `main`. Deploys migrations and updates production environment.

## 4. Security
- **Headers**: CSP, HSTS, XSS protection active in middleware.
- **Rate Limiting**: IP-based limiting on API routes.
- **Auditing**: Critical actions are logged for monitoring.

## 5. Performance
- **Caching**: Server-side data caching with `unstable_cache`.
- **Optimization**: Component lazy loading and list virtualization included.

## 6. PWA & Offline
- **Installable**: App is a fully compliant PWA.
- **Offline**: Service worker caches core assets and provides a fallback.

## 7. Backups
Scripts are available in `/scripts` to automate PostgreSQL backups.
```bash
# Backup
./scripts/backup-db.sh

# Restore
./scripts/restore-db.sh ./backups/file.sql.gz
```
