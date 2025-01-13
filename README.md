## Getting Started

## Installation

Clone the repository:
```bash
git clone https://github.com/yourusername/spreadsheet-grid-app.git
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Features

### 1. **Spreadsheet Grid**
   - **Interactive Grid**: Click on any cell to start editing its content. You can select multiple cells by clicking and dragging across the grid.
   - **Formula Bar**: A formula bar at the top of the interface allows you to enter or edit the values in the selected cells.

### 2. **Formula Calculations**
   - Perform common calculations on selected cells:
     - **SUM**: Adds up the values in the selected cells.
     - **AVERAGE**: Calculates the average value of the selected cells.
     - **MAX**: Finds the maximum value in the selected cells.
     - **MIN**: Finds the minimum value in the selected cells.
     - **COUNT**: Counts the number of cells with numerical data in the selection.

   - To use formulas, select the cells you want to calculate, then choose a formula from the "Formula" menu in the toolbar.

### 3. **Data Quality Operations**
   - Apply various operations to improve or clean the data:
     - **TRIM**: Removes leading and trailing spaces from text in selected cells.
     - **UPPERCASE**: Converts text to uppercase.
     - **LOWERCASE**: Converts text to lowercase.
     - **REMOVE DUPLICATES**: Removes duplicate values from the selected range.
     - **FIND AND REPLACE**: Search and replace specific text values across the selected cells.

   - To apply a data quality operation, select the cells, then choose an operation from the "Data Quality" menu in the toolbar.

### 4. **Clipboard Operations**
   - Use the **"Edit"** menu for standard clipboard actions:
     - **Cut**: Remove selected cell data and place it in the clipboard.
     - **Copy**: Copy the selected cell data to the clipboard.
     - **Paste**: Paste data from the clipboard into the selected cell(s).

### 5. **Export to Excel**
   - Export the spreadsheet data to an Excel file by clicking the "Save as Excel" option in the "File" menu. This allows users to download the current state of the spreadsheet in Excel format for further analysis or reporting.

### 6. **Dynamic Row and Column Insertion**
   - Easily add new rows and columns to the grid:
     - Hover over the row numbers or column letters to reveal a "+" button.
     - Click the "+" button to insert a new row or column where you are hovering.

## Usage

1. **Start Editing**
   - Click on any cell in the grid to begin editing the content.
   - For multiple cell selections, click and drag to select a range.

2. **Perform Calculations**
   - Select the cells you want to calculate.
   - Choose a formula (e.g., SUM, AVERAGE) from the "Formula" menu in the toolbar.

3. **Apply Data Quality Operations**
   - Select the range of cells where you want to apply data quality operations.
   - Choose the desired operation (e.g., TRIM, REMOVE DUPLICATES) from the "Data Quality" menu.

4. **Clipboard Actions**
   - Use the "Edit" menu to cut, copy, and paste data between cells.

5. **Export to Excel**
   - After making changes to the grid, you can export the data by selecting the "Save as Excel" option from the "File" menu.

6. **Insert Rows/Columns**
   - Hover over the row or column labels to reveal the "+" button.
   - Click the "+" button to insert new rows or columns as needed.

### Dependencies

This project uses the following dependencies:

- **lucide-react**: Provides icons for the toolbar.
- **next**: The Next.js framework for building React applications.
- **react**: The React library for building user interfaces.
- **react-dom**: React DOM library for managing rendering in the browser.
- **xlsx**: A library for reading and writing Excel files.
- **postcss**: A tool for transforming CSS.
- **tailwindcss**: A utility-first CSS framework for styling.

### Scripts

The following scripts are available to manage the development and deployment of the application:

- `dev`: Runs the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Lints the codebase to ensure code quality.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.JS GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.JS Deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
