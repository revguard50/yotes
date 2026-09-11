# Branded-domain launch checklist

The site is prepared to move from the Render subdomain to a standalone branded domain without changing unrelated Vsimple sites.

1. Register or select the approved standalone domain.
2. Add only that domain to the existing Agent Explorer service.
3. Set `SITE_ORIGIN` to the final HTTPS origin before the production build.
4. Add the DNS record supplied by the hosting platform.
5. Wait for TLS issuance and confirm the certificate is active.
6. Rebuild so canonical URLs, Open Graph URLs, schema, robots, and the sitemap use the branded origin.
7. Redirect the old Render address to the branded domain after the new domain is verified.
8. Add the new origin to analytics, CRM form, cookie-consent, and advertising allowlists.
9. Submit the new sitemap to the chosen search-console account.

No DNS change or custom-domain attachment should be made until the domain is owned and explicitly selected.
