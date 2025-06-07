// Enhanced Try Now functionality
const generatedContent = {
    pdf: null,
    png: null,
}

function addParameter() {
    const paramsList = document.getElementById("params-list")
    const paramRow = document.createElement("div")
    paramRow.className = "param-row"
    paramRow.innerHTML = `
      <input type="text" class="param-key" placeholder="Key">
      <input type="text" class="param-value" placeholder="Value">
      <button class="remove-param" onclick="removeParameter(this)">×</button>
    `
    paramsList.appendChild(paramRow)
}

function removeParameter(button) {
    button.parentElement.remove()
}

function resetCode() {
    const htmlCode = document.getElementById("html-code")
    htmlCode.value = `<!DOCTYPE html>
  <html>
  <head>
      <style>
          .card {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px;
              border-radius: 20px;
              color: white;
              text-align: center;
              font-family: 'Arial', sans-serif;
              max-width: 500px;
              margin: 20px auto;
          }
          .card h1 {
              font-size: 2.5rem;
              margin-bottom: 20px;
              font-weight: 300;
          }
          .card p {
              font-size: 1.1rem;
              line-height: 1.6;
              margin-bottom: 30px;
              opacity: 0.9;
          }
          .btn {
              background: white;
              color: #667eea;
              border: none;
              padding: 12px 24px;
              border-radius: 50px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.3s;
          }
          .btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
      </style>
  </head>
  <body>
      <div class="card">
          <h1>{{title}}</h1>
          <p>{{description}}</p>
          <button class="btn">{{buttonText}}</button>
      </div>
  </body>
  </html>`
    // Optionally, regenerate preview after reset if needed
    // generatePreview();
}

function getParameters() {
    const params = {}
    const paramRows = document.querySelectorAll(".param-row")

    paramRows.forEach((row) => {
        const key = row.querySelector(".param-key").value.trim()
        const value = row.querySelector(".param-value").value.trim()
        if (key) { // Allow empty value if key is present
            params[key] = value
        }
    })

    return params
}

function replaceParameters(html, params) {
    let processedHtml = html

    Object.keys(params).forEach((key) => {
        // Ensure {{key}} is not part of a larger word, e.g. {{descriptionExtended}}
        // Match {{key}} ensuring it's not preceded or followed by word characters (alphanumeric or underscore)
        // This is a simplified version; robust template engines handle this better.
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        processedHtml = processedHtml.replace(regex, params[key])
    })

    return processedHtml
}

function updatePreviewHeader(format) {
    const previewHeader = document.querySelector(".preview-container .preview-header span")

    if (previewHeader) {
        previewHeader.style.transition = "all 0.3s ease"
        previewHeader.style.opacity = "0.5"

        setTimeout(() => {
            if (format === "pdf") {
                previewHeader.textContent = "📄 PDF Result"
            } else {
                previewHeader.textContent = "🖼️ Image Result"
            }
            previewHeader.style.opacity = "1"
        }, 150)
    }
}

// Ensure these are at a scope accessible by generatePreview
let previewGenerationTimeoutId = null;
let generateFilesTimeoutId = null;

function generatePreview() {
    console.log("generatePreview: Called.");
    const previewFrameContainer = document.getElementById("preview-frame");

    // 1. Clear any existing timeouts from previous calls
    if (previewGenerationTimeoutId) {
        clearTimeout(previewGenerationTimeoutId);
        console.log("generatePreview: Cleared previous previewGenerationTimeoutId:", previewGenerationTimeoutId);
        previewGenerationTimeoutId = null;
    }
    if (generateFilesTimeoutId) {
        clearTimeout(generateFilesTimeoutId);
        console.log("generatePreview: Cleared previous generateFilesTimeoutId:", generateFilesTimeoutId);
        generateFilesTimeoutId = null;
    }

    // 2. Get data and set loading state
    const htmlCode = document.getElementById("html-code").value;
    const params = getParameters();
    const processedHtml = replaceParameters(htmlCode, params);
    const activeFormat = document.querySelector(".format-btn.active").dataset.format;

    previewFrameContainer.innerHTML = `
      <div class="preview-placeholder">
        <div class="placeholder-icon">⏳</div>
        <p>Generating preview...</p>
      </div>`;
    document.getElementById("download-pdf").disabled = true;
    document.getElementById("download-png").disabled = true;

    // 3. Set timeout for iframe creation and content writing (800ms)
    previewGenerationTimeoutId = setTimeout(() => {
        const currentPgtId = previewGenerationTimeoutId; // Capture for logging
        console.log(`previewGenerationTimeout (800ms) ID ${currentPgtId}: Fired.`);
        try {
            const iframe = document.createElement("iframe");
            iframe.style.cssText = `
                width: 100%; height: 100%; border: none;
                border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            `;

            previewFrameContainer.innerHTML = ""; // Clear placeholder

            let containerDiv;
            if (activeFormat === "pdf") {
                // ... (pdfContainer and pdfPage setup as before)
                const pdfContainer = document.createElement("div");
                pdfContainer.className = "pdf-preview-container";
                pdfContainer.style.cssText = `
                    width: 100%; height: 100%; background: #e0e0e0;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box; overflow: auto;
                `;
                const pdfPage = document.createElement("div");
                pdfPage.className = "pdf-page";
                pdfPage.style.cssText = `
                    background: white; width: 100%; max-width: 612px;
                    height: 100%;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-radius: 4px; overflow: hidden; position: relative; margin: auto;
                `;
                pdfPage.appendChild(iframe);
                pdfContainer.appendChild(pdfPage);
                containerDiv = pdfContainer;
            } else { // Image format
                const imageContainer = document.createElement("div");
                imageContainer.className = "image-preview-container";
                imageContainer.style.cssText = `
                    width: 100%; height: 100%; background: #f0f2f5;
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px; box-sizing: border-box; overflow: auto;
                `;
                imageContainer.appendChild(iframe);
                containerDiv = imageContainer;
            }
            previewFrameContainer.appendChild(containerDiv);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) {
                console.error(`previewGenerationTimeout ID ${currentPgtId}: iframe.contentDocument is null immediately after creation/appending. Iframe:`, iframe);
                previewFrameContainer.innerHTML = `<div class="preview-placeholder">❌<p>Error: Could not access iframe document.</p></div>`;
                return;
            }

            // Simplified HTML for testing if complex HTML is an issue
            // const testSimpleHtml = `<!DOCTYPE html><html><head><title>Test</title><style>body{font-family:sans-serif; padding:20px;}</style></head><body><h1>Iframe Content OK</h1><p>Time: ${new Date().toLocaleTimeString()}</p></body></html>`;
            // iframeDoc.open();
            // iframeDoc.write(testSimpleHtml);
            // iframeDoc.close();
            // console.log(`previewGenerationTimeout ID ${currentPgtId}: Wrote SIMPLE test HTML to iframe.`);

            // Original finalHtml logic:
            const headMatch = processedHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
            const existingHeadContent = headMatch ? headMatch[1] : "";
            const bodyMatch = processedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            const bodyOuterHTML = bodyMatch ? bodyMatch[0] : processedHtml.replace(/<\/?html[^>]*>/gi, '').replace(/<\/?head[^>]*>([\s\S]*?)<\/head>/gi, '');
            // A safer way to get body content, trying to avoid full html/head/body tags if user provided full doc
            const existingBodyContent = bodyMatch ? bodyMatch[1] : processedHtml.replace(/<\/?(html|head|meta|title|link|style|script)(:[^>]*)?>/gi, "").replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").replace(/^<body[^>]*>/i, "").replace(/<\/body>$/i, "").trim();


            let finalHtml = `<!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>body { margin: 0; box-sizing: border-box; } * { box-sizing: border-box; }</style>
              ${existingHeadContent}
              <style>
                ${activeFormat === 'pdf' ? `body { background: white; padding: 20px; font-family: Arial, sans-serif; }` : `body { background: #ffffff; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: calc(100vh - 40px); } body > div { margin-left: auto; margin-right: auto; }`}
              </style>
            </head>
            <body>
              ${existingBodyContent}
            </body>
            </html>`;

            iframeDoc.open();
            iframeDoc.write(finalHtml);
            iframeDoc.close();
            console.log(`previewGenerationTimeout ID ${currentPgtId}: Wrote final HTML to iframe. Iframe connected: ${iframe.isConnected}. contentDocument valid: ${!!iframe.contentDocument}`);


            // 4. Set timeout for actual file generation (html2canvas)
            const localIframeRef = iframe; // Ensure closure captures this specific iframe
            generateFilesTimeoutId = setTimeout(() => {
                const currentGftId = generateFilesTimeoutId; // Capture for logging
                console.log(`generateFilesTimeout (3000ms) ID ${currentGftId}: Fired. Checking iframe:`, localIframeRef);
                console.log(`generateFilesTimeout ID ${currentGftId}: Iframe isConnected: ${localIframeRef ? localIframeRef.isConnected : 'iframe_is_null'}`);
                if (localIframeRef && localIframeRef.contentDocument && localIframeRef.isConnected) {
                    console.log(`generateFilesTimeout ID ${currentGftId}: Calling generateFiles for iframe. Document readyState: ${localIframeRef.contentDocument.readyState}`);
                    generateFiles(localIframeRef.contentDocument);
                } else {
                    let reason = "unknown";
                    if (!localIframeRef) reason = "iframe instance is null/undefined in closure";
                    else if (!localIframeRef.isConnected) reason = "iframe is not connected to DOM";
                    else if (!localIframeRef.contentDocument) reason = "iframe.contentDocument is null";

                    console.error(`generateFilesTimeout ID ${currentGftId}: Iframe or its document not available. Reason: ${reason}.`, {
                        iframeExists: !!localIframeRef,
                        iframeConnected: localIframeRef ? localIframeRef.isConnected : 'N/A',
                        contentDocumentExists: localIframeRef && localIframeRef.contentDocument ? !!localIframeRef.contentDocument : 'N/A'
                    });

                    // Update UI only if this timeout was the last one intended to run
                    // A simple check: if no other preview generation is in its loading phase
                    if (!previewFrameContainer.querySelector(".preview-placeholder .placeholder-icon")?.textContent.includes("⏳")) {
                        previewFrameContainer.innerHTML = `
                            <div class="preview-placeholder">
                                <div class="placeholder-icon">❌</div>
                                <p>Error: Preview context lost (${reason}). Please try again.</p>
                            </div>`;
                    }
                }
            }, 100); // 3-second timeout for rendering
            console.log(`previewGenerationTimeout ID ${currentPgtId}: Set generateFilesTimeoutId to: ${generateFilesTimeoutId}`);

        } catch (error) {
            console.error(`previewGenerationTimeout ID ${currentPgtId}: Error during iframe setup:`, error);
            previewFrameContainer.innerHTML = `
                <div class="preview-placeholder">
                    <div class="placeholder-icon">❌</div>
                    <p>Error setting up preview: ${error.message}</p>
                </div>`;
        }
    }, 100); // 800ms timeout for initial DOM setup of iframe
    console.log("generatePreview: Set previewGenerationTimeoutId to:", previewGenerationTimeoutId);

    // Update API commands (can be done outside timeouts)
    updateApiCommands(processedHtml, params);
}


// Wait for iframe content to load and process it
async function generateFiles(iframeDoc) { // iframeDoc is iframe.contentDocument
    const { jsPDF } = window.jspdf; // Make sure jsPDF is loaded globally or imported

    console.log("generateFiles called with iframeDoc:", iframeDoc);

    // The element to capture is the body of the iframe's document.
    const elementToCapture = iframeDoc.body;

    if (!elementToCapture) {
        console.error("iframeDoc.body is not available. Cannot generate files.");
        alert("Preview content body not found. Please try again or check console.");
        document.getElementById("download-pdf").disabled = true;
        document.getElementById("download-png").disabled = true;
        return;
    }

    // Optional: Check if body has actual content/dimensions
    if (elementToCapture.scrollHeight === 0 && elementToCapture.offsetHeight === 0) {
        console.warn("iframeDoc.body has no scrollable/offset height. html2canvas might produce empty image.");
    }

    try {
        // Create canvas from iframe's body content
        const canvas = await html2canvas(elementToCapture, {
            useCORS: true,      // Important for external images/fonts
            scale: 2,           // For better resolution
            logging: true,      // For debugging html2canvas issues
            backgroundColor: null, // Use element's background, or set one e.g., '#FFFFFF'
            windowWidth: iframeDoc.defaultView.innerWidth, // Pass iframe window dimensions
            windowHeight: iframeDoc.defaultView.innerHeight,
            // scrollX: -iframeDoc.defaultView.pageXOffset, // account for scroll if any
            // scrollY: -iframeDoc.defaultView.pageYOffset,
        });

        // Create PNG
        const pngDataUrl = canvas.toDataURL("image/png");
        generatedContent.png = pngDataUrl;

        // Create PDF
        // Use 'pt' units for PDF dimensions if you want to match standard page sizes
        // For direct canvas to PDF, 'px' is fine if canvas.width/height are used.
        const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? "landscape" : "portrait",
            unit: "px", // Using pixels as unit to match canvas dimensions
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(pngDataUrl, "PNG", 0, 0, canvas.width, canvas.height);

        // Output as blob URL for easier handling and memory management
        const pdfBlob = pdf.output("blob");
        if (generatedContent.pdf && generatedContent.pdf.startsWith("blob:")) {
            URL.revokeObjectURL(generatedContent.pdf); // Revoke old blob URL
        }
        generatedContent.pdf = URL.createObjectURL(pdfBlob);

        // Enable download buttons
        document.getElementById("download-pdf").disabled = false;
        document.getElementById("download-png").disabled = false;
        console.log("Files generated successfully and download buttons enabled.");

    } catch (error) {
        console.error("Error during html2canvas or PDF generation:", error);
        alert(`Failed to generate files. Error: ${error.message}. Check console for more details.`);
        document.getElementById("download-pdf").disabled = true;
        document.getElementById("download-png").disabled = true;
    }
}


function downloadFile(type) {
    const link = document.createElement("a");
    let url = null;
    let filename = "output";

    if (type === "pdf" && generatedContent.pdf) {
        url = generatedContent.pdf;
        filename += ".pdf";
    } else if (type === "png" && generatedContent.png) {
        url = generatedContent.png;
        filename += ".png";
    } else {
        alert("No downloadable content available. Please generate a preview first.");
        return;
    }

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional: Success feedback on button
    const button = document.getElementById(`download-${type}`);
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = `<span>✓</span> Downloaded!`;
        // You might want to store original BG or use a class for styling
        const originalBg = button.style.background;
        button.style.background = "#10b981"; // Green for success

        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = originalBg; // Reset background
        }, 2000);
    }
}


function updateApiCommands(html, params) {
    try {
        const activeFormat = document.querySelector(".format-btn.active").dataset.format
        const formatType = activeFormat === "pdf" ? "pdf" : "png"; // Ensure image is png if not pdf

        const payload = {
            html: html,
            format: formatType,
            parameters: params,
        };
        const payloadString = JSON.stringify(payload, null, 2);
        // Escape single quotes for cURL data part if it's wrapped in single quotes
        const curlPayloadString = JSON.stringify(payload);


        // Update cURL command
        const curlCode = `curl --request POST \\
  --url https://api.pdfy.cloud/v1/generate \\
  --header 'CLIENT-API-KEY: your_api_key' \\
  --header 'Content-Type: application/json' \\
  --data '${curlPayloadString.replace(/'/g, "'\\''")}'`; // Safely escape single quotes within the data

        document.getElementById("curl-code").textContent = curlCode

        // Update Python command
        const pythonCode = `import requests
import json

url = "https://api.pdfy.cloud/v1/generate"
headers = {
    "CLIENT-API-KEY": "your_api_key",
    "Content-Type": "application/json"
}

data = ${payloadString}

response = requests.post(url, json=data, headers=headers)
# To save the file if response is binary (e.g. PDF file itself)
# with open("output.${formatType}", "wb") as f:
#     f.write(response.content)
# Or if response is JSON with a URL or base64 data:
result = response.json() 
print(result)`

        document.getElementById("python-code").textContent = pythonCode

        // Update JavaScript command
        const javascriptCode = `async function generateWithPdfy() {
  try {
    const response = await fetch('https://api.pdfy.cloud/v1/generate', {
      method: 'POST',
      headers: {
        'CLIENT-API-KEY': 'your_api_key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(${payloadString})
    });

    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    // If API returns JSON (e.g. with a link to the file or base64)
    const result = await response.json();
    console.log(result);

    // If API returns the file directly:
    // const blob = await response.blob();
    // const downloadUrl = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = downloadUrl;
    // a.download = 'output.${formatType}';
    // document.body.appendChild(a);
    // a.click();
    // URL.revokeObjectURL(downloadUrl);
    // document.body.removeChild(a);

  } catch (error) {
    console.error("Error calling pdfy API:", error);
  }
}

generateWithPdfy();`

        document.getElementById("javascript-code").textContent = javascriptCode

        // Highlight.js if available
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }

    } catch (error) {
        console.error("Error updating API commands:", error)
    }
}

function copyToClipboard(elementId) {
    try {
        const element = document.getElementById(elementId)
        const text = element.textContent

        navigator.clipboard
            .writeText(text)
            .then(() => {
                const copyBtn = element.closest(".api-tab-content").querySelector(".copy-btn")
                const originalText = copyBtn.innerHTML

                copyBtn.innerHTML = "<span>✓</span> Copied!"
                copyBtn.classList.add("copied")

                setTimeout(() => {
                    copyBtn.innerHTML = originalText
                    copyBtn.classList.remove("copied")
                }, 2000)
            })
            .catch((err) => {
                console.error("Failed to copy: ", err)
                // Fallback for older browsers or insecure contexts
                const textArea = document.createElement("textarea")
                textArea.value = text
                textArea.style.position = "fixed"; // Prevent scrolling to bottom
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea)
                textArea.focus();
                textArea.select()
                try {
                    const successful = document.execCommand("copy")
                    const msg = successful ? "successful" : "unsuccessful";
                    console.log('Fallback: Copying text command was ' + msg);
                    // Show copied state on button (same as above)
                    const copyBtn = element.closest(".api-tab-content").querySelector(".copy-btn")
                    const originalText = copyBtn.innerHTML
                    copyBtn.innerHTML = "<span>✓</span> Copied (fallback)!";
                    copyBtn.classList.add("copied");
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText
                        copyBtn.classList.remove("copied")
                    }, 2000)

                } catch (errFallback) {
                    console.error('Fallback: Oops, unable to copy', errFallback);
                    alert('Failed to copy text.');
                }
                document.body.removeChild(textArea)
            })
    } catch (error) {
        console.error("Copy error:", error)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        resetCode(); // Initialize with default HTML

        const activeFormatBtn = document.querySelector(".format-btn.active")
        if (activeFormatBtn) {
            updatePreviewHeader(activeFormatBtn.dataset.format)
        }

        const formatBtns = document.querySelectorAll(".format-btn")
        formatBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                if (btn.classList.contains("active")) return; // Do nothing if already active

                formatBtns.forEach((b) => b.classList.remove("active"))
                btn.classList.add("active")
                updatePreviewHeader(btn.dataset.format)

                // Regenerate preview if content exists (not in placeholder state)
                const previewFrame = document.getElementById("preview-frame");
                if (previewFrame.innerHTML !== "" && !previewFrame.querySelector(".preview-placeholder")) {
                    generatePreview();
                } else if (document.getElementById("html-code").value.trim() !== "") {
                    // If there's HTML but no preview (e.g. after reset), generate it
                    generatePreview();
                }


                // Update API commands when format changes
                const htmlCode = document.getElementById("html-code").value
                const params = getParameters()
                // Only update if htmlCode is not empty, to avoid sending empty initial commands
                if (htmlCode.trim()) {
                    updateApiCommands(htmlCode, params)
                }
            })
        })

        const apiTabBtns = document.querySelectorAll(".api-tab-btn")
        const apiTabContents = document.querySelectorAll(".api-tab-content")

        apiTabBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const tabId = btn.dataset.tab

                apiTabBtns.forEach((b) => b.classList.remove("active"))
                apiTabContents.forEach((content) => content.classList.remove("active"))

                btn.classList.add("active")
                const targetTabContent = document.getElementById(`${tabId}-tab`);
                if (targetTabContent) {
                    targetTabContent.classList.add("active");
                }
            })
        })

        // Initialize with default API commands using the reset HTML
        const initialHtmlCode = document.getElementById("html-code").value
        const initialParams = getParameters() // Will be empty initially
        updateApiCommands(initialHtmlCode, initialParams)

        // Initial preview generation
        generatePreview();

    } catch (error) {
        console.error("Error initializing event listeners:", error)
    }
})

// Assuming html2canvas and jsPDF are loaded globally via <script> tags
// e.g., <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
// e.g., <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>