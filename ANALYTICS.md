# Analytics Setup

This site supports Google Analytics 4 page-view tracking.

1. Create a GA4 web data stream for `https://anivelaga.com`.
2. Copy the Measurement ID. It looks like `G-XXXXXXXXXX`.
3. In GitHub, open the repository settings and add a repository variable:
   - Name: `GA_MEASUREMENT_ID`
   - Value: your GA4 Measurement ID
4. Re-run the GitHub Pages deploy workflow, or push a new commit.

The site records route changes across the portfolio and project pages. If the
variable is missing, analytics stays disabled and the site still works normally.
