// Assets live at the deployment root. A GitHub Pages project site is served
// from /<repo>/, so absolute paths are prefixed with Vite's base URL.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
