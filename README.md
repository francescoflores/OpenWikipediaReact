# Openwikipedia
OpenWikipedia is a web application that leverages Mediawiki’s API to store an article from Wikipedia, and edit its content.
The Frontend was made in React 18.0, Typescript 5.4.5 and tailwind 3.4.3, using: [vitejs.dev](https://vitejs.dev/).


## Installation
clone your OpenWikipedia backend repository using the following command:
1. **Clone the repository**:
   ```bash
   git clone git@github.com:francescoflores/OpenWikipediaReact.git
---

2. **Set Up Nodejs:**:
Ensure you have Node.js installed and running. If not, install the version you prefer from: [Node.js](https://nodejs.org)

2. **Set Up Nodejs:**:
Navigate to the project directory and install the necessary dependencies:
   ```bash
   npm install
  ---

## Usage
To run the application, execute the following command:

```bash
npm run dev
```

## Technologies
The frontend is a React Web Application generated using , and .

The frontend of this project is a React web application generated using [Vite](https://vitejs.dev/), a modern build tool that focuses on speed and efficiency. 

For handling HTTP requests, the project utilizes [Axios](https://axios-http.com/), a popular Promise-based HTTP client for the browser and Node.js, that simplifies sending asynchronous HTTP requests and handling responses.

Additionally, the project includes several other key technologies and libraries:

* @heroicons/react: Provides a set of icons that are designed for use with React components.
* @hookform/resolvers and react-hook-form: used for managing form state and validation in React forms.
* @nextui-org/react: A React UI library that provides components and styles for the application's user interface.
* framer-motion: As a dependency of NextUI.
* react-router-dom: Implements the navigation and routing within the React application, allowing for multiple pages and navigation flows.
* zod: A TypeScript-first schema declaration library used for data validation and type safety, used in the login and signup pages.

For development, the project employs various tools and development dependencies:

TypeScript: A typed superset of JavaScript that enhances code quality and developer productivity by providing static type checking.
* @typescript-eslint/eslint-plugin and @typescript-eslint/parser
* eslint: A JavaScript linter that identifies code errors.
* eslint-plugin-react-hooks and eslint-plugin-react-refresh.
* autoprefixer and postcss: as TailwindCSS' dependencies.
* TailwindCSS: A utility-first CSS framework used for rapidly building custom designs without writing traditional CSS.
* vite: The development server and build tool used for the React application.

## Description
The website is composed of 4 main pages:

### The Main Page
The Wikipedia's articles are fetched and filtered through a searchbar in the Main Page using axios, and [MediaWiki's API](https://www.mediawiki.org/wiki/API:Main_page). To save an Article of Wikipedia a Get is send to the [backend]() sending a Post request to the backend endpoint with the path /api/articles.
the backend scrapes the article and stores it in the database. A switch allows the user to use the same Searchbar in order to filter the Articles stored in the internal database.

### The Article Page
The Article page fetches data from the backend endpoint with the path /api/articles/ passing the title of the article as a query parameter. The article's data, such as the title and the paragraphs are displayed alongside an InfoTable, when present, that provides additional information about the Article's topic. Users can edit paragraphs or delete the entire article. I chose to insert the article's deletion on this page, so that the user is forced to view the content of the page before deleting it. The page utilizes Next UI's Modal component for editing paragraphs and tables, allowing users to add or delete rows in tables. The Sidebar component displays an index of paragraphs within the article, enabling easy navigation.

### The Login and Registration pages
The Login and Registration pages utilize the AuthLayout component to maintain a consistent layout and styling across authentication-related pages. This layout likely includes headers, footers, and styling specific to authentication forms. Both the pages use react-hook-form and zodResolver from @hookform/resolvers/zod to validate the input data using predefined schemas, ensuring data integrity and security.

### Authentication Context
Both the signin and signup functions are included in the AuthProvider, included in the Authentication Context. The authentication is done using a JSON Web Token a.k.a. JWT.
