# Complexity Explorer

An interactive web page that explains and visualizes common time & space complexity classes and algorithm examples.

How to run
- Open `index.html` in your browser (no server required).

Run tests
- (Optional) Install Node.js if you want to run simple validations locally.
  - `npm test` (from the `c:\Workspace\complexity-demo` folder) — this runs basic JSON validation for algorithm entries (node required).

Accessibility & UX polish
- Legend items are keyboard/ARIA friendly, tooltips appear on hover over the plot, and colors have been tuned for contrast.

Deploying to GitHub Pages
- This repository includes a GitHub Actions workflow that deploys the site automatically when you push to the `main` branch.

Steps to publish:
1. Create a GitHub repository (e.g., `your-username/complexity-explorer`).
2. Push the project to `main`:
   - git init
   - git add .
   - git commit -m "Initial site"
   - git branch -M main
   - git remote add origin https://github.com/<your-username>/<repo>.git
   - git push -u origin main
3. The workflow (`.github/workflows/pages.yml`) will run and deploy the repository root as a Pages site. After the run completes, your site will be available at `https://<your-username>.github.io/<repo>/`.

Notes & tips
- If you want a custom domain, add `CNAME` in the repository root and configure DNS.
- If you'd rather serve from `docs/` on `main`, move site files into `docs/` and update the workflow accordingly.
- To run the basic JSON tests locally: `npm test` (Node.js required).

Features
- Plot comparisons of complexity classes (O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n)) with toggleable legend items
- Browse common algorithms and see their time/space complexities and short code snippets
- Sorting visualizer (Bubble, Insertion, Merge, Quick) with step-by-step animations
- Responsive canvas sizes and modal overlay for better mobile/desktop experience

Files
- `index.html` - main page
- `styles.css` - styling
- `scripts.js` - interactivity and plotting
- `data/algorithms.json` - algorithm data and explanations

Notes
- This is a lightweight static demo meant for learning and demonstration. Feel free to extend with additional algorithms, animations, or more detailed visualizations.
