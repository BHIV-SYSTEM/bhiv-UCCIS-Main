# Task 33 fix only

This archive contains the existing UCCIS project with only Task 33 runtime fixes applied.

Changes:
1. Task 33 uses `defaultdb` through `.env`.
2. Task 33 MySQL tables are created non-destructively at startup.
3. Task 33 sample data is inserted only when `signals` is empty.
4. Task 33 controllers wait for database initialization before querying.
5. Task 33 API paths use `/v2/task33/...` because Axios already has `/api` in its base URL.
6. Task 33 endpoints are not blocked by the MongoDB request guard.

No existing Task 33 rows are dropped or deleted.
