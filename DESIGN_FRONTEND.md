# SmartERP Frontend Design Guidelines

This document outlines key project-wide development patterns and constraints for SmartERP frontend development. Any agent working on this repository must read and adhere to these rules.

---

## 1. Frontend Module Structure & Guidelines
* **Module-Scoped Directories**: Any module inside `frontend/src/` (such as `company` or any new module) should be organized with at most the following child directories:
  * `pages/` — contains `.tsx` pages/views for this module.
  * `services/` — contains API communication and service code specific to this module.
  * `hooks/` — contains custom React hooks specific to this module.
  * `components/` — contains components used only within this module.
  * `types/` — contains TypeScript files for types specific to this module, grouped by purpose (e.g. `api.types.ts`, `model.types.ts`).
* **Shared / Common Directory (`src/common`)**: Anything shared across multiple modules must be put inside `src/common/`:
  * Shared API utilities must go in `src/common/services/` (e.g., `src/common/services/api.ts`).
  * Shared components go in `src/common/components/`.
  * Shared hooks go in `src/common/hooks/`.
  * Shared TypeScript types go in `src/common/types/` (e.g., `src/common/types/model.types.ts`).
* **Type Location Rules**: 
  * Always define types inside dedicated files within a `types/` directory (either `src/common/types/` or a module-specific `src/<module>/types/`).
  * **Never** define types directly inside page files, component files, service files, or hook files.
  * Name files clearly based on purpose (e.g. `model.types.ts`, `api.types.ts`).
* **Keyboard-First Navigation**:
  * The entire frontend must be designed for keyboard-only navigation. Mouse interaction is secondary.
  * Keyboard shortcuts are registered either globally by the Scaffold or dynamically by active page components.
  * A page can register dynamic shortcuts, which are automatically attached on mount and cleaned up on unmount.
  * If a dynamic shortcut conflicts with a global shortcut, the global shortcut takes precedence, the dynamic one is discarded, and a warning is printed to the console.
  * If there are duplicate dynamic shortcuts registered by the active page components, the last registered handler takes precedence.
  * All registered shortcuts must be dynamically listed in the right shortcut panel.
  * **Global Shortcut Definitions**: Always define any global shortcut as a constant in `src/common/constants.ts` first, and add it to the `GLOBAL_SHORTCUTS` array before utilizing it in the application.
* **Routing Patterns & Constants**:
  * Always define all route paths inside the `APP_ROUTES` object in `src/common/constants.ts` first.
  * Always reference paths or route creation helper functions from `APP_ROUTES` anywhere route paths are used in the frontend application. Never hardcode route paths in links, navigation handlers, or Route definitions.
* **Adherence**: Adhere strictly to this architectural structure to ensure consistency across the entire frontend application.

---

## 2. Commenting & Documentation Rules
* **General Comments**: Keep general comments as short as possible, describing only the core purpose and confusing parts. Avoid commenting on obvious things.
* **Style & Readability**: Use simple sentences that are not too verbose and avoid heavy or hard words. Restrict the width of comments so they can be read without horizontal scrolling. Write comments in one or two short paragraphs, or use markdown bullet points for step-by-step guides.
* **Tricky/Critical Logic**: Always explain tricky or critical logic. Describe *what* the logic is doing and *why* it is designed that way, so future developers can understand the reasoning. Do not use phrases like "hey future me..." or "hey reader...". Avoid separating comments into explicit "why" and "what" headings.
* **Lengthy Multi-step Actions**: For long, multi-step actions (4 or more steps), place a single-line comment before each step to outline what is happening. If possible, refactor correlated steps into helper methods of up to 3 steps each, unless maintaining a single multi-step method is better for code readability and simplicity.
