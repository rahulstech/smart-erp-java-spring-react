# SmartERP Design Guidelines

This document outlines key project-wide development patterns and constraints for SmartERP backend development. Any agent working on this repository must read and adhere to these rules.

---

## 1. Address Representation
* **Embeddable Address Entity**: The common embeddable model `com.github.rahulstech.smarterp.common.model.Address` must use a single `address` field representing the street address, rather than split fields like `addressLine1` and `addressLine2`.
* **DTO Layer**: All request and response DTOs containing addresses must align with this representation, utilizing a single `address` string field alongside standard fields like `city`, `state`, `pincode`, and `country`.

---

## 2. HTTP Exception Handling
* **No Specific/Custom Exceptions**: Avoid creating custom HTTP exception classes (e.g., `CompanyNotFoundException`, `UserNotFoundException`, etc.) within slices or domain modules.
* **Unified HttpException Class**: Always throw the common exception class `com.github.rahulstech.smarterp.common.exception.HttpException`.
* **Static Helper Methods**: Utilize (and, if needed, extend) the static helper methods defined inside `HttpException` to instantiate exceptions with the appropriate HTTP status code:
  * `HttpException.notFound(message)` — for `404 Not Found`
  * `HttpException.badRequest(message)` — for `400 Bad Request`
  * `HttpException.unauthorized(message)` — for `401 Unauthorized`
  * `HttpException.forbidden(message)` — for `403 Forbidden`
  * `HttpException.internalServerError(message)` — for `500 Internal Server Error`

---

## 3. Database SQL Scripts
* **Entity and Repository Changes**: Whenever a new database entity is created or repository queries are updated, you must create or update a corresponding SQL script defining the tables, indices, functions, or procedures.
* **Granularity**: Create separate SQL script files for each table individually (under the `backend/sql` directory) rather than combining multiple tables into a single script.

---

## 4. Frontend Module Structure & Guidelines
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
* **Adherence**: Adhere strictly to this architectural structure to ensure consistency across the entire frontend application.



