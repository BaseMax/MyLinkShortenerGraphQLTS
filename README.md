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

## Models

```typescript
// User model
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  createdAt: Date;
}

// Link model
interface Link {
  id: string;
  userId: string;
  alias: string;
  destinationUrl: string;
  shortUrl: string;
  expirationDate: Date | null;
  createdAt: Date;
}

// Visit model
interface Visit {
  id: string;
  linkId: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  timestamp: Date;
}

// Search query input
interface SearchInput {
  query: string;
}

// GetPopularLinks query input
interface GetPopularLinksInput {
  limit: number;
}

// GetTopReferrers query input
interface GetTopReferrersInput {
  linkId: string;
  limit: number;
}

// UpdateLinkAlias mutation input
interface UpdateLinkAliasInput {
  id: string;
  newAlias: string;
}

// ToggleLinkActivation mutation input
interface ToggleLinkActivationInput {
  id: string;
  active: boolean;
}

// UpdateUserProfile mutation input
interface UpdateUserProfileInput {
  name: string;
  avatar: string;
}

// GenerateQRCode mutation input
interface GenerateQRCodeInput {
  id: string;
}

// GetLinkByShortenedUrl query input
interface GetLinkByShortenedUrlInput {
  shortUrl: string;
}

// GetVisitsByLink query input
interface GetVisitsByLinkInput {
  id: string;
}

// UpdateLinkDestinationUrl mutation input
interface UpdateLinkDestinationUrlInput {
  id: string;
  newUrl: string;
}

// CreateCustomShortenedLink mutation input
interface CreateCustomShortenedLinkInput {
  url: string;
  alias: string;
  expirationDate?: Date;
}

// EditLinkExpiration mutation input
interface EditLinkExpirationInput {
  id: string;
  expirationDate: Date;
}

// TrackLinkVisit mutation input
interface TrackLinkVisitInput {
  id: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
}

// DeleteUserAccount mutation input
interface DeleteUserAccountInput {
  // No additional input required
}
```

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

**Get Link by Shortened URL**

- Description: Retrieve a specific shortened link by its shortened URL.
- Arguments: shortUrl (Shortened URL)
- Response: Shortened link details

**Get User Links**

- Description: Retrieve a list of shortened links created by the authenticated user.
- Arguments: None
- Response: List of shortened links created by the user

**Get Link Visits**

- Description: Retrieve the visit history for a specific shortened link.
- Arguments: id (Link ID)
-Response: List of visits and their details for the link

**Search Links**

- Description: Search for shortened links based on specific criteria, such as keywords in the destination URL or link alias.
- Arguments: query (Search query)
- Response: List of matching shortened links

**Get Popular Links**

- Description: Retrieve a list of popular or most visited shortened links.
- Arguments: limit (Number of links to retrieve)
- Response: List of popular shortened links

**Get Top Referrers**

- Description: Retrieve the top referrers for a specific shortened link, indicating the sources from which the link was accessed.
- Arguments: id (Link ID), limit (Number of top referrers to retrieve)
- Response: List of top referrers for the link

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

**Update Link Destination URL**

- Description: Update the destination URL of a shortened link.
- Arguments: id (Link ID), newUrl (New destination URL)
- Response: Updated shortened link details

**Create Custom Shortened Link**

- Description: Create a shortened link with a custom alias.
- Arguments: url, alias (Custom alias), expirationDate (optional)
- Response: Shortened link details

**Edit Link Expiration**

- Description: Edit the expiration settings of a shortened link.
- Arguments: id (Link ID), expirationDate (New expiration date)
- Response: Updated shortened link details

**Track Link Visit**

- Description: Track a visit to a shortened link.
- Arguments: id (Link ID), referrer (Referring URL), userAgent (User agent string), ipAddress (IP address)
- Response: Visit details

**Delete User Account**

- Description: Delete the authenticated user's account.
- Arguments: None
- Response: Success message

**Update Link Alias**

- Description: Update the alias of a shortened link.
- Arguments: id (Link ID), newAlias (New alias)
- Response: Updated shortened link details

**Toggle Link Activation**

- Description: Activate or deactivate a shortened link to make it accessible or temporarily unavailable.
- Arguments: id (Link ID), active (Boolean indicating activation status)
- Response: Updated shortened link details

**Update User Profile**

- Description: Update the user's profile information, such as name, avatar, or any other relevant details.
- Arguments: name (User's name), avatar (URL of the user's avatar)
- Response: Updated user profile details

**Generate QR Code**

- Description: Generate a QR code for a specific shortened link, allowing users to easily scan and access the link using their mobile devices.
- Arguments: id (Link ID)
- Response: Generated QR code image data or URL

**Get User Profile**

- Description: Retrieve the profile information of the authenticated user.
- Arguments: None
- Response: User profile details

These queries and mutations should cover the basic functionality required for a link shortener API. Feel free to modify or expand upon them according to your specific project requirements.

## GraphQL Examples

**Get All Links**

```graphql
query {
  getAllLinks {
    id
    alias
    destinationUrl
    shortUrl
    expirationDate
    createdAt
  }
}
```

**Get Link by ID**

```graphql
query {
  getLink(id: "your-link-id") {
    id
    alias
    destinationUrl
    shortUrl
    expirationDate
    createdAt
  }
}
```

**Get Link Stats**

```graphql
query {
  getLinkStats(id: "your-link-id") {
    link {
      id
      alias
      destinationUrl
      shortUrl
      expirationDate
      createdAt
    }
    visits {
      id
      referrer
      userAgent
      ipAddress
      timestamp
    }
    totalVisits
  }
}
```

**Get Link by Shortened URL**

```graphql
query {
  getLinkByShortenedUrl(shortUrl: "your-shortened-url") {
    id
    alias
    destinationUrl
    shortUrl
    expirationDate
    createdAt
  }
}
```

**Get User Links**

```graphql
query {
  getUserLinks {
    id
    alias
    destinationUrl
    shortUrl
    expirationDate
    createdAt
  }
}
```

**Get Link Visits**

```graphql
query {
  getLinkVisits(id: "your-link-id") {
    id
    referrer
    userAgent
    ipAddress
    timestamp
  }
}
```

**Search Links**
```graphql
query {
  searchLinks(query: "your-search-query") {
    id
    alias
    destinationUrl
    shortUrl
    expirationDate
    createdAt
  }
}
```

**Get Popular Links**

```graphql
query {
  getPopularLinks(limit: 10) {
    id
    alias
    destinationUrl
    shortUrl
    expirationDate
    createdAt
  }
}
```

**Get Top Referrers**

```graphql
query {
  getTopReferrers(id: "your-link-id", limit: 5) {
    referrer
    visitCount
  }
}
```

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

