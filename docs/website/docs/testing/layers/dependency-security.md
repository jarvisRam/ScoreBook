---
sidebar_position: 2
title: Dependency Security
description: Vulnerable third-party packages are found by Dependabot and blocked at PR time by dependency review. SonarCloud only analyses our own code.
---

# Dependency Security

Most of the code in a ScoreBook build isn't ours. It comes from the npm packages in `mobile/`, `backend/` and the repo root, and from the GitHub Actions our workflows call. A vulnerability in any of them ships with the app. This layer answers a question that [static checks](./static-checks.md) can't: **do the packages we depend on have known vulnerabilities?**

It sits at the base of the [test pyramid](../overview.md#the-test-pyramid) with the static checks. It reads manifests and lockfiles without running the code, runs on every change, and costs almost nothing to run.

:::info Why SonarCloud doesn't cover this
SonarCloud analyses our *first-party* source. Its security rating and hotspot review say nothing about a vulnerable package in `node_modules`. Scanning dependencies (software composition analysis) is a separate paid add-on in SonarQube Cloud, so we use GitHub's free tooling instead.
:::

The layer has two checks, each answering a different question:

| Check | Question it answers | Tool | Blocks merge? |
| :--- | :--- | :--- | :--- |
| **Vulnerable dependencies we already use** | Which of our current dependencies have a known vulnerability, and what is the fix? | Dependabot (alerts, security updates, version updates) | No. It raises alerts and opens PRs. |
| **Vulnerable dependencies a PR introduces** | Does this PR add or upgrade a dependency to a version with a known vulnerability? | `actions/dependency-review-action` | Fails the check at **high** severity or above. Not a required status check yet (see [Current gap](#current-gap)). |

Matrix key: ✅ strong fit · ⚠️ partial / with caveats · ❌ not supported. The chosen tool is in **bold**.

---

## Vulnerable dependencies we already use

**What it checks**: the dependency graph GitHub builds from our lockfiles (`package-lock.json` in `/`, `/backend` and `/mobile`) and from the `uses:` lines in our workflows, matched against the GitHub Advisory Database. Three Dependabot features work together:

| Feature | What it does | Configured in |
| :--- | :--- | :--- |
| **Dependabot alerts** | Raises an alert in the repository's **Security** tab when a dependency matches a published advisory, including advisories published after we added the package. | Repository settings |
| **Dependabot security updates** | Opens a PR that bumps the vulnerable package to the first patched version, as soon as the alert is raised. | Repository settings |
| **Dependabot version updates** | Opens routine upgrade PRs on a schedule so we don't fall far behind. | [`.github/dependabot.yml`](https://github.com/jarvisRam/ScoreBook/blob/main/.github/dependabot.yml) |

### How version updates are configured

| Ecosystem | Directory | Schedule | Grouping |
| :--- | :--- | :--- | :--- |
| npm | `/` (root tooling and Playwright) | Weekly | Minor and patch bumps in one PR |
| npm | `/backend` | Weekly | Minor and patch bumps in one PR |
| npm | `/mobile` | Weekly | Minor and patch bumps in one PR |
| GitHub Actions | `/` | Weekly | All action bumps in one PR |

- **Major upgrades arrive as their own PR.** They are the ones that can break behaviour, so they are never folded into a group.
- **Open version-update PRs are capped at 5 per npm directory**, to stop a backlog from flooding the PR list. Security updates aren't held back by this cap.
- **The Actions ecosystem keeps our pinned SHAs current.** Third-party actions are pinned to a commit SHA, and Dependabot updates the SHA and its version comment together.

### Decision matrix

| Criteria | **Dependabot** | Renovate | Snyk | OWASP Dependency-Check | `npm audit` alone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Accurate matching for npm packages | ✅ package-based advisories | ✅ | ✅ own database | ⚠️ matches by CPE name, so it produces false positives and misses for npm | ✅ npm advisories |
| Opens fix PRs automatically | ✅ | ✅ | ✅ | ❌ report only | ❌ manual `npm audit fix` |
| Monitors continuously, not only when CI runs | ✅ alerts when an advisory is published | ✅ | ✅ | ⚠️ only when the scan runs | ❌ only when run |
| Updates GitHub Actions and their pinned SHAs | ✅ | ✅ | ❌ | ❌ | ❌ |
| Monorepo with several lockfiles | ✅ one entry per directory | ✅ | ✅ | ⚠️ one scan per project | ⚠️ one run per package |
| Setup and upkeep | ✅ built into GitHub, one YAML file | ⚠️ separate app or self-hosted, more configuration | ⚠️ account, token and limits | ⚠️ NVD database download, slow and rate-limited without an API key | ✅ none |
| Cost for a public repository | ✅ free | ✅ free | ⚠️ free tier with limits | ✅ free | ✅ free |

### Why Dependabot

- **It finds the problem and proposes the fix.** A report nobody acts on doesn't reduce risk. Each alert arrives with a PR that already has the patched version, and the normal PR checks run on it.
- **It's already part of GitHub.** There is no extra service, token or database to maintain, and it covers workflow actions as well as npm.
- **OWASP Dependency-Check isn't a fit for this stack.** It is built mainly for Java and .NET, its npm matching is name-based and noisy, and it adds a slow NVD download to the pipeline for no extra coverage. Reconsider it only if we add Java or .NET code or a compliance requirement names it.
- Renovate is the strongest alternative if we outgrow Dependabot's grouping and scheduling options.

### Acting on findings

Triage by severity, and by whether the package ships in the app or is only used to build and test it. These are the targets for when the owner merges the fix or records why not.

| Severity | Production dependency | Dev or test-only dependency |
| :--- | :--- | :--- |
| **Critical** | Fix within **2 business days**. Hotfix if it is exploitable in our usage. | Fix within the week. |
| **High** | Fix within **5 business days**. | Next routine update cycle. |
| **Medium / low** | Picked up by the weekly grouped PR. | Picked up by the weekly grouped PR. |

1. **Read the advisory first.** Check whether the vulnerable code path is reachable in how we use the package.
2. **Merge the Dependabot PR once CI is green.** For a major upgrade, read the changelog and run the affected layer locally (see [Running Tests](../running-tests.md)). The PR gate catches regressions, and the [contract](./contract-testing.md) layer catches a changed API shape.
3. **If there is no patched version**, add an npm `overrides` entry for a safe transitive version, replace the package, or dismiss the alert.
4. **Dismiss an alert only with a reason.** Choose the matching reason in GitHub (*vulnerable code is not used*, *risk is tolerable*, *inaccurate*), add a note, and link an issue if the alert is only deferred. Don't dismiss to clear the list.

:::note Dependabot PRs and secrets
GitHub gives workflows triggered by Dependabot a separate, smaller set of secrets (Dependabot secrets) and a read-only `GITHUB_TOKEN`. A job that needs `PACT_BROKER_TOKEN`, `SONAR_TOKEN` or similar may fail or skip on a Dependabot PR even though the code is fine. If that happens, add the secret under *Settings → Secrets and variables → Dependabot* rather than reading the failure as a bad update.
:::

---

## Vulnerable dependencies a PR introduces

**What it checks**: on every pull request, the `Dependency Review` workflow compares the dependency graph on the PR branch with the base branch. It lists each dependency that was added, removed or changed, and fails the check if any added or upgraded dependency has a known vulnerability of **high** severity or above. It only judges what the PR changes. Vulnerabilities that already exist on `main` stay in Dependabot's queue, so an unrelated PR is never blocked by inherited debt.

This is the same "clean as you code" idea as the SonarCloud new-code gate, applied to packages.

### Decision matrix

| Criteria | **dependency-review-action** | `npm audit` in CI | Snyk PR check | OSV-Scanner |
| :--- | :--- | :--- | :--- | :--- |
| Judges only what the PR changes | ✅ diffs base against head | ❌ scans the whole tree, so old debt fails every PR | ✅ | ⚠️ diff mode available |
| Covers npm and GitHub Actions together | ✅ | ❌ npm only, per package | ⚠️ package ecosystems only | ⚠️ lockfiles only |
| Shows the change in the PR | ✅ summary and annotations | ⚠️ log output only | ✅ | ⚠️ log output only |
| Needs an external account or token | ✅ none | ✅ none | ❌ account and token | ✅ none |
| Cost for a public repository | ✅ free | ✅ free | ⚠️ free tier with limits | ✅ free |
| Setup effort | ✅ one workflow file | ✅ one step per package | ⚠️ app install | ⚠️ workflow setup |

### Why dependency review

- **It's scoped to the PR.** A whole-tree audit would fail every PR the moment a new advisory lands on an old package. Dependency review fails only the PR that introduces the problem, and leaves the old ones to Dependabot.
- **It needs nothing outside GitHub.** The only prerequisite is that the repository's dependency graph is switched on. Without it the action fails with *"Dependency review is not supported on this repository"*.
- **It also checks workflow actions.** A newly added third-party action with an advisory is caught the same way as an npm package.

**Gate**: no added or upgraded dependency with a known vulnerability of high or critical severity. The action is pinned to a commit SHA and the pin is itself kept current by Dependabot.

**Acting on findings**: pick a patched version of the dependency the PR added, or choose a different package. If the vulnerability is in a dev-only package and genuinely not reachable, say so in the PR and get the reviewer's agreement before overriding.

**What good looks like**: the check finishes in under a minute (the first run took about 5 seconds), and no high or critical finding is merged without a recorded reason.

---

## Setup

The behaviour above depends on repository settings that live in GitHub, not in the code. If this layer stops working, check them first.

| Setting (Settings → Code security) | State | Why it matters |
| :--- | :--- | :--- |
| Dependency graph | On | Dependency review fails without it. Turned on with Dependabot alerts. |
| Dependabot alerts | On | Raises the alerts. |
| Dependabot security updates | On | Opens the fix PRs for alerts. |

| File | Purpose |
| :--- | :--- |
| `.github/dependabot.yml` | Version-update schedule and grouping, per directory |
| `.github/workflows/dependency-review.yml` | The PR-time check |

Dependabot reads its configuration from the default branch, so a change to `dependabot.yml` takes effect only once it is merged to `main`.

---

## Current gap

:::warning Dependency review isn't a required check yet
The `Dependency Review` check fails a PR that introduces a high or critical vulnerability, but branch protection on `main` only requires **Lint, Type Check, and Test**. Until `Dependency Review` is added as a required status check, a failing result is a strong signal and not a hard block. Make it required once it has run cleanly on a few PRs.
:::

:::warning The existing backlog
When this layer was introduced, `npm audit` on `backend/` reported vulnerabilities across production dependencies, including high and critical ones. Dependency review deliberately ignores these because the PR didn't introduce them. They are worked through the Dependabot alerts and PRs, using the targets in [Acting on findings](#acting-on-findings).
:::

Two things we don't do yet:

- **No `npm audit` step in CI.** Dependabot covers the same advisories, but a step that fails on high-severity production dependencies would also catch a vulnerability that exists on `main` before an alert is acted on.
- **No scan of the built output or container images.** There is no image to scan today. Add one (for example OSV-Scanner or Trivy) if we ship one.

---

## Related

- [Static Checks](./static-checks.md): SonarCloud analyses our own code, this layer analyses what we import
- [Test Strategy](../strategy.md): where dependency security sits in the PR gate and the weekly cadence
- [Running Tests](../running-tests.md): `npm audit` commands for a local check
