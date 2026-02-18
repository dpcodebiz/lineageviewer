# 📊 Lineage viewer

Lineage exploration tool for Data pipelines.

This tool has been built initially as an alternative to Timextender's native lineage viewer, however the tool can easily be adapted to fit other use cases: Power BI, Qlik, etc.

Example:

> A browser-based tool to import XML metadata projects, parse them into structured models, and explore them visually.

---

## 🚀 Features

- 📂 Local Project handling (Timextender XML only for now)
- 🧠 Interactive lineage exploration
- ⚡️ Fast and smart lineage computation (example: automatic table detection from views using REGEX)
- 🔄 Switch between table-based lineage for an overview and field-based lineage for details
- ⌗ Field types, warehouses, transformations, sources
- ✅ Compare multiple table or field lineages at the same time
- 😍 Clean, modern and visual interface

---

## 🧱 Architecture Overview

High-level explanation of how it works:

1. Project is loaded on user upload (Timextender XML only for now)
2. XML is parsed into structured objects -> `src/parsing/` and stored in an IndexedDB
3. Project is opened inside the viewer and layout is done with ElkJS -> `src/viewer/` & `src/lib/`
4. Lineage is computed whenever settings change or a new selection is made -> `src/data/`

---

## 🛠 Tech Stack

- **Frontend**: Vite, React, TypeScript, Tailwindcss, Shadcn, Reactflow
- **Storage**: IndexedDB
- **Parsing**: DOMParser (browser-native)

---

## 📦 Installation

```bash
git clone https://github.com/dpcodebiz/lineageviewer
cd project
npm install
npm run dev
```

---

## Disclaimer

Code has been cleaned a little bit to prepare for this public release but further refactoring is more than welcome. Extensive user testing has been done, however bugs may still be present as there is no unit testing (please contribute ☺️).
