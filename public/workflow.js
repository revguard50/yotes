(() => {
  const params = new URLSearchParams(location.search)
  const attribution = {}
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'li_fat_id'].forEach(key => {
    if (params.get(key)) attribution[key] = params.get(key)
  })
  const workflow = document.body.dataset.workflow || 'manufacturing'
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'workflow_page_viewed',
    workflow,
    page_path: location.pathname,
    referrer: document.referrer || 'direct',
    ...attribution
  })

  document.querySelectorAll('a[href^="/?workflow="]').forEach(link => {
    const url = new URL(link.href)
    Object.entries(attribution).forEach(([key, value]) => url.searchParams.set(key, value))
    link.href = url.pathname + url.search + url.hash
    link.addEventListener('click', () => window.dataLayer.push({
      event: 'artifact_review_cta_clicked',
      workflow,
      placement: link.closest('.site-head') ? 'header' : link.closest('.page-cta') ? 'bottom' : 'hero'
    }))
  })
})()
