# Link Shortener - Back-end GraphQL API (TypeScript)

This project is a back-end GraphQL-based API, implemented in TypeScript, for a link shortener site. The API allows users to shorten long URLs and manage their shortened links. It provides features such as instant link shortening, link expiration, monitoring and tracking of visits and requests, link editing, and account registration/login.

## Features

- **Instant Link Shortening:** Users can shorten long URLs quickly within 3 seconds.
- **Link Expiration:** Users can specify the desired lifespan of their shortened links, including options such as one day, one week, one month, six months, or indefinite duration. They can also set a specific date/time for link expiration, considering the UTC time zone.
- **Account Registration/Login:** Users can create an account or log in to their existing account. This allows them to access additional features and view a list of their created links.
- **Forgot Password:** Users can request a password reset if they forget their password. The "Forgot Password" page allows them to initiate the password recovery process.
- **Management Panel:** Authenticated users have access to a management panel where they can view statistics and charts related to their links. They can also see a list of all their created links, with options to edit or delete each link. Deleting a link prompts a modal confirmation dialog, while editing a link opens a modal with options to update the expiration date/time or change the destination URL.

## Technologies Used

The back-end API is built using the following technologies:

Node.js: A JavaScript runtime environment for executing server-side code.
TypeScript: A statically-typed superset of JavaScript that compiles to plain JavaScript code.
GraphQL: A query language for APIs that enables efficient data retrieval and manipulation.
Express: A web application framework for Node.js that simplifies API development.
MongoDB: A NoSQL database used to store user accounts, links, and related data.
JWT: JSON Web Tokens are used for authentication and authorization purposes.
Apollo Server: A GraphQL server implementation that integrates with Express and provides essential features for handling GraphQL requests and responses.

## Installation

To set up the project locally, follow these steps:

- Clone the repository: `git clone https://github.com/BaseMax/MyLinkShortenerGraphQLTS`
- Install the dependencies: `npm install`
- Set up the environment variables (database connection details, JWT secret, etc.) by creating a `.env` file.
- Start the development server: `npm run dev`
- The API will be available at `http://localhost:3000`.
- Feel free to customize the project according to your specific requirements and design preferences.

## Queries

**Get All Links**

- Description: Retrieve a list of all shortened links created by the authenticated user.
- Arguments: None
- Response: List of shortened links

**Get Link by ID**

- Description: Retrieve a specific shortened link by its ID.
- Arguments: id (Link ID)
- Response: Shortened link details

**Get Link Stats**

- Description: Retrieve statistics and visit data for a specific shortened link.
- Arguments: id (Link ID)
- Response: Link statistics and visit data

## Mutations

**Register User**

- Description: Create a new user account.
- Arguments: email, password
- Response: User details and authentication token

**Login**

- Description: Log in to an existing user account.
- Arguments: email, password
- Response: User details and authentication token

**Forgot Password**

- Description: Initiate the password recovery process by sending a password reset email to the user.
- Arguments: email
- Response: Success message

**Reset Password**

- Description: Reset the user's password with a new password after following the password reset link.
- Arguments: resetToken, newPassword
- Response: Success message

**Shorten Link**

- Description: Create a shortened link.
- Arguments: url, expirationDate (optional)
- Response: Shortened link details

**Update Link**

- Description: Update the expiration date of a shortened link.
- Arguments: id (Link ID), expirationDate
- Response: Updated shortened link details

**Delete Link**

- Description: Delete a shortened link.
- Arguments: id (Link ID)
- Response: Success message

These queries and mutations should cover the basic functionality required for a link shortener API. Feel free to modify or expand upon them according to your specific project requirements.

Copyright 2023, Max Base

-------------

اولین پروژه: سیستم و سایت کوتاه کننده لینک

چندین صفحه مختلف میتونه داشته باشه اینکار
زبان پروژه: انگلیسی
سبک: سلیقه طراح و بین المللی

صفحه ها:
صفحه اصلی (امکان ساخت لینک کوتاه حتی برای مهمان وجود داره) در هنگام ساخت لینک از کاربر میشه پرسید  لینک تا چند وقت میخواهید زنده باشه؟ یک روز؟ یک هفته؟ یک ماه؟ شش ماه؟ بی نهایت؟ یا یک تاریخ/ساعت دقیق مشخص که مثلا در 1 شهریور ساعت 9 صبح باطل بشه البته باید شفاف کنیم ساعت به چه تایم زونی هست بهتره به تایم زون UTC باشه اگه نمیدونید utc یا gmt چیه جستجو کنید.
صفحه ورود/ثبت نام (ایمیل و رمز) + بهمراه حالت فوکوس فیلد ها و حالت هایی که مشخص هست مشخصات غلط بوده یا درست بوده و بزودی به پنل هدایت میشی
صفحه فراموشی رمز
صفحه پنل مدیریت با امکان مشاهده نمودار و دیدن لییست کل لینک های کاربر. این رو میشه صفحه مجزا هم زد بستگی داره ولی بنظرم اونقدر چارت و نمودار نداریم که کل صفحه رو پر کنیم. میتونیم بالا رو نمودار پر کنیم و زیر اش لیست لینک ها و برای هر لینک بشه روی ویرایش یا حذف کرد. و وقتی روی حذف میزنیم مودال پرسیدن مطمئن هستید بیاد و روی ویرایش زدند مودال صفحه ویرایش بیاد که بشه تاریخ منقضی شدن رو هم تعیین کرد و همینطور اینکه یک روز/یک هفته/یک ماه/6 ماه/بی نهایت رو تغییر بدیم

مزایا و خاصیت ها:
ساخت لینک کوتاه فوری در 3 ثانیه
امکان مانیتور و ترک کردن تعداد بازدید و درخواست روی لینک های کوتاه
امکان باطل کردن لینک های کوتاه در هر زمان در پنل
امکان تغییر دادن یا ارجاع یک لینک کوتاه به یک لینک جدید در هر زمان (امکان ویرایش لینک)

چرا نیاز به ساخت حساب کاربری یا ورود باشه؟
بخاطر اینکه وقتی حساب کاربری داشته باشی و لینک بسازی همه لینک هایی که میسازی داخل پنل برات لیست و نشون داده میشه
و میتونی ببینی چند تا لینک کلا داره و هر کدوم چقدر بازدید خوردند

