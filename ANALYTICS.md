# Analytics Setup

This site supports Google Analytics 4 page-view tracking.

1. Create a GA4 web data stream for `https://anivelaga.com`.
2. Copy the Measurement ID. It looks like `G-XXXXXXXXXX`.
3. Add the Measurement ID to the deployed build as `VITE_GA_MEASUREMENT_ID`.
   For local testing, put it in `.env.local`.
4. Re-run the GitHub Pages deploy workflow, or push a new commit after the
   deploy environment is configured with that value.

The site records route changes across the portfolio and project pages. If the
variable is missing, analytics stays disabled and the site still works normally.
