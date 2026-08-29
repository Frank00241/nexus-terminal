<!-- SOURCE-VERSION: 2026-08-28 -->
<!-- Ce fichier est la source de vérité. Les copies dans chaque projet doivent porter la même version. Voir bin/sync-regles.sh -->

# Instructions pour toute IA qui ouvre ce dossier

> Ce fichier est le point d'entrée universel. `CLAUDE.md` est un symlink
> vers ici — ne pas les faire diverger.

## Avant TOUTE action, lis dans l'ordre :

1. `REGLES.md` — les 20 lois communes (obligatoires, dont préfixe `[agent]-[lieu]` §1, bookends sync §15–16, claim concurrence §17, survie session §18–19, log §20)
2. `HANDOFF.md` — où en est le projet
3. `TACHES.md` — qui fait quoi
4. `MEMOIRE-PARTAGEE.md` — apprentissages inter-agent (append-only)

Puis, si tu ouvres un projet sous `~/projects/` : run `~/projects/coordination/bin/verify-all.sh --quiet` (règle 15).

## Ton identité

- **Ton nom d'agent** : `claude`, `kimi`, `opencode`, `antigravity`, `gpt`, autre — utilise le même partout.
- **Ton lieu** : `[device]-[surface]` — ex. `phone-termux`, `desktop-shell`, `cloud`. Voir REGLES.md §1.
- **Ta branche** : `[agent]-[lieu]/[sujet]` — jamais `main` sauf `go` explicite de Frank.

## En partant

- Mets à jour `HANDOFF.md` (fait / état / suite / bloquages) et `TACHES.md` du projet.
- Mets à jour `.coordination-summary.yaml` du projet (bump `dernière_maj`).
- Run `~/projects/coordination/bin/sync-summary.sh` (règle 16).
- Ajoute une entrée dans `~/projects/coordination/JOURNAL.md` (règle 20).
- Commit avec message préfixé `[agent-lieu] …`.
- Push ta branche (projet **et** coordination si tu y as poussé un sync ou du log). Local = perdu.

## Onboarding d'un nouvel agent (pour Frank)

Une phrase suffit :

> « Lis `~/projects/coordination/AGENTS.md` — nos règles et procédures. Ton nom d'agent : `<nom>`. Ton lieu : `<device>-<surface>`. »

Si l'agent n'est pas sur ce téléphone :

> « Clone `github.com/Frank00241/coordination` puis lis `AGENTS.md`. »

## Setup d'un nouveau poste (une fois par machine)

```bash
bash ~/projects/coordination/bin/setup.sh
```

Installe hooks git, chpwd-hook `.bashrc`, alias `git sync`. Vérifie deps (python3, pyyaml).

*Système Gardien Multi-IA — installé le 2026-08-11, étendu 2026-08-27, sync inter-projets 2026-08-28.*
