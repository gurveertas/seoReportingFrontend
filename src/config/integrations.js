export const integrationDefinitions = [
  {
    id: 'gsc',
    title: 'Google Search Console',
    description: 'Connect the Search Console property used for search reports.',
    field: { name: 'property_url', label: 'Property URL', placeholder: 'https://example.com/', type: 'url' },
  },
  {
    id: 'ga4',
    title: 'Google Analytics 4',
    description: 'Set the GA4 property used for website analytics.',
    field: { name: 'property_id', label: 'Property ID', placeholder: '123456789' },
  },
  {
    id: 'google_sheets',
    title: 'Google Sheets',
    description: 'Set the spreadsheet used for additional reporting data.',
    field: { name: 'property_id', label: 'Spreadsheet ID', placeholder: 'spreadsheet-id' },
  },
]

export function createEmptyIntegrations() {
  return Object.fromEntries(integrationDefinitions.map(({ id, field }) => [
    id,
    { enabled: false, [field.name]: '' },
  ]))
}
