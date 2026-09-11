# Vsimple Agent Explorer conversion measurement

The site publishes normalized conversion events to `window.dataLayer` and also dispatches a `vsimple:conversion` browser event. This keeps the implementation vendor-neutral while making it ready for Google Tag Manager, GA4, LinkedIn Insight Tag, HubSpot, or another approved analytics destination.

## Primary funnel

1. `page_viewed`
2. `manufacturing_path_selected`
3. `artifact_demo_viewed`
4. `fit_finder_completed`
5. `agent_detail_viewed`
6. `roi_agent_selected`
7. `roi_added_to_brief`
8. `artifact_review_form_viewed`
9. `lead_submit_started`
10. `lead_submitted` or `lead_fallback_used`

The two dedicated pages also publish `workflow_page_viewed` and `artifact_review_cta_clicked`.

## Attribution captured with a lead

- Landing path
- Referrer
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `li_fat_id`

## Recommended reporting

- Landing page to workflow selection rate
- Workflow selection to artifact-demo engagement
- Artifact demo to calculator engagement
- Calculator to workflow-brief rate
- Workflow-brief to submitted-lead rate
- Submitted lead to scheduled artifact review
- Artifact review to qualified opportunity
- Qualified opportunity, pipeline, and revenue by workflow and campaign

Do not optimize toward page views alone. The most meaningful leading indicator is a prospect submitting enough workflow context to support a real-artifact review.
