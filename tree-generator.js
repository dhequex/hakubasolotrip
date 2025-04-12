const fs = require("fs");
const path = require("path");

function generateTree(startPath, options = {}) {
	const {
		indent = "  ",
		ignorePatterns = [/node_modules/, /\.git/, /\.DS_Store/],
		maxDepth = Infinity,
		currentDepth = 0,
	} = options;

	let output = "";

	// Return if we've reached max depth or path doesn't exist
	if (currentDepth >= maxDepth || !fs.existsSync(startPath)) {
		return output;
	}

	try {
		const files = fs.readdirSync(startPath);

		files.forEach((file, index) => {
			// Skip files/folders matching ignore patterns
			if (ignorePatterns.some(pattern => pattern.test(file))) {
				return;
			}

			const filePath = path.join(startPath, file);
			const stats = fs.statSync(filePath);
			const isLast = index === files.length - 1;
			const prefix =
				currentDepth === 0
					? ""
					: `${indent.repeat(currentDepth)}${isLast ? "└── " : "├── "}`;

			// Add the current file/folder to output
			output += `${prefix}${file}\n`;

			// Recursively process directories
			if (stats.isDirectory()) {
				output += generateTree(filePath, {
					...options,
					currentDepth: currentDepth + 1,
				});
			}
		});

		return output;
	} catch (error) {
		console.error(`Error reading directory: ${error.message}`);
		return output;
	}
}

// Example usage:
const projectPath = process.argv[2] || "./";
const options = {
	ignorePatterns: [
		/node_modules/,
		/\.git/,
		/\.DS_Store/,
		/\.next/,
		/\.cache/,
		/dist/,
		/build/,
	],
	maxDepth: process.argv[3] ? parseInt(process.argv[3]) : Infinity,
};

console.log("\nDirectory structure:");
console.log(generateTree(projectPath, options));
