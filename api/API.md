# MacroZone API Documentation

| | |
|---|---|
| **Base URL** | `https://macrozone.onrender.com/api/v1` |
| **Content-Type** | `application/json` *(unless noted)* |
| **Apidog Docs** | https://ojlfli5ui7.apidog.io |

---

## Response Format

All endpoints return a consistent envelope:

```json
{
  "error": false,
  "message": "Human-readable status message",
  "data": { }
}
```

| Field | Type | Description |
|---|---|---|
| `error` | `boolean` | `false` on success, `true` on failure |
| `message` | `string` | Status description |
| `data` | `any` | Payload (omitted on some success responses) |

---

## Authentication

Protected routes require an **access token** in the Authorization header:

```
Authorization: Bearer <accessToken>
```

Token lifetimes (configurable via `.env`):
- Access token: `15m` (default)
- Refresh token: `30d` (default)

---

## Auth

### POST `/auth/sign-up`

Register a new user and receive tokens.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Display name |
| `email` | `string` | ✅ | Valid email address |
| `password` | `string` | ✅ | Minimum 6 characters |
| `dailyCalorieGoal` | `integer` | ❌ | Default: `2000` |
| `dailyProteinGoal` | `integer` | ❌ | Default: `150` |
| `dailyCarbsGoal` | `integer` | ❌ | Default: `250` |
| `dailyFatGoal` | `integer` | ❌ | Default: `65` |

**201 Created**

```json
{
  "error": false,
  "message": "User has been created successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alex Rivera",
      "email": "alex@example.com",
      "avatarUrl": null,
      "avatarPublicId": null,
      "dailyCalorieGoal": 2000,
      "dailyProteinGoal": 150,
      "dailyCarbsGoal": 250,
      "dailyFatGoal": 65,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "<jwt>",
      "refreshToken": "<jwt>"
    }
  }
}
```

**400 Bad Request** — email already in use or validation error  
**500 Internal Server Error** — failed to create user

---

### POST `/auth/login`

Authenticate an existing user.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `email` | `string` | ✅ |
| `password` | `string` | ✅ |

**200 OK**

```json
{
  "error": false,
  "message": "User has been logged in successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alex Rivera",
      "email": "alex@example.com",
      "avatarUrl": null,
      "dailyCalorieGoal": 2000,
      "dailyProteinGoal": 150,
      "dailyCarbsGoal": 250,
      "dailyFatGoal": 65,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "tokens": {
      "accessToken": "<jwt>",
      "refreshToken": "<jwt>"
    }
  }
}
```

**401 Unauthorized** — invalid email or password

---

### POST `/auth/refresh`

Rotate tokens. Send the **refresh token** as the Bearer token.

**Headers:**

```
Authorization: Bearer <refreshToken>
```

**Request body:** _(empty)_

**200 OK**

```json
{
  "error": false,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "<new-jwt>",
    "refreshToken": "<new-jwt>"
  }
}
```

**401 Unauthorized** — invalid, expired, or already-rotated refresh token

---

### POST `/auth/logout`

Revoke the current access token and optionally invalidate the refresh token session.

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `refreshToken` | `string` | ❌ | If provided, only this session is removed. If omitted, **all** sessions for the user are cleared. |

**200 OK**

```json
{
  "error": false,
  "message": "User has been logged out successfully"
}
```

---

## Users

> 🔒 All `/users` endpoints require `Authorization: Bearer <accessToken>`

### GET `/users/profile`

Get the authenticated user's profile.

**200 OK**

```json
{
  "error": false,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Alex Rivera",
    "email": "alex@example.com",
    "avatarUrl": "https://res.cloudinary.com/...",
    "avatarPublicId": "user_pictures/...",
    "dailyCalorieGoal": 2000,
    "dailyProteinGoal": 150,
    "dailyCarbsGoal": 250,
    "dailyFatGoal": 65,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### PATCH `/users/profile`

Update name and/or daily macro goals.

**Request body** _(all fields optional)_:

| Field | Type | Description |
|---|---|---|
| `name` | `string` | 2–100 characters |
| `dailyCalorieGoal` | `integer` | ≥ 0 |
| `dailyProteinGoal` | `integer` | ≥ 0 |
| `dailyCarbsGoal` | `integer` | ≥ 0 |
| `dailyFatGoal` | `integer` | ≥ 0 |

**200 OK**

```json
{
  "error": false,
  "message": "Profile updated successfully",
  "data": { "...updatedUser" }
}
```

---

### PATCH `/users/change-password`

Change the user's password. Invalidates **all active sessions** on success.

**Request body:**

| Field | Type | Required |
|---|---|---|
| `currentPassword` | `string` | ✅ |
| `newPassword` | `string` | ✅ — min 6 chars |

**200 OK**

```json
{
  "error": false,
  "message": "Password changed successfully"
}
```

**400 Bad Request** — current password is incorrect

---

### PATCH `/users/profile-picture`
### PUT `/users/profile-picture`
### PATCH `/users/avatar`
### PUT `/users/avatar`

Upload or replace the profile picture. Automatically deletes the previous image from Cloudinary.

**Content-Type:** `multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `avatar` **or** `profilePicture` | `File` (image) | ✅ |

Accepted types: `image/jpeg`, `image/png`, `image/gif`  
Max size: `10 MB` (configurable via `MAX_FILE_SIZE`)

**200 OK**

```json
{
  "error": false,
  "message": "Profile picture updated successfully",
  "data": {
    "id": "uuid",
    "name": "Alex Rivera",
    "avatarUrl": "https://res.cloudinary.com/...",
    "avatarPublicId": "user_pictures/...",
    "dailyCalorieGoal": 2000,
    "dailyProteinGoal": 150,
    "dailyCarbsGoal": 250,
    "dailyFatGoal": 65,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**400 Bad Request** — no file provided or invalid file type

---

### DELETE `/users/profile`

Permanently delete the account. Removes the Cloudinary avatar and all sessions.

**200 OK**

```json
{
  "error": false,
  "message": "Profile deleted successfully"
}
```

---

## Meals

> 🔒 All `/meals` endpoints require `Authorization: Bearer <accessToken>`

### GET `/meals`

List the authenticated user's meals (paginated).

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | `integer` | `1` | Page number (≥ 1) |
| `limit` | `integer` | `10` | Items per page (1–100) |

**200 OK**

```json
{
  "error": false,
  "message": "Meals retrieved successfully",
  "data": {
    "records": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "Chicken & Rice",
        "calories": 550,
        "protein": 45,
        "carbs": 60,
        "fat": 10,
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

---

### GET `/meals/:id`

Get a single meal by ID (must belong to the authenticated user).

**Path params:**

| Param | Type | Description |
|---|---|---|
| `id` | `UUID` | Meal ID |

**200 OK**

```json
{
  "error": false,
  "message": "Meal retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Chicken & Rice",
    "calories": 550,
    "protein": 45,
    "carbs": 60,
    "fat": 10,
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**404 Not Found** — meal doesn't exist or belongs to another user

---

### POST `/meals`

Create a new meal.

**Request body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | ✅ | Meal name |
| `calories` | `integer` | ✅ | ≥ 0 |
| `protein` | `integer` | ❌ | Default: `0` |
| `carbs` | `integer` | ❌ | Default: `0` |
| `fat` | `integer` | ❌ | Default: `0` |

**201 Created**

```json
{
  "error": false,
  "message": "Meal created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Oatmeal",
    "calories": 300,
    "protein": 10,
    "carbs": 54,
    "fat": 5,
    "createdAt": "2024-01-01T08:00:00.000Z"
  }
}
```

---

### PATCH `/meals/:id`

Update a meal (must belong to the authenticated user).

**Path params:**

| Param | Type | Description |
|---|---|---|
| `id` | `UUID` | Meal ID |

**Request body** _(all optional, at least one required)_:

| Field | Type |
|---|---|
| `name` | `string` |
| `calories` | `integer ≥ 0` |
| `protein` | `integer ≥ 0` |
| `carbs` | `integer ≥ 0` |
| `fat` | `integer ≥ 0` |

**200 OK**

```json
{
  "error": false,
  "message": "Meal updated successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Oatmeal with Berries",
    "calories": 350,
    "protein": 12,
    "carbs": 60,
    "fat": 6,
    "createdAt": "2024-01-01T08:00:00.000Z"
  }
}
```

**404 Not Found** — meal doesn't exist or belongs to another user

---

### DELETE `/meals/:id`

Delete a single meal (must belong to the authenticated user).

**Path params:**

| Param | Type | Description |
|---|---|---|
| `id` | `UUID` | Meal ID |

**200 OK**

```json
{
  "error": false,
  "message": "Meal deleted successfully"
}
```

**404 Not Found** — meal doesn't exist or belongs to another user

---

## Error Reference

| HTTP Status | When |
|---|---|
| `400 Bad Request` | Validation failure, bad input |
| `401 Unauthorized` | Missing / invalid / expired / revoked token |
| `404 Not Found` | Resource doesn't exist or access denied |
| `500 Internal Server Error` | Unexpected server error |

**Error response shape:**

```json
{
  "error": true,
  "message": "Description of what went wrong"
}
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `TOKEN_SECRET` | ✅ | JWT signing secret |
| `SECRET_KEY` | ✅ | HMAC-SHA256 secret for refresh token hashing |
| `STORED_SALT` | ❌ | Optional bcrypt stored salt |
| `ACCESS_TOKEN_EXPIRES` | ❌ | Default `15m` |
| `REFRESH_TOKEN_EXPIRES` | ❌ | Default `30d` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `PORT` | ❌ | Default `3000` |
| `MAX_FILE_SIZE` | ❌ | Default `10485760` (10 MB) |

