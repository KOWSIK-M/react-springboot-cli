# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-12

### 🎉 Initial Release

First public release of create-react-spring - the fastest way to create React + Spring Boot full-stack applications.

### ✨ Added

#### Frontend Support
- Vite template with React 18
- Create React App template (legacy support)
- Auto-configured proxy for backend API calls
- Pre-configured ESLint and development environment

#### Backend Support
- **Java** backend template with Spring Boot
- **Kotlin** backend template with Spring Boot
- **Groovy** backend template with Spring Boot
- Maven build system support (with wrapper)
- Gradle build system support (with wrapper)
- JAR packaging option
- WAR packaging option with auto-generated ServletInitializer

#### Project Configuration
- Interactive CLI with colored output
- Custom Group ID input with validation
- Java version selection (17 or 21)
- Automatic package structure creation
- Template parameterization (GROUP_ID, ARTIFACT_ID, JAVA_VERSION)
- Cross-platform support (Windows, Mac, Linux)

#### Documentation
- Auto-generated HELP.md with stack-specific instructions
- Comprehensive README with examples
- MIT License included

#### Developer Experience
- Build wrappers included (mvnw, gradlew)
- No global installations required
- Error handling with automatic cleanup on failure
- Clear success/error messaging
- Next steps instructions after generation

### 🔧 Technical Details

- **Node.js**: Requires >= 18.0.0
- **Dependencies**: inquirer ^9.2.7, chalk ^5.3.0, fs-extra ^11.2.0
- **Package Size**: ~2.5MB (including all templates)
- **Supported Platforms**: Windows, macOS, Linux

### 📦 Templates Included

- `frontend/vite` - Vite + React template
- `frontend/cra` - Create React App template
- `backend/java` - Java + Maven template
- `backend/java-gradle` - Java + Gradle template
- `backend/kotlin` - Kotlin + Maven template
- `backend/kotlin-gradle` - Kotlin + Gradle template
- `backend/groovy` - Groovy + Maven template
- `backend/groovy-gradle` - Groovy + Gradle template

---

## [Unreleased]

### 🚧 Planned Features

#### v1.1.0 (Next Minor Release)
- [ ] TypeScript support for frontend templates
- [ ] Spring Boot version selection
- [ ] Database configuration options (PostgreSQL, MySQL, H2)
- [ ] Environment file generation (.env)
- [ ] Docker and Docker Compose configuration generation
- [ ] Testing framework setup (Jest, JUnit)
- [ ] Input validation for Group ID format
- [ ] Project name validation (no spaces/special characters)

#### v1.2.0 (Future Minor Release)
- [ ] Authentication scaffolding (Spring Security + JWT)
- [ ] API documentation generation (Swagger/OpenAPI)
- [ ] Vue.js frontend option
- [ ] Angular frontend option
- [ ] Redis integration option
- [ ] Email service configuration
- [ ] File upload configuration

#### v2.0.0 (Major Release - Future)
- [ ] GraphQL support
- [ ] Microservices architecture template
- [ ] Cloud deployment configurations (AWS, Azure, GCP)
- [ ] Kubernetes manifests generation
- [ ] CI/CD pipeline templates
- [ ] Monitoring and logging setup (Prometheus, Grafana, ELK)
- [ ] Multi-module project support
- [ ] Advanced security configurations

---

## Version History

### How to Read This Changelog

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security vulnerability fixes

### Contributing

If you'd like to suggest features or report bugs, please visit our [GitHub Issues](https://github.com/KOWSIK-M/create-react-spring/issues).

---

[1.0.0]: https://github.com/KOWSIK-M/create-react-spring/releases/tag/v1.0.0
[Unreleased]: https://github.com/KOWSIK-M/create-react-spring/compare/v1.0.0...HEAD
