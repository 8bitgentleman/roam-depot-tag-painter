export function formatPackageName(name) {
    return name
      .replace(/^roam-depot-/, '')  // Remove 'roam-depot-' prefix
      .replace(/[-_]/g, ' ')        // Replace all '-' or '_' with a space
      .replace(/\b\w/g, l => l.toUpperCase());  // Capitalize first letter of each word
  }
  
  // Example usage:
  const pkgName = "roam-depot-my-awesome-package";
  const readableName = formatPackageName(pkgName);
  console.log(readableName);  // Output: "My Awesome Package"