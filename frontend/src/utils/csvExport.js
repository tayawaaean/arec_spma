/**
 * Convert an array of objects to CSV format
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column definitions {key, header}
 * @returns {string} CSV formatted string
 */
export const convertToCSV = (data, columns) => {
    if (!data || !data.length) return '';
    
    // Create header row
    const header = columns.map(col => `"${col.header}"`).join(',');
    
    // Create data rows
    const rows = data.map(item => {
      return columns.map(column => {
        // Handle nested properties (e.g. address.municipality)
        let value = column.key.split('.').reduce((obj, key) => 
          (obj && obj[key] !== undefined) ? obj[key] : '', item);
        
        // Format date fields if needed
        if (column.type === 'date' && value) {
          value = new Date(value).toLocaleDateString();
        }
        
        // Escape quotes and wrap value in quotes
        value = value !== null && value !== undefined ? String(value) : '';
        value = value.replace(/"/g, '""');
        return `"${value}"`;
      }).join(',');
    });
    
    // Combine header and rows
    return [header, ...rows].join('\n');
  };
  
  /**
   * Trigger a download of a CSV file in the browser
   * @param {string} csvContent - CSV content to download
   * @param {string} fileName - Name for the downloaded file
   */
  export const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set link properties
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    // Append to document, trigger download and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };