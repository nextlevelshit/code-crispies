import React, { useRef, useEffect } from "react";

// Preview Component - renders iframe with lesson content
export function PreviewArea({ previewContent }) {
	const iframeRef = useRef(null);

	useEffect(() => {
		if (!previewContent || !iframeRef.current) return;

		const iframe = iframeRef.current;
		const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

		iframeDoc.open();

		if (previewContent.mode === "tailwind") {
			iframeDoc.write(`
				<!DOCTYPE html>
				<html>
					<head>
						<script src="${previewContent.tailwindCDN}"></script>
						<style>${previewContent.baseCSS || ""}</style>
						<style>${previewContent.sandboxCSS || ""}</style>
					</head>
					<body>
						${previewContent.html || ""}
					</body>
				</html>
			`);
		} else {
			iframeDoc.write(`
				<!DOCTYPE html>
				<html>
					<head>
						<style>${previewContent.baseCSS || ""}</style>
						<style>${previewContent.userCSS || ""}</style>
						<style>${previewContent.sandboxCSS || ""}</style>
					</head>
					<body>
						${previewContent.html || ""}
					</body>
				</html>
			`);
		}

		iframeDoc.close();
	}, [previewContent]);

	return (
		<div className="preview-area">
			<iframe ref={iframeRef} style={{ width: "100%", height: "100%", border: "none" }} title="Preview" />
		</div>
	);
}
