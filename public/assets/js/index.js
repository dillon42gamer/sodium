"use strict";

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");
/**
 * @type {HTMLDivElement}
 */
const loadingOverlay = document.getElementById("loading-overlay");
/**
 * @type {HTMLIFrameElement}
 */
const iframe = document.getElementById("apploader");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    try {
      await registerSW();
    } catch (err) {
      error.textContent = "Failed to register service worker.";
      errorCode.textContent = err.toString();
      throw err;
    }
  
    const url = search(address.value, searchEngine.value);
    const encodedURL = Ultraviolet.codec.xor.encode(url);
  
    loadingOverlay.style.display = "flex";
    iframe.style.display = "none";
    iframe.src = `${window.location.origin}/sw/${encodedURL}`;
  });
}

if (iframe) {
  iframe.addEventListener("unload", () => {
    iframe.style.display = "none";
    loadingOverlay.style.display = "flex";
  });
  
  iframe.addEventListener("load", () => {
    loadingOverlay.style.display = "none";
    iframe.style.display = "block"; 
  });
}
