import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
	try {
		// Launch the browser
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();

		// Navigate to the specified URL
		await page.goto(
			"https://www.educationblog24.com/2020/04/bangla-dhadha-with-ans.html#point15",
			{
				waitUntil: "networkidle2",
			}
		);

		// Define the parent selector
		const parentSelector = "#post28524854114086084229";

		// Initialize array to store extracted data
		let extractedData = [];

		// Start index for child selectors
		let index = 1;

		// Loop until no more elements are found for the current index
		while (true) {
			// Construct the selector
			const selector = `${parentSelector} > div:nth-child(${index})`;

			// Extract data from the current selector
			const data = await page.$$eval(selector, (elements) => {
				return elements.map((element) => element.textContent.trim());
			});

			// If no elements are found for the current index, exit the loop
			if (data.length === 0) {
				break;
			}

			// Append extracted data to the result array
			extractedData.push({ selector, data });

			// Increment the index for the next iteration
			index++;
		}

		// Log the extracted data
		console.log("Extracted Data:", extractedData);

		// Define the CSV file name
		const csvFileName = "extracted_data02.csv";

		// Prepare CSV data
		let csvContent = "";
		extractedData.forEach(({ selector, data }, index) => {
			csvContent += `Selector ${index + 1}: ${selector}\n`;
			data.forEach((text) => {
				csvContent += `"${text.replace(/"/g, '""')}"\n`;
			});
		});

		// Write the extracted data to the CSV file
		fs.writeFileSync(csvFileName, csvContent, "utf8");

		console.log(`Data has been saved to ${csvFileName}`);

		// Optionally, take a screenshot
		// await page.screenshot({ path: 'bangla_dhadha.png', fullPage: true });

		// Close the browser
		await browser.close();
	} catch (error) {
		console.error("Error:", error);
	}
})();
