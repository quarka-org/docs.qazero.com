---
sidebar_position: 5
title: Contributing
---

# Contributing to QA ZERO

This guide provides information for developers who want to contribute to the QA ZERO project.

## Getting Started

To contribute to QA ZERO:

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Make your changes
5. Submit a pull request

## Development Environment

To set up a development environment:

```bash
# Clone the repository
git clone https://github.com/your-username/qa-zero.git
cd qa-zero

# Install dependencies
npm install

# Set up WordPress test environment
./bin/setup-wp-tests.sh
```

## Coding Standards

QA ZERO follows the WordPress coding standards:

- PHP: [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- JavaScript: [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- CSS: [WordPress CSS Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/)

## Testing

Before submitting a pull request, make sure to run the tests:

```bash
# Run PHP tests
./vendor/bin/phpunit

# Run JavaScript tests
npm test

# Run end-to-end tests
npm run test:e2e
```

## Pull Request Process

1. Update the README.md or documentation with details of changes
2. Update the CHANGELOG.md file with details of changes
3. Increase the version numbers in any examples files and the README.md to the new version
4. Submit the pull request with a clear description of the changes

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Coming Soon

More detailed contribution guidelines will be added in future updates.
