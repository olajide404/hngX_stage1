#  String Analyzer API  
*A RESTful Node.js + Express + PostgreSQL API for analyzing and managing strings*

---

##  Overview

The **String Analyzer API** computes, stores, and retrieves analytical properties of strings.  
Each string’s **SHA-256 hash** uniquely identifies it, ensuring duplicates are never stored twice.

This project was built to demonstrate:
- Full CRUD + analytical computation
- RESTful API design
- Integration with PostgreSQL (no ORM)
- Filtering (structured + natural language)
- Proper error handling and validation

---

## ⚙️ Tech Stack

- **Node.js (v18+)**
- **Express.js**
- **PostgreSQL (v14+)**
- **pg** (PostgreSQL client)
- **dotenv** (environment variables)
- **crypto** (built-in hashing)

---

## 🧩 Features

✅ Analyze and persist string metrics  
✅ Retrieve strings and filter results  
✅ Interpret **natural language queries** (e.g., “all single word palindromic strings”)  
✅ Enforce idempotency (no duplicate strings)  
✅ Delete strings by original value  
✅ Layered architecture (Controller → Service → DB → Utils)

---

