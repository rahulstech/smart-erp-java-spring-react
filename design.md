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

