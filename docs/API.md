# EdSecure Hub — RESTful API Specification

The EdSecure Hub API adheres to clean REST conventions, JSON request/response payloads, secure HTTP-only cookies, and structured error responses.

---

## 1. Response Standard

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Human readable, non-leaking error description",
    "details": { ... }
  }
}
```

---

## 2. Authentication Endpoints

### `POST /api/auth/register`
Creates a public citizen account.
- **Body**: `{ fullName, email, password, phone }`
- **Response**: `{ success: true, data: { user, token } }`
- Sets `edsecure_auth_session` HTTP-only cookie.

### `POST /api/auth/login`
Authenticates credentials.
- **Body**: `{ email, password }`
- **Response**: `{ success: true, data: { user, token } }`

### `GET /api/auth/me`
Retrieves current authenticated session profile.
- **Headers**: Session cookie or Bearer token
- **Response**: `{ success: true, data: { user } }`

### `POST /api/auth/logout`
Terminates session and clears HTTP-only cookie.

---

## 3. Incident Complaint Endpoints

### `POST /api/complaints`
Lodges a new cybercrime incident complaint (6-step guided reporting intake).
- **Body**:
  ```json
  {
    "incidentType": "Financial Fraud",
    "incidentDate": "2026-10-02T10:00:00Z",
    "platformService": "Telegram / Fake App",
    "description": "Victim was coerced into transferring funds via malicious QR collect request...",
    "financialLoss": 4500.00,
    "currency": "USD",
    "suspectContact": "+1 (800) 555-0193",
    "suspectIdentifier": "Wallet 0x71C...b9F",
    "victimName": "David Miller",
    "victimEmail": "victim@example.com",
    "victimPhone": "+1 (555) 234-5678",
    "victimState": "New York",
    "victimCity": "New York",
    "isAnonymous": false,
    "priority": "HIGH"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "complaintId": "uuid",
      "referenceId": "ED-2026-84920",
      "rawPin": "8492",
      "status": "SUBMITTED",
      "createdAt": "2026-10-02T10:00:00Z"
    }
  }
  ```

### `POST /api/complaints/track`
Public tracking lookup using Reference ID and PIN.
- **Body**: `{ "referenceId": "ED-2026-84920", "pin": "8492" }`
- **Response**: Returns public status timeline, incident category, and phase recommendations. Strictly redacts internal officer communications.

### `GET /api/complaints/:id`
Retrieves single complaint details for authorized complainant or officer.

### `POST /api/complaints/:id/evidence`
Ingests digital evidence files (PNG, JPG, WEBP, PDF, max 10MB).
- **Form-Data**: `file` (binary), `notes` (string)
- **Response**: Computes SHA-256 hash, stores in private vault, generates temporary signed streaming token.

---

## 4. Cyber-Cell Authority Endpoints (Gated: AUTHORITY, ADMIN)

### `GET /api/authority/complaints`
Case queue with multi-dimensional filtering, search, and pagination.
- **Query Params**: `status`, `priority`, `incidentType`, `search`, `limit`, `offset`

### `GET /api/authority/complaints/:id`
Unredacted case dossier including statement of facts, full complainant profile, evidence vault items, officer internal notes journal, and audit history.

### `POST /api/authority/complaints/:id/status`
Executes validated status transition.
- **Body**: `{ "newStatus": "INVESTIGATION", "reason": "Freeze warrant sent to payment gateway.", "isPublic": true }`
- Publishes `ComplaintStatusChanged` domain event.

### `POST /api/authority/complaints/:id/assign`
Assigns or reassigns case to cyber investigator.
- **Body**: `{ "assigneeId": "uuid" }`

### `POST /api/authority/complaints/:id/notes`
Logs confidential internal investigation note.
- **Body**: `{ "note": "...", "visibility": "INTERNAL" | "AUTHORITY_ONLY" }`

### `GET /api/authority/stats`
Telemetry metrics: Total lodged cases, pending triage, under investigation, total financial loss, and critical count.

---

## 5. Knowledge & Safety Radar Endpoints

### `GET /api/knowledge`
Search articles and filter by category.
- **Query Params**: `category`, `search`

### `GET /api/knowledge/:slug`
Retrieves complete article markdown content and related articles.

### `GET /api/safety/stations`
Find designated cyber police stations.
- **Query Params**: `lat`, `lng` (computes distance using Haversine formula)

### `GET /api/health`
Observability liveness and readiness probe.
