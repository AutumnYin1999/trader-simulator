#!/usr/bin/env python3
"""Validate a narration manifest against the JSON Schema and run soft checks."""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

import jsonschema

SKILL = Path(__file__).resolve().parent.parent
SCHEMA = json.loads((SKILL / "templates/narration-manifest.schema.json").read_text())

ACTION_VERBS = {"click", "type", "scroll", "open", "navigate", "select", "paste", "drag", "drop", "hover"}


def hard_errors(manifest):
    validator = jsonschema.Draft202012Validator(SCHEMA)
    return list(validator.iter_errors(manifest))


def soft_warnings(manifest):
    warnings = []
    for entry in manifest:
        text_lower = entry.get("text", "").lower()
        visual = entry.get("visual", {})
        for w in visual.get("emphasis", []) or []:
            if w.lower() not in text_lower:
                warnings.append(f"[{entry.get('id')}] emphasis word '{w}' not in text")
        verbs_present = [v for v in ACTION_VERBS if re.search(rf"\b{v}\w*\b", text_lower)]
        if len(verbs_present) >= 2:
            warnings.append(
                f"[{entry.get('id')}] compound-sentence smell: action verbs {verbs_present}"
            )
    return warnings


def main(argv):
    if len(argv) != 2:
        print("usage: validate-manifest.py <manifest.json>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    manifest = json.loads(path.read_text())
    errors = hard_errors(manifest)
    if errors:
        for e in errors:
            print(f"ERROR: {'.'.join(str(p) for p in e.absolute_path)}: {e.message}", file=sys.stderr)
        return 1
    for w in soft_warnings(manifest):
        print(f"WARNING: {w}")
    print(f"OK: {len(manifest)} entries validated.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
