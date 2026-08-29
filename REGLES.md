<!-- SOURCE-VERSION: 2026-08-28 -->
<!-- Ce fichier est la source de vérité. Les copies dans chaque projet doivent porter la même version. Voir bin/sync-regles.sh -->

# RÈGLES — à lire AVANT de travailler

> S'appliquent à toute IA ou humain qui touche ce dépôt.

## Branches et flux Git

1. **Préfixe agent + lieu partout.** Toute branche et tout commit portent en préfixe `[agent]-[lieu]` — pour que l'origine soit lisible sans creuser.
   - Format libre `[device]-[surface]` — précise autant qu'utile, pas plus.
     - Devices vus : `phone`, `desktop`, `laptop`, `server`, `cloud`.
     - Surfaces vues : `termux`, `shell`, `cmd`, `app`, `web`.
   - Utilise la forme courte (`phone`, `desktop`) si la surface n'apporte rien.
   - Branche : `[agent]-[lieu]/[sujet]` — ex. `claude-phone-termux/fix-auth`, `kimi-desktop/refactor`.
   - Commit : message préfixé `[agent-lieu] …` — ex. `[claude-phone-termux] fix: bordure gho_title`.
2. **Jamais de commit sur `main`** sauf `go` explicite de Frank pour l'action précise. L'autorisation ne se reporte pas au commit suivant.
3. **Petits commits fréquents**, messages clairs.
4. **`git pull` avant de commencer**, **push ta branche avant de quitter**. Branche locale = travail perdu.

## Coordination

5. **Avant de coder** : lis `HANDOFF.md`, `TACHES.md`, `MEMOIRE-PARTAGEE.md`. Si tu apprends quelque chose de transverse pendant la session, ajoute une entrée en tête de `MEMOIRE-PARTAGEE.md` avant de partir.
6. **Avant de déléguer** (ou de démarrer un travail long) : `git fetch --all` — vérifier que personne n'a déjà livré.
7. **Avant de quitter** : mets à jour `HANDOFF.md` + `TACHES.md`. Toute tâche pensée mais non faite y va — rien ne reste dans la tête.
8. **Conflit ou doute** : note dans `HANDOFF.md` et arrête. Ne touche pas au travail d'une autre branche.
9. **Périmètre** : ne renomme, supprime, déplace rien hors de ta tâche.

## Discipline (règles Frank)

10. **Confirmation avant destructif** : `cp -f`, `rm`, `mv` qui écrase, `reset --hard`, overwrite d'un fichier non-vu. Une décision techniquement correcte prise unilatéralement reste une décision volée.
11. **Réponses courtes en Termux** : pas de tableaux lourds, pas de cadres ASCII, une idée par message.
12. **Sauvegarder le contexte** avant de demander à Frank de sortir d'une session (tmux detach, exit, reboot).
13. **Batches, pas micro-tâches** pour les subagents.
14. **Pas de contrition performative** — ack court + correctif. Après une frustration, attendre `go` explicite.

## Bookends multi-projets (sync système Gardien)

15. **À l'ouverture** d'un projet sous `~/projects/` : run `~/projects/coordination/bin/verify-all.sh --quiet`. Si drift/périmé signalé, corrige ou signale à Frank avant d'agir.
16. **À la sortie** d'une tâche qui a touché `HANDOFF.md` : mets à jour `.coordination-summary.yaml` du projet (dont `dernière_maj`), puis run `~/projects/coordination/bin/sync-summary.sh`. Commit les deux repos avec préfixe `[agent-lieu]`.

## Concurrence — 2 IAs sur le même repo

17. **Claim avant d'agir sur un projet actif.** Si tu vas travailler > 5 minutes dans un projet, réserve-le :
    - `git pull` sur la branche par défaut du projet.
    - Édite `TACHES.md` : marque la tâche `🔄 en cours [agent-lieu] YYYY-MM-DD HH:MM` (ou ajoute-la si absente).
    - Commit `[agent-lieu] claim: <sujet>` et **push**. Si le push est refusé (non-fast-forward), quelqu'un d'autre a claim en premier : `git pull --rebase`, relis `TACHES.md`, coordonne.
    - À la fin, remets `✅` ou libère la ligne dans le même flow que la règle 16.
    - Pour du travail parallèle sur le **même code** (rare), utilise `git worktree add` plutôt qu'un second clone.

*Système Gardien Multi-IA — 2026-08-11, règles 10–14 ajoutées 2026-08-27, règles 15–16 (bookends sync) et 17 (claim concurrence) ajoutées 2026-08-28.*
