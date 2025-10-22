# 🧩 String Analyzer API

The **String Analyzer API** is a RESTful service that analyzes strings, computes their properties, and stores them in a PostgreSQL database. Built with **Node.js**, **Express**, and **PostgreSQL**, this project provides multiple endpoints to analyze, retrieve, filter, and delete strings.

---

## 🚀 Setup Instructions

1. **Install Node.js (v18 or later)**  
   Download from [https://nodejs.org](https://nodejs.org)  
   Verify installation:  
   ```bash
   node -v
   npm -v
````

2. **Install PostgreSQL (v14 or later)**
   Download from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
   Start the PostgreSQL service, then create a database:

   ```bash
   psql -U postgres
   CREATE DATABASE databasename;
   \q
   ```

   *(Optional)* Create a dedicated user:

   ```sql
   CREATE USER strings_user WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE stringsdb TO strings_user;
   ```

3. **Clone or initialize the project**

   ```bash
   mkdir string-analyzer-api
   cd string-analyzer-api
   npm init -y
   ```

4. **Install dependencies**

   ```bash
   npm install express pg dotenv
   ```

5. **Create environment configuration**
   In the root directory, create a `.env` file with the following values:

   ```
   DATABASE_URL=postgres://postgres:yourpassword@localhost:5432/databasename
   PORT=3000
   BODY_LIMIT_BYTES=262144
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX=60
   ```

6. **Run the database migration**

   ```bash
   npm run migrate
   ```

   This creates the `strings` table in your database.

7. **Start the server**

   ```bash
   npm run dev
   ```

   The API will start on:
   `http://localhost:3000`

8. **Test the health check**

   ```bash
   curl http://localhost:3000/health
   ```

   Expected response:

   ```json
   { "status": "ok" }
   ```

---

## 🧱 Endpoints Overview

### 1️⃣ Create / Analyze String

**POST /strings**

**Request Body:**

```json
{ "value": "string to analyze" }
```

**Success Response (201 Created):**

```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": { "s": 2, "t": 3, "r": 2 }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Responses:**

| Code | Description                       |
| ---- | --------------------------------- |
| 400  | Invalid body or missing `"value"` |
| 409  | String already exists             |
| 422  | `"value"` must be a string        |

---

### 2️⃣ Get Specific String

**GET /strings/{string_value}**

**Success Response (200 OK):**

```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": { /* same as above */ },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Response:**
`404 Not Found` — String not found in system.

---

### 3️⃣ Get All Strings with Filtering

**GET /strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a**

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { /* ... */ },
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

**Error Response:**
`400 Bad Request` — Invalid query parameters.

---

### 4️⃣ Natural Language Filtering

**GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings**

**Success Response (200 OK):**

```json
{
  "data": [ /* matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Example Queries to Support:**

| Query                                              | Interpretation                           |
| -------------------------------------------------- | ---------------------------------------- |
| "all single word palindromic strings"              | word_count=1, is_palindrome=true         |
| "strings longer than 10 characters"                | min_length=11                            |
| "palindromic strings that contain the first vowel" | is_palindrome=true, contains_character=a |
| "strings containing the letter z"                  | contains_character=z                     |

**Error Responses:**

| Code | Description                            |
| ---- | -------------------------------------- |
| 400  | Unable to parse natural language query |
| 422  | Conflicting filters parsed             |

---

### 5️⃣ Delete String

**DELETE /strings/{string_value}**

**Success Response (204 No Content):**
Empty body.

**Error Response:**
`404 Not Found` — String does not exist.

---

## ⚙️ Environment Variables

| Variable               | Description                        | Example                                                 |
| ---------------------- | ---------------------------------- | ------------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string       | `postgres://postgres:password@localhost:5432/stringsdb` |
| `PORT`                 | Port to run the server             | `3000`                                                  |
| `BODY_LIMIT_BYTES`     | Max request body size (bytes)      | `262144`                                                |
| `RATE_LIMIT_WINDOW_MS` | Duration of rate limit window (ms) | `60000`                                                 |
| `RATE_LIMIT_MAX`       | Max requests per IP per window     | `60`                                                    |

---

## 🧠 Dependencies

| Package     | Description                                    |
| ----------- | ---------------------------------------------- |
| **express** | Web framework for routing and request handling |
| **pg**      | PostgreSQL client for Node.js                  |
| **dotenv**  | Loads environment variables from `.env`        |

Install all dependencies:

```bash
npm install express pg dotenv
```

---

## ▶️ Run Locally

1. **Run migration**

   ```bash
   npm run migrate
   ```
2. **Start the server**

   ```bash
   npm run dev
   ```
3. **Access the API**

   ```
   http://localhost:3000
   ```

You’re ready to test all endpoints using **Postman** or **curl**.

---

## ✅ Summary

This project fulfills the full REST API requirements by allowing you to:

* Create and analyze strings (`POST /strings`)
* Retrieve specific strings (`GET /strings/{value}`)
* Filter stored strings (`GET /strings?...`)
* Parse natural language queries (`GET /strings/filter-by-natural-language`)
* Delete strings (`DELETE /strings/{value}`)

Each analyzed string is stored uniquely using its SHA-256 hash. The API supports structured JSON responses, error handling, and efficient querying — built cleanly with Node, Express, and PostgreSQL.

```
```
