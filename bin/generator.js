
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateProject(projectName, answers, targetDir) {
  try {
    console.log(chalk.yellow(`📁 Creating project ${projectName}...`));
    
    // Create project root
    fs.ensureDirSync(targetDir);

    // Copy Frontend -> client
    const frontendSource = path.join(__dirname, `../templates/frontend/${answers.frontend}`);
    const frontendDest = path.join(targetDir, "client");
    fs.copySync(frontendSource, frontendDest);
    console.log(chalk.blue(`   - Frontend: ${answers.frontend} -> copied to client/`));

    // Process Backend -> server
    const backendTemplateName = answers.buildTool === 'gradle' ? `${answers.backend}-gradle` : answers.backend;
    const backendSource = path.join(__dirname, `../templates/backend/${backendTemplateName}`);
    const backendDest = path.join(targetDir, "server");
    
    const artifactId = projectName; // Default artifactId to project name
    const packageName = `${answers.groupId}.${artifactId}`.replace(/-/g, "").toLowerCase();
    const packagePath = packageName.replace(/\./g, "/");

    console.log(chalk.blue(`   - Backend: ${answers.backend} (${answers.buildTool}) -> configuring for ${packageName}...`));

    processBackendFiles(backendSource, backendDest, answers, artifactId, packageName, packagePath);
    
    // Make mvnw/gradlew executable
    try {
        if (process.platform !== "win32") {
            if (answers.buildTool === 'maven') {
                fs.chmodSync(path.join(backendDest, "mvnw"), "755");
            } else {
                fs.chmodSync(path.join(backendDest, "gradlew"), "755");
            }
        }
    } catch (e) { /* ignore */ }


    createHelpFile(targetDir, projectName, answers, artifactId);

    console.log(chalk.green("\n✔ Project created successfully!\n"));
    printNextSteps(projectName, answers);

  } catch (error) {
    console.error(chalk.red("\n❌ An error occurred during project creation:"));
    console.error(chalk.red(error.message));
    
    // Cleanup
    if (fs.existsSync(targetDir)) {
      console.log(chalk.yellow(`\n🧹 Cleaning up partial directory: ${targetDir}...`));
      try {
        fs.removeSync(targetDir);
        console.log(chalk.green("✔ Cleanup successful."));
      } catch (cleanupError) {
        console.error(chalk.red("❌ Failed to clean up directory. Manual deletion required."));
      }
    }
    process.exit(1);
  }
}

function processBackendFiles(src, dest, answers, artifactId, packageName, packagePath) {
    // Recursive function to process files
    function processDirectory(src, dest) {
      fs.ensureDirSync(dest);
      const items = fs.readdirSync(src);

      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
           // Special handling for package structure
           if (item === "com" && fs.existsSync(path.join(srcPath, "example/demo"))) {
              // This is the source root 'com/example/demo'
              // We redirect it to the new package path
              const newDestPath = path.join(dest, ...packagePath.split("/"));
              // Recurse into the old 'com/example/demo' (skipping intermediate folders)
              processDirectory(path.join(srcPath, "example/demo"), newDestPath);
           } else {
              processDirectory(srcPath, destPath);
           }
        } else {
          // File processing
          let content = fs.readFileSync(srcPath, "utf-8");
          
          // Binary files check - comprehensive list
          const binaryExtensions = [
            'png', 'jpg', 'jpeg', 'gif', 'ico', 'svg', 'webp', 'bmp', // Images
            'jar', 'war', 'ear', 'class', // Java binaries
            'exe', 'dll', 'so', 'dylib', // Executables/Libraries
            'zip', 'tar', 'gz', 'rar', '7z', // Archives
            'pdf', 'doc', 'docx', 'xls', 'xlsx', // Documents
            'mp3', 'mp4', 'avi', 'mov', 'wav', // Media
            'ttf', 'otf', 'woff', 'woff2', 'eot', // Fonts
            'cmd', 'bat' // Windows scripts (should be copied as-is)
          ];
          
          const ext = item.split('.').pop().toLowerCase();
          if (binaryExtensions.includes(ext)) {
              fs.copyFileSync(srcPath, destPath);
              continue;
          }

          // Replacements
          content = content
              .replace(/{{GROUP_ID}}/g, answers.groupId)
              .replace(/{{ARTIFACT_ID}}/g, artifactId)
              .replace(/{{JAVA_VERSION}}/g, answers.javaVersion)
              .replace(/{{SPRING_BOOT_VERSION}}/g, answers.springBootVersion)
              .replace(/JavaLanguageVersion\.of\(17\)/g, `JavaLanguageVersion.of(${answers.javaVersion})`)
              .replace(/<version>3\.2\.1<\/version>/g, `<version>${answers.springBootVersion}</version>`) // Maven Spring Boot version
              .replace(/springBootVersion = "3\.2\.1"/g, `springBootVersion = "${answers.springBootVersion}"`) // Gradle
              .replace(/<packaging>jar<\/packaging>/g, `<packaging>${answers.packaging}</packaging>`)
              .replace(/{{PACKAGE_NAME}}/g, packageName)
              .replace(/com\.example\.demo/g, packageName)
              .replace(/com\.example/g, answers.groupId) // Gradle often uses just group
              .replace(/demo/g, artifactId) // Standard gradle replace
              .replace(/group = "com.example"/g, `group = "${answers.groupId}"`); // Kotlin DSL specific

           // Add WAR support for Maven
           if (answers.packaging === 'war' && item === 'pom.xml') {
               const tomcatDependency = `
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-tomcat</artifactId>
			<scope>provided</scope>
		</dependency>`;
               content = content.replace('</dependencies>', `${tomcatDependency}\n	</dependencies>`);
           }
           
           // Add WAR support for Gradle
           if (answers.packaging === 'war' && (item === 'build.gradle' || item === 'build.gradle.kts')) {
               if (item === 'build.gradle.kts') {
                   content = content.replace('kotlin("plugin.spring") version "2.2.21"', 'kotlin("plugin.spring") version "2.2.21"\n	id("war")');
               } else {
                   content = content.replace("id 'org.springframework.boot'", "id 'war'\n	id 'org.springframework.boot'");
               }
           }

          fs.writeFileSync(destPath, content);
        }
      }
    }

    processDirectory(src, dest);

    // Create ServletInitializer for WAR packaging
    if (answers.packaging === 'war') {
        createServletInitializer(dest, answers, packageName, packagePath);
    }
}

function createServletInitializer(destDir, answers, packageName, packagePath) {
    const srcDir = path.join(destDir, "src/main", answers.backend === 'kotlin' ? 'kotlin' : answers.backend === 'groovy' ? 'groovy' : 'java', ...packagePath.split("/"));
    // Ensure directory exists (it should)
    fs.ensureDirSync(srcDir);
    
    let fileName = "ServletInitializer." + (answers.backend === 'kotlin' ? 'kt' : answers.backend === 'groovy' ? 'groovy' : 'java');
    
    // The main application class is always DemoApplication in templates
    // This is consistent across all backend templates
    const mainClassName = "DemoApplication";
    let content = "";

    if (answers.backend === 'java') {
        content = `package ${packageName};

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(${mainClassName}.class);
	}

}
`;
    } else if (answers.backend === 'kotlin') {
         content = `package ${packageName}

import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

class ServletInitializer : SpringBootServletInitializer() {

	override fun configure(application: SpringApplicationBuilder): SpringApplicationBuilder {
		return application.sources(${mainClassName}::class.java)
	}

}
`;
    } else if (answers.backend === 'groovy') {
        content = `package ${packageName}

import org.springframework.boot.builder.SpringApplicationBuilder
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer

class ServletInitializer extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(${mainClassName}.class)
	}

}
`;
    }
    
    if (content) {
        fs.writeFileSync(path.join(srcDir, fileName), content);
    }
}

function createHelpFile(targetDir, projectName, answers, artifactId) {
    const helpContent = `
# ${projectName}

Generated with **create-react-spring**.

## Stack
- **Client**: ${answers.frontend === 'vite' ? 'React + Vite' : 'Create React App'}
- **Server**: Spring Boot ${answers.springBootVersion} (${answers.backend}, ${answers.buildTool})
  - **Group**: ${answers.groupId}
  - **Artifact**: ${artifactId}
  - **Java**: ${answers.javaVersion}
  - **Packaging**: ${answers.packaging.toUpperCase()}

## Getting Started

### Client (Frontend)
\`\`\`bash
cd client
npm install
${answers.frontend === 'vite' ? 'npm run dev' : 'npm start'}
\`\`\`

### Server (Backend)
\`\`\`bash
cd server
${getRunCommand(answers.buildTool)}
\`\`\`
`;
    fs.writeFileSync(path.join(targetDir, "HELP.md"), helpContent);
}

function getRunCommand(buildTool) {
    if (buildTool === 'gradle') {
        return process.platform === 'win32' ? 'gradlew.bat bootRun' : './gradlew bootRun';
    }
    return process.platform === 'win32' ? 'mvnw.cmd spring-boot:run' : './mvnw spring-boot:run';
}

function printNextSteps(projectName, answers) {
    console.log(`
Next steps:
  cd ${projectName}
  
  # Client
  cd client
  npm install
  ${answers.frontend === 'vite' ? 'npm run dev' : 'npm start'}

  # Server
  cd ../server
  ${getRunCommand(answers.buildTool)}
`);
}
