# SmartERP Backend Design Guidelines

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

## 4. DTO Design & Validation
* **Java Records**: Use Java `record` for DTOs instead of regular classes.
* **Validation Annotations**: Request DTOs annotated with `@RequestBody` in controllers must include proper validation annotations.
* **Error Messages**: Each validation rule must specify a simple, short error message describing *why* it is an issue rather than *what* the issue is.
  * *Example*: If a field `name` is annotated with `@NotBlank`, specify a message like `"name is required"` rather than `"name must not be blank"`.
* **Custom Verification**: If no suitable built-in validation annotation exists, define a boolean-returning method inside the record, annotated with `@AssertTrue` and a descriptive message. Implement the required check within this method.

---

## 5. Validation Error Handling & Logging
* **Response Structure**: For validation errors, return an `ErrorResponse` with a `400 Bad Request` status.
* **Error Format**: Use the `FieldError` variant of `ErrorResponse`, mapping each invalid field name to its corresponding error message in the `reasons` map.
* **Logging**: Log validation failures at two levels:
  * **ERROR level**: Log the request path.
  * **DEBUG level**: Log the field names, values, and the associated error messages.

---

## 6. Controller Response Codes
* **Status Code Selection**: Return appropriate HTTP status codes based on the outcome of the request:
  * **201 Created**: For successful creation requests.
  * **204 No Content**: For successful deletion requests.
  * **200 OK**: For other successful requests.
* **Response Wrapper**: Only wrap response payloads in a `ResponseEntity` when a custom HTTP status code other than 200 (such as 201 or 204) is required. For standard 200 responses, return the response DTO directly.

---

## 7. Commenting & Documentation Rules
* **General Comments**: Keep general comments as short as possible, describing only the core purpose and confusing parts. Avoid commenting on obvious things.
* **Style & Readability**: Use simple sentences that are not too verbose and avoid heavy or hard words. Restrict the width of comments so they can be read without horizontal scrolling. Write comments in one or two short paragraphs, or use markdown bullet points for step-by-step guides.
* **Tricky/Critical Logic**: Always explain tricky or critical logic. Describe *what* the logic is doing and *why* it is designed that way, so future developers can understand the reasoning. Do not use phrases like "hey future me..." or "hey reader...". Avoid separating comments into explicit "why" and "what" headings.
* **Lengthy Multi-step Actions**: For long, multi-step actions (4 or more steps), place a single-line comment before each step to outline what is happening. If possible, refactor correlated steps into helper methods of up to 3 steps each, unless maintaining a single multi-step method is better for code readability and simplicity.
