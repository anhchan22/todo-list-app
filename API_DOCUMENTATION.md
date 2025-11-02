# Todo List Backend API Documentation

## Overview

This is a RESTful API for a Todo List application built with Spring Boot. The API provides endpoints for user authentication, task management, category management, and user management.

**Base URL:** `http://localhost:8080`

**Authentication:** JWT Bearer Token

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Task Management](#task-management)
4. [Category Management](#category-management)
5. [Response Format](#response-format)
6. [Data Models](#data-models)
7. [Error Handling](#error-handling)

---

## Authentication

### Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00",
    "role": "USER",
    "tasks": []
  }
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get My Info

**Endpoint:** `GET /api/auth/myInfo`

**Description:** Get current user information

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00",
    "role": "USER",
    "tasks": []
  }
}
```

### Update My Info

**Endpoint:** `PUT /api/auth/myInfo`

**Description:** Update current user information

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john_updated@example.com",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:30:00",
    "role": "USER",
    "tasks": []
  }
}
```

### Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user and invalidate JWT token

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "code": 1000,
  "message": "Logout thành công!",
  "result": null
}
```

---

## User Management

_Note: All user management endpoints require ADMIN role_

### Get User by ID

**Endpoint:** `GET /api/user/{id}`

**Description:** Get user information by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00",
    "role": "USER",
    "tasks": []
  }
}
```

### Update User

**Endpoint:** `PUT /api/user/{id}`

**Description:** Update user information by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "username": "john_doe_updated",
    "email": "john_updated@example.com",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T11:00:00",
    "role": "USER",
    "tasks": []
  }
}
```

### Delete User

**Endpoint:** `DELETE /api/user/{id}`

**Description:** Delete user by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:** `204 No Content`

### Get All Users

**Endpoint:** `GET /api/user/all`

**Description:** Get paginated list of all users

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "content": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00",
        "role": "USER",
        "tasks": []
      }
    ],
    "pageable": {
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```

---

## Task Management

_Note: All task management endpoints require ADMIN role_

### Create Task

**Endpoint:** `POST /api/tasks`

**Description:** Create a new task

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation for the todo list project",
  "dueDate": "2024-01-15",
  "categoryId": 1
}
```

**Response:**

```json
{
  "code": null,
  "message": null,
  "result": {
    "id": 1,
    "user": null,
    "category": {
      "id": 1,
      "name": "Work",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    },
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation for the todo list project",
    "status": "TODO",
    "dueDate": "2024-01-15",
    "priority": null,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### Get Task by ID

**Endpoint:** `GET /api/tasks/{id}`

**Description:** Get task information by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "category": {
      "id": 1,
      "name": "Work"
    },
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation for the todo list project",
    "status": "IN_PROGRESS",
    "dueDate": "2024-01-15",
    "priority": "HIGH",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T11:00:00"
  }
}
```

### Update Task

**Endpoint:** `PUT /api/tasks/{id}`

**Description:** Update task information

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "dueDate": "2024-01-20",
  "status": "DONE",
  "priority": "MEDIUM",
  "categoryId": 1
}
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "category": {
      "id": 1,
      "name": "Work"
    },
    "title": "Updated task title",
    "description": "Updated task description",
    "status": "DONE",
    "dueDate": "2024-01-20",
    "priority": "MEDIUM",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T12:00:00"
  }
}
```

### Delete Task

**Endpoint:** `DELETE /api/tasks/{id}`

**Description:** Delete task by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:** `204 No Content`

### Assign Task to User

**Endpoint:** `PATCH /api/tasks/{taskId}/assignTask`

**Description:** Assign a task to a specific user

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `userId` (required): ID of the user to assign the task to

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "user": {
      "id": 2,
      "username": "jane_doe",
      "email": "jane@example.com"
    },
    "category": {
      "id": 1,
      "name": "Work"
    },
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation for the todo list project",
    "status": "TODO",
    "dueDate": "2024-01-15",
    "priority": "HIGH",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T13:00:00"
  }
}
```
### Unassign Task to User

**Endpoint:** `PATCH /api/tasks/{taskId}/unassignTask`

**Description:** Unassign a task to a specific user

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `userId` (required): ID of the user to assign the task to

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "user": null,
    "category": {
      "id": 1,
      "name": "Work"
    },
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation for the todo list project",
    "status": "TODO",
    "dueDate": "2024-01-15",
    "priority": "HIGH",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T13:00:00"
  }
}
```
### Get All Tasks for User (Admin)

**Endpoint:** `GET /api/tasks/allForUser`

**Description:** Get paginated list of tasks for a specific user

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `userId` (required): ID of the user

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "content": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "username": "john_doe",
          "email": "john@example.com"
        },
        "category": {
          "id": 1,
          "name": "Work"
        },
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation for the todo list project",
        "status": "TODO",
        "dueDate": "2024-01-15",
        "priority": "HIGH",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
      }
    ],
    "pageable": {
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```
### Get All myTasks

**Endpoint:** `GET /api/tasks/myTasks`

**Description:** Get paginated list of tasks for a specific user

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "content": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "username": "john_doe",
          "email": "john@example.com"
        },
        "category": {
          "id": 1,
          "name": "Work"
        },
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation for the todo list project",
        "status": "TODO",
        "dueDate": "2024-01-15",
        "priority": "HIGH",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
      }
    ],
    "pageable": {
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```

### Get All Tasks for Category

**Endpoint:** `GET /api/tasks/allForCategory`

**Description:** Get paginated list of tasks for a specific category

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)
- `categoryId` (required): ID of the category

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "content": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "username": "john_doe",
          "email": "john@example.com"
        },
        "category": {
          "id": 1,
          "name": "Work"
        },
        "title": "Complete project documentation",
        "description": "Write comprehensive API documentation for the todo list project",
        "status": "TODO",
        "dueDate": "2024-01-15",
        "priority": "HIGH",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
      }
    ],
    "pageable": {
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "first": true,
    "numberOfElements": 1,
    "empty": false
  }
}
```

---

## Category Management

_Note: All category management endpoints require ADMIN role_

### Create Category

**Endpoint:** `POST /api/categories`

**Description:** Create a new category

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "Work"
}
```

**Response:**

```json
{
  "code": null,
  "message": null,
  "result": {
    "id": 1,
    "name": "Work",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### Get Category by ID

**Endpoint:** `GET /api/categories/{id}`

**Description:** Get category information by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "name": "Work",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00",
    "tasks": []
  }
}
```

### Update Category

**Endpoint:** `PUT /api/categories/{id}`

**Description:** Update category information

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "Updated Work Category"
}
```

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "id": 1,
    "name": "Updated Work Category",
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T14:00:00",
    "tasks": []
  }
}
```

### Delete Category

**Endpoint:** `DELETE /api/categories/{id}`

**Description:** Delete category by ID

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:** `204 No Content`

### Get All Categories

**Endpoint:** `GET /api/categories/all`

**Description:** Get paginated list of all categories

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 0)
- `size` (optional): Page size (default: 10)

**Response:**

```json
{
  "code": 1000,
  "message": null,
  "result": {
    "content": [
      {
        "id": 1,
        "name": "Work",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00",
        "tasks": []
      },
      {
        "id": 2,
        "name": "Personal",
        "createdAt": "2024-01-01T11:00:00",
        "updatedAt": "2024-01-01T11:00:00",
        "tasks": []
      }
    ],
    "pageable": {
      "sort": {
        "empty": true,
        "sorted": false,
        "unsorted": true
      },
      "offset": 0,
      "pageNumber": 0,
      "pageSize": 10,
      "paged": true,
      "unpaged": false
    },
    "last": true,
    "totalElements": 2,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "first": true,
    "numberOfElements": 2,
    "empty": false
  }
}
```

---

## Response Format

All API responses follow a consistent format:

```json
{
  "code": 1000,
  "message": "Optional message",
  "result": {
    // Response data
  }
}
```

### Response Fields

- `code`: Integer status code (1000 for success, null for some endpoints)
- `message`: Optional string message
- `result`: The actual response data (can be null)

**Note:** Some endpoints (like `POST /api/tasks` and `POST /api/categories`) return responses with `code: null` and `message: null`.

---

## Data Models

### User Model

```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "role": "string (ADMIN|USER)",
  "tasks": "array of Task objects"
}
```

### Task Model

```json
{
  "id": "integer",
  "user": "User object",
  "category": "Category object",
  "title": "string",
  "description": "string",
  "status": "enum (CANCELED|TODO|IN_PROGRESS|DONE)",
  "dueDate": "date (YYYY-MM-DD)",
  "priority": "enum (LOW|MEDIUM|HIGH|URGENT)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Category Model

```json
{
  "id": "integer",
  "name": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "tasks": "array of Task objects"
}
```

### Task Status Enum

- `CANCELED`: Task has been canceled
- `TODO`: Task is pending
- `IN_PROGRESS`: Task is currently being worked on
- `DONE`: Task has been completed

### Task Priority Enum

- `LOW`: Low priority task
- `MEDIUM`: Medium priority task
- `HIGH`: High priority task
- `URGENT`: Urgent priority task

---

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### JWT Token Format

The login endpoint returns a single JWT token that should be used for all authenticated requests.

---

## Error Handling

### Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Request successful, no content returned
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Response Format

```json
{
  "code": 4001,
  "message": "Error description",
  "result": null
}
```

---

## Development Setup

1. **Prerequisites:**

   - Java 17 or higher
   - Maven 3.6 or higher
   - MySQL/PostgreSQL database

2. **Configuration:**

   - Update `application.properties` with your database credentials
   - Configure JWT secret keys

3. **Running the Application:**

   ```bash
   mvn spring-boot:run
   ```

4. **API Base URL:**
   ```
   http://localhost:8080
   ```

---

## Testing

You can test the API endpoints using tools like:

- Postman
- cURL
- Insomnia
- Any HTTP client

### Example cURL Commands

**Register a new user:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

**Create a task (with authentication):**

```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Test task",
    "description": "This is a test task",
    "dueDate": "2024-01-15",
    "categoryId": 1
  }'
```

---