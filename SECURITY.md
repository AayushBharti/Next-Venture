# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in VentureDen, please report it responsibly by emailing the project maintainer rather than opening a public issue.

## Scope

This is a portfolio/demo project. While security best practices are followed, it is not intended for production use with real user data.

## Known Considerations

- Authentication is handled via NextAuth.js with GitHub OAuth
- Environment variables are validated at startup via Zod
- No sensitive user data is stored beyond basic GitHub profile info
