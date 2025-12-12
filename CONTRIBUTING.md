# Contributing to create-react-spring

First off, thank you for considering contributing to create-react-spring! 🎉

It's people like you that make create-react-spring such a great tool. We welcome contributions from everyone, whether it's a bug report, feature suggestion, documentation improvement, or code contribution.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Code Contributions](#code-contributions)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this standard. Please be kind and courteous to others.

---

## How Can I Contribute?

### Reporting Bugs

Bugs are tracked as [GitHub issues](https://github.com/KOWSIK-M/create-react-spring/issues). Before creating a bug report, please check if the issue already exists.

**When creating a bug report, include:**

- **Clear title**: Summarize the problem in one line
- **Description**: Detailed description of the issue
- **Steps to reproduce**: Step-by-step instructions
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**:
  - OS (Windows/Mac/Linux)
  - Node version (`node --version`)
  - Java version (`java --version`)
  - Package version
- **Screenshots**: If applicable
- **Error logs**: Complete error messages

**Example:**

```markdown
**Title**: Maven wrapper fails on Windows with Java 21

**Description**: When generating a project with Java 21 and Maven on Windows, 
the mvnw.cmd script fails to execute.

**Steps to Reproduce**:
1. Run `npx create-react-spring test-app`
2. Select Maven, Java 21
3. Navigate to server directory
4. Run `mvnw.cmd spring-boot:run`

**Expected**: Server should start
**Actual**: Error: "JAVA_HOME not found"

**Environment**:
- Windows 11
- Node v20.10.0
- Java 21.0.1
- create-react-spring v1.0.0
```

---

### Suggesting Features

Feature suggestions are also tracked as [GitHub issues](https://github.com/KOWSIK-M/create-react-spring/issues).

**When suggesting a feature:**

- **Use a clear title**: Describe the feature concisely
- **Provide detailed description**: Explain the feature and its benefits
- **Use cases**: Describe scenarios where this would be useful
- **Alternatives**: Mention alternative solutions you've considered
- **Mockups**: If applicable, include mockups or examples

**Example:**

```markdown
**Title**: Add TypeScript support for frontend templates

**Description**: Add option to generate Vite template with TypeScript 
instead of JavaScript.

**Use Case**: Many developers prefer TypeScript for type safety and 
better IDE support.

**Proposed Implementation**:
- Add "TypeScript" option in frontend prompt
- Generate tsconfig.json
- Use .tsx extensions
- Include type definitions

**Alternatives**: Users can manually convert, but this adds friction.
```

---

### Code Contributions

We love code contributions! Here's how to submit changes:

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

---

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- Java JDK >= 17 (for testing backend templates)
- Git

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/create-react-spring.git
cd create-react-spring

# 2. Install dependencies
npm install

# 3. Link package for local testing
npm link

# 4. Test the CLI
create-react-spring test-project

# Or test directly with node
node bin/index.js test-project
```

### Project Structure

```
create-react-spring/
├── bin/
│   ├── index.js       # CLI entry point
│   ├── prompts.js     # Interactive prompts
│   └── generator.js   # Project generation logic
├── templates/
│   ├── frontend/
│   │   ├── vite/     # Vite template
│   │   └── cra/      # Create React App template
│   └── backend/
│       ├── java/          # Java + Maven
│       ├── java-gradle/   # Java + Gradle
│       ├── kotlin/        # Kotlin + Maven
│       ├── kotlin-gradle/ # Kotlin + Gradle
│       ├── groovy/        # Groovy + Maven
│       └── groovy-gradle/ # Groovy + Gradle
├── package.json
├── README.md
└── CHANGELOG.md
```

### Testing Your Changes

```bash
# Test generation with different options
create-react-spring test-java-maven
# Select: Vite, Java, Maven, Jar, com.test, 17

create-react-spring test-kotlin-gradle
# Select: Vite, Kotlin, Gradle, Jar, io.test, 21

# Verify generated projects work
cd test-java-maven/client
npm install && npm run dev

cd ../server
./mvnw spring-boot:run
```

### Running Multiple Tests

```bash
# Test all combinations (manual)
# Frontend: Vite, CRA
# Backend: Java, Kotlin, Groovy
# Build: Maven, Gradle
# Packaging: Jar, War
# Java Version: 17, 21
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows the project style guidelines
- [ ] Tested locally with multiple configurations
- [ ] Updated documentation (README, CHANGELOG)
- [ ] Added comments for complex logic
- [ ] No console.log statements (use proper logging)
- [ ] All template placeholders work correctly

### PR Title Format

Use clear, descriptive titles:

```
✅ Good:
- "Add TypeScript support for Vite template"
- "Fix Maven wrapper permissions on Unix systems"
- "Update README with troubleshooting section"

❌ Bad:
- "Updates"
- "Fix bug"
- "Changes"
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring

## Testing
Describe how you tested your changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] Tested with multiple configurations
- [ ] No breaking changes (or clearly documented)

## Screenshots (if applicable)
Add screenshots to demonstrate changes.
```

### Review Process

1. **Automated checks**: Must pass before review
2. **Code review**: Maintainer will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, will be merged
5. **Release**: Changes included in next release

---

## Style Guidelines

### JavaScript Style

```javascript
// ✅ Use ES6+ features
import fs from 'fs-extra';
const { name, version } = answers;

// ✅ Use async/await
async function generateProject() {
  await copyTemplate();
}

// ✅ Descriptive variable names
const backendTemplateName = answers.buildTool === 'gradle' 
  ? `${answers.backend}-gradle` 
  : answers.backend;

// ❌ Avoid var
var x = 1; // Don't do this

// ❌ Avoid unclear names
const btn = 'maven'; // What is btn?
```

### Code Comments

```javascript
// ✅ Good: Explains WHY
// Maven uses 'jar' by default, but we need to support WAR packaging
if (answers.packaging === 'war') {
  addServletInitializer();
}

// ❌ Bad: Explains WHAT (obvious from code)
// Set packaging to war
if (answers.packaging === 'war') {
```

### Error Handling

```javascript
// ✅ Always handle errors
try {
  await generateProject();
} catch (error) {
  console.error(chalk.red('Error:', error.message));
  cleanup();
  process.exit(1);
}

// ✅ Provide helpful error messages
if (!fs.existsSync(templatePath)) {
  throw new Error(
    `Template not found: ${templatePath}\n` +
    `This is likely a bug. Please report it.`
  );
}
```

### Template Placeholders

Always use these exact placeholders:

- `{{GROUP_ID}}` - User's group ID (e.g., com.example)
- `{{ARTIFACT_ID}}` - Project artifact ID
- `{{PACKAGE_NAME}}` - Full package name (e.g., com.example.myapp)
- `{{JAVA_VERSION}}` - Selected Java version (17 or 21)

---

## Adding New Templates

### Frontend Template

```bash
# 1. Create template directory
mkdir -p templates/frontend/my-framework

# 2. Add template files
# Include package.json, index.html, etc.

# 3. Update prompts.js
# Add option to frontend choices

# 4. Test generation
create-react-spring test-my-framework
```

### Backend Template

```bash
# 1. Create template directory
mkdir -p templates/backend/scala

# 2. Add template files with placeholders
# Use {{GROUP_ID}}, {{ARTIFACT_ID}}, etc.

# 3. Update prompts.js
# Add option to backend choices

# 4. Update generator.js
# Add any special handling if needed

# 5. Test generation
create-react-spring test-scala
```

---

## Documentation Guidelines

### README Updates

- Use clear, concise language
- Include code examples
- Add screenshots for visual changes
- Update table of contents if adding sections

### CHANGELOG Updates

Follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [Unreleased]

### Added
- TypeScript support for Vite template

### Fixed
- Maven wrapper permissions on Unix systems
```

---

## Questions?

- **General questions**: [GitHub Discussions](https://github.com/KOWSIK-M/create-react-spring/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/KOWSIK-M/create-react-spring/issues)
- **Security issues**: Please email instead of creating public issues

---

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Future CONTRIBUTORS.md file

Thank you for contributing! 🙏
