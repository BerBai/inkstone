---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
# Stable identifier shared across language variants of this page. Hugo uses
# it to link translations via .Translations / .IsTranslated. Default keeps
# the slug; override only if you rename the file later but want to preserve
# the pairing with an existing translation. See .trellis/spec/frontend/i18n.md.
translationKey: "{{ .File.ContentBaseName }}"
---

