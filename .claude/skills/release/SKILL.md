---
name: release
description: Připraví a provede release Just Throw It - spustí npm test, ukáže git status, navrhne rozdělení změn do tematických commitů, commitne jako qxyz95 a po potvrzení pushne. Nikdy force push.
argument-hint: "[poznámka, např. jen commit / i push]"
disable-model-invocation: true
---

# Release

Poznámka uživatele: `$ARGUMENTS`

## Pravidla
- Autor i committer: `qxyz95 <qxyz95@users.noreply.github.com>`. Formát zprávy `<oblast>: <co>` (česky, stručně), poslední řádek zprávy přesně `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- **Nikdy** `git push --force`, `--force-with-lease`, `git reset --hard`, přepis historie ani `--no-verify`.
- Push jen po výslovném potvrzení uživatele v této konverzaci. Merge do `main` jen na samostatný výslovný pokyn.
- Necommituj soubory, které vypadají jako tajné (`.env`, klíče) nebo velké generované výstupy mimo zvyk repa; zeptej se.

## Postup
1. **Testy:** `npm test`. Když selže, vypiš selhané testy a skonči. Nic necommituj.
2. **Stav:** `git status --short`, `git branch --show-current`, `git log --oneline -5` a `git diff --stat` (i pro `--cached`). Ukaž uživateli.
3. **Kontrola identity:** `git config user.name` a `git config user.email`. Když neodpovídají `qxyz95` / `qxyz95@users.noreply.github.com`, použij při commitu `git -c user.name=qxyz95 -c user.email=qxyz95@users.noreply.github.com commit ...` (config neměň).
4. **Návrh commitů:** rozděl změny po tématech (např. `render3d: ...`, `atlas: ...`, `i18n: ...`, `simulace: ...`, `docs: ...`, `agenti: ...`). Pro každý commit: zpráva a seznam souborů. Soubor s několika tématy nech v jednom commitu a řekni to. Ukaž návrh a **počkej na potvrzení nebo úpravu**.
5. **Commit** po potvrzení, pro každou skupinu zvlášť: `git add <soubory>` (konkrétní cesty, ne `git add -A`) a commit se zprávou přes heredoc, např.:
   ```
   git commit -F - <<'EOF'
   render3d: kamera-režisér drží vlaštovku v záběru

   Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
   EOF
   ```
   Hooky nepřeskakuj. Když hook selže, oprav příčinu a vytvoř nový commit (ne `--amend`).
6. **Ověření:** `git log --format='%h %an <%ae> | %s' -n <počet>` a `git status --short`. Ukaž výsledek.
7. **Push:** zeptej se „Pushnout větev `<větev>` na `origin`?“ Až po „ano“: `git push origin <větev>` (u nové větve `git push -u origin <větev>`). Když push selže kvůli odmítnutí (non-fast-forward), nic nevynucuj, vypiš stav a navrhni `git pull --rebase` jako otázku.
8. Shrnutí: commity (hash, zpráva), co bylo pushnuto a kam, co zůstalo necommitnuté.
