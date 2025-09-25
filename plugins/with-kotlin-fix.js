const { withProjectBuildGradle } = require("@expo/config-plugins");

/**
 * Custom config plugin to enforce consistent Kotlin + AGP versions
 * across all Expo submodules (expo-permissions, expo-notifications, etc).
 */
module.exports = function withKotlinFix(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let contents = config.modResults.contents;

      // Force Kotlin Gradle Plugin version
      contents = contents.replace(
        /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin.*['"]\)/,
        "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.22')"
      );

      // Force Android Gradle Plugin version
      contents = contents.replace(
        /classpath\(['"]com\.android\.tools\.build:gradle.*['"]\)/,
        "classpath('com.android.tools.build:gradle:8.2.1')"
      );

      // Add resolutionStrategy block if missing
      if (!contents.includes("resolutionStrategy.eachDependency")) {
        contents += `
                    subprojects {
                    project.configurations.all {
                        resolutionStrategy.eachDependency { details ->
                        if (details.requested.group == "org.jetbrains.kotlin") {
                            details.useVersion "1.8.22"
                        }
                        }
                    }
                    }
        `;
      }

      config.modResults.contents = contents;
    }
    return config;
  });
};
