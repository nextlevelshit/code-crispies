import React, { useRef, useEffect, useCallback, useState } from "react";

export function PreviewArea({ previewContent }) {
	const iframeRef = useRef(null);
	const [iframeReady, setIframeReady] = useState(false);

	// Generate the HTML content for the iframe
	const generateIframeHTML = useCallback((content) => {
		if (!content) return "";

		return `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<title>Rendered Preview</title>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					${content.mode === "tailwind" ? `<script src="${content.tailwindCDN}"></script>` : ""}
					<style>
						body { 
							margin: 0; 
							padding: 16px; 
							font-family: system-ui, -apple-system, sans-serif;
						}
						${content.baseCSS || ""}
						${content.sandboxCSS || ""}
						${content.mode !== "tailwind" ? content.userCSS || "" : ""}
					</style>
				</head>
				<body>
					${content.html || ""}
					<script>
						// Listen for updates from parent
						window.addEventListener('message', function(event) {
							if (event.data.type === 'UPDATE_CSS' && event.data.css) {
								let styleEl = document.getElementById('dynamic-styles');
								if (!styleEl) {
									styleEl = document.createElement('style');
									styleEl.id = 'dynamic-styles';
									document.head.appendChild(styleEl);
								}
								styleEl.textContent = event.data.css;
							}
							
							if (event.data.type === 'UPDATE_HTML' && event.data.html) {
								document.body.innerHTML = event.data.html;
							}
						});
						
						// Signal that iframe is ready
						window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
					</script>
				</body>
			</html>
		`;
	}, []);

	// Handle messages from iframe
	useEffect(() => {
		const handleMessage = (event) => {
			if (event.data.type === "IFRAME_READY") {
				setIframeReady(true);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	// Update iframe content via postMessage when ready
	useEffect(() => {
		if (!iframeReady || !previewContent || !iframeRef.current) return;

		// Send CSS updates for non-tailwind mode
		if (previewContent.mode !== "tailwind" && previewContent.userCSS) {
			iframeRef.current.contentWindow.postMessage(
				{
					type: "UPDATE_CSS",
					css: previewContent.userCSS
				},
				"*"
			);
		}
	}, [previewContent, iframeReady]);

	// Initialize iframe content
	useEffect(() => {
		if (!previewContent || !iframeRef.current) return;

		const iframe = iframeRef.current;
		// Use srcdoc to avoid CORS issues
		iframe.srcdoc = generateIframeHTML(previewContent);
		setIframeReady(false);
	}, [previewContent, generateIframeHTML]);

	return (
		<div className="preview-area">
			<iframe ref={iframeRef} className="preview-iframe" title="CSS Preview" sandbox="allow-scripts" loading="lazy" />
		</div>
	);
}
