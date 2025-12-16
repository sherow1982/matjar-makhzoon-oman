document.addEventListener('DOMContentLoaded', () => {
    // This function will run after the initial HTML is parsed.
    // We create a new script element for our main script.
    const mainScript = document.createElement('script');
    mainScript.src = 'script.js';
    mainScript.defer = true; // Ensure it runs after the document is parsed.
    
    // Append it to the body to start loading it without blocking the page.
    document.body.appendChild(mainScript);
});