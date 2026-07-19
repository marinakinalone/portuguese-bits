# Portuguese Bits — Frontend API Reference

**Base URL:** your deployed server root (e.g. `https://your-api.vercel.app`)  
**Auth header:** `Authorization: Bearer <token>` (from `POST /auth/login`)

---

## Quick start (frontend summary)

### 1. Auth

```ts
// Register (once)
POST /auth/register  { username, password }

// Login → store token (localStorage / secure storage)
POST /auth/login     { username, password }  →  { token }

// On app load (if token exists)
GET /auth/me         Authorization: Bearer <token>
→ { username, quizStreak, lastQuizCompletedDate, completedToday }
```

- Token expires after **1 hour** → redirect to login on `401`/`403`.
- Send `Authorization: Bearer <token>` on all authenticated requests.

### 2. Vocab list page

```ts
GET /vocab   Authorization: Bearer <token>
```

Show each word with a **"learned"** badge when `isLearned === true && excludeFromQuiz === false`.

### 3. Quiz flow

```ts
// Start quiz
GET /vocab/10   Authorization: Bearer <token>

// After each answer
POST /vocab/progress/:wordId   { correct: boolean }
// → collect items where newlyLearned === true

// End of quiz (in order)
POST /vocab/quiz/complete                    // daily streak
POST /vocab/progress/:wordId/confirm         // per newlyLearned word
  { action: "keep" | "remove" }
```

### 4. Streak display (header / home)

Use `GET /auth/me` or `GET /vocab/quiz/streak` — both return `quizStreak` and `completedToday`.

| Streak type                           | What it tracks                                 | Where                         |
| ------------------------------------- | ---------------------------------------------- | ----------------------------- |
| **Daily quiz streak** (`quizStreak`)  | Consecutive days finishing a quiz              | User profile / header         |
| **Per-word streak** (`successStreak`) | Correct answers in a row for one word (max 10) | Per word in quiz & vocab list |

### 5. Key UI rules

| Scenario                         | Frontend action                                                       |
| -------------------------------- | --------------------------------------------------------------------- |
| Word reaches 10 correct in a row | End-of-quiz popup: _"You have successfully learned [pt]"_             |
| User taps **Keep**               | `confirm` with `"keep"` → show "learned" badge, word stays in quizzes |
| User taps **Remove**             | `confirm` with `"remove"` → word hidden from future quizzes           |
| User finishes quiz               | `POST /vocab/quiz/complete` once per session                          |
| Token missing on quiz            | Block quiz or prompt login (progress won't save)                      |

---

## Authentication

| Method | Path             | Auth | Body                                         | Response                                 |
| ------ | ---------------- | ---- | -------------------------------------------- | ---------------------------------------- |
| POST   | `/auth/register` | No   | `{ "username": string, "password": string }` | `{ "success": true, "message": string }` |
| POST   | `/auth/login`    | No   | `{ "username": string, "password": string }` | `{ "success": true, "token": string }`   |
| GET    | `/auth/me`       | Yes  | —                                            | `UserProfile`                            |

```ts
type UserProfile = {
  username: string;
  quizStreak: number;
  lastQuizCompletedDate: string | null; // "YYYY-MM-DD" UTC
  completedToday: boolean;
};
```

- JWT expires in **1 hour**.
- Invalid/missing token on protected routes: `401` or `403`.

---

## Vocabulary

### List & quiz sampling

| Method | Path                    | Auth     | Response                      |
| ------ | ----------------------- | -------- | ----------------------------- |
| GET    | `/vocab`                | Optional | `VocabWord[]`                 |
| GET    | `/vocab/:numberOfWords` | Optional | `VocabWord[]` (random sample) |
| GET    | `/vocab/demo`           | No       | `VocabWord[]` (fixed demo set)|

When authenticated, each word includes progress fields. Unauthenticated responses only include `_id`, `pt`, `fr`.

`GET /vocab/:numberOfWords` excludes words where the user chose **remove** after learning (`excludeFromQuiz: true`). May return fewer words than requested if the pool is small.

`GET /vocab/demo` returns a curated public demo list (`_id`, `pt`, `fr` only). Register this route **before** `/vocab/:numberOfWords` so `"demo"` is not treated as a count. The demo frontend samples quiz words client-side from this list.

### CRUD (admin)

| Method | Path            | Auth | Body                             | Response      |
| ------ | --------------- | ---- | -------------------------------- | ------------- |
| POST   | `/vocab/create` | Yes  | `{ "pt": string, "fr": string }` | created word  |
| PUT    | `/vocab/:fr`    | Yes  | `{ "pt": string, "fr": string }` | updated word  |
| DELETE | `/vocab/:fr`    | Yes  | —                                | delete result |

Note: update/delete use French translation (`fr`) as the URL key. Progress endpoints use MongoDB `_id`.

---

## Per-word progress (learning streak)

Tracks how many times in a row the user has correctly translated a specific word in quizzes. **10 correct answers in a row** marks the word as learned.

| Method | Path                              | Auth | Body                               | Response                                |
| ------ | --------------------------------- | ---- | ---------------------------------- | --------------------------------------- |
| GET    | `/vocab/progress`                 | Yes  | —                                  | `WordProgress[]`                        |
| POST   | `/vocab/progress/:wordId`         | Yes  | `{ "correct": boolean }`           | `VocabWord & { newlyLearned: boolean }` |
| POST   | `/vocab/progress/:wordId/confirm` | Yes  | `{ "action": "keep" \| "remove" }` | `VocabWord`                             |

### Word progress rules

| Event              | `successStreak` | `isLearned`                     | `excludeFromQuiz` |
| ------------------ | --------------- | ------------------------------- | ----------------- |
| Correct answer     | +1 (max 10)     | `true` at 10                    | unchanged         |
| Wrong answer       | reset to 0      | stays `true` if already learned | unchanged         |
| Confirm **keep**   | stays at 10     | `true`                          | `false`           |
| Confirm **remove** | stays at 10     | `true`                          | `true`            |

- `newlyLearned: true` only on the request where streak **first** reaches 10.
- **"Learned" badge** on vocab list: `isLearned === true && excludeFromQuiz === false`.

### Types

```ts
type VocabWord = {
  _id: string;
  pt: string;
  fr: string;
  successStreak?: number; // 0–10, only when authenticated
  isLearned?: boolean;
  excludeFromQuiz?: boolean;
};

type WordProgress = {
  wordId: string;
  pt: string;
  fr: string;
  successStreak: number;
  isLearned: boolean;
  excludeFromQuiz: boolean;
  learnedAt: string | null;
};
```

### Per-word quiz flow

1. `GET /vocab/10` with Bearer token.
2. After each answer: `POST /vocab/progress/:wordId` with `{ correct: boolean }`.
3. Collect responses where `newlyLearned === true`.
4. End of quiz: popup _"You have successfully learned [word.pt]"_ → `POST /vocab/progress/:wordId/confirm`.
5. Vocab list: `GET /vocab` with token; show **"learned"** badge when `isLearned && !excludeFromQuiz`.

---

## Daily quiz streak (user)

Tracks consecutive **calendar days** on which the user finishes at least one full quiz. Separate from per-word `successStreak`.

| Method | Path                   | Auth | Body | Response             |
| ------ | ---------------------- | ---- | ---- | -------------------- |
| GET    | `/vocab/quiz/streak`   | Yes  | —    | `QuizStreak`         |
| POST   | `/vocab/quiz/complete` | Yes  | —    | `QuizStreakComplete` |

### Types

```ts
type QuizStreak = {
  quizStreak: number; // effective streak (0 if broken)
  lastQuizCompletedDate: string | null; // "YYYY-MM-DD" UTC
  completedToday: boolean;
};

type QuizStreakComplete = {
  quizStreak: number;
  lastQuizCompletedDate: string; // "YYYY-MM-DD" UTC
  alreadyCompletedToday: boolean; // true if quiz already counted today
  completedToday: true;
};
```

### Daily streak rules

- Call `POST /vocab/quiz/complete` once when the user **finishes** a quiz (all questions answered).
- **First completion ever** or **after missing a day** → `quizStreak = 1`.
- **Completed yesterday** and completes again today → `quizStreak + 1`.
- **Multiple completions same day** → idempotent; `alreadyCompletedToday: true`, streak unchanged.
- **Missed a day** (last completion was 2+ days ago) → `GET` returns `quizStreak: 0` until next completion, which resets to `1`.
- Streak is still shown on `GET` if last completion was **today or yesterday** (user has until end of today to continue).

Dates use **UTC calendar days** (`YYYY-MM-DD`).

### Daily streak frontend flow

1. On app load: `GET /auth/me` for username + daily streak in header.
2. On quiz screen load: `GET /vocab/quiz/streak` (optional if `/auth/me` was just called).
3. When user finishes all quiz questions: `POST /vocab/quiz/complete`.
4. Use response to update streak UI; show celebration if `alreadyCompletedToday === false` and streak increased.
5. If `quizStreak === 0` on GET but `lastQuizCompletedDate` was yesterday, prompt user to complete today's quiz to keep the streak.

### Full end-of-quiz sequence

1. User answers last question → `POST /vocab/progress/:wordId` for that word.
2. `POST /vocab/quiz/complete` → update daily streak.
3. For each word with `newlyLearned` collected during session → show learned popup → `POST /vocab/progress/:wordId/confirm`.

---

## Error responses

| Status | When                                                                        |
| ------ | --------------------------------------------------------------------------- |
| 400    | Invalid body (missing fields, wrong `action`, word not learned for confirm) |
| 401    | Invalid or expired token                                                    |
| 403    | Missing token on protected route                                            |
| 404    | Word or user not found                                                      |
| 500    | Server error                                                                |

Errors are JSON: `{ "error": string }` or `{ "success": false, "message": string }` (auth routes).
