l4ci.github.io
==============

The Source behind [volkerotto.net](https://volkerotto.net)

## About

This is a personal portfolio website built with Jekyll and hosted on GitHub Pages. The site features a modern, responsive design with dark mode support and smooth animations.

## Prerequisites

Before you can run this project locally, you need to have the following installed:

- [Homebrew](https://brew.sh/) (macOS/Linux package manager)
- Ruby 3.3.0 (managed via rbenv)
- Bundler (Ruby dependency manager)

## Local Development Setup

### 1. Install rbenv and ruby-build

rbenv is a Ruby version manager that allows you to install and manage multiple Ruby versions.

```bash
brew install rbenv ruby-build
```

### 2. Install Ruby 3.3.0

```bash
rbenv install 3.3.0
rbenv global 3.3.0
```

### 3. Verify Ruby installation

```bash
ruby -v
# Should output: ruby 3.3.0
```

### 4. Install dependencies

Navigate to the project directory and install the required gems:

```bash
bundle install
```

This will install Jekyll and all necessary dependencies specified in the `Gemfile`.

### 5. Run the development server

Start the Jekyll development server with LiveReload:

```bash
bundle exec jekyll serve --livereload
```

The site will be available at:
- **Local**: http://localhost:4000
- **LiveReload**: http://localhost:35729

The server will automatically rebuild and reload the page when you make changes to files.

### Alternative: Run without LiveReload

If you don't need automatic reloading:

```bash
bundle exec jekyll serve
```

## Build Process

### Build for production

To generate the static site files for production:

```bash
bundle exec jekyll build
```

This creates the site in the `_site` directory, ready for deployment.

### Build with specific environment

```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## Project Structure

```
.
├── _layouts/          # HTML templates
├── assets/
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   └── img/          # Images
├── _config.yml       # Jekyll configuration
├── index.html        # Homepage
├── Gemfile           # Ruby dependencies
└── package.json      # Node.js dependencies (for linting)
```

## Code Quality Tools

The project includes ESLint, Prettier, and Stylelint for code quality:

```bash
# Install Node.js dependencies
npm install

# Run all linters
npm run lint

# Format code
npm run format
```

## Deployment

This site is automatically deployed to GitHub Pages when changes are pushed to the `master` branch.

## Troubleshooting

### Ruby version issues

If you encounter errors related to Ruby version compatibility, ensure you're using Ruby 3.3.0:

```bash
rbenv local 3.3.0
ruby -v
```

### Liquid template errors

If you see `undefined method 'tainted?'` errors, ensure your Liquid gem is version 4.0.4 or higher. This is already specified in the `Gemfile`.

### Port already in use

If port 4000 is already in use, you can specify a different port:

```bash
bundle exec jekyll serve --livereload --port 4001
```
