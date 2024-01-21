/**
 * Sensor template structure
 */
export const sensorTemplate = {
  id: "AZM_Intraday",
  label: "AZM Intraday",
  link: "/1/user/[user-id]/activities/active-zone-minutes/date/[start-date]/[end-date]/[detail-level].json",
  description: "The number of minutes spent in each activity zone during the given day. The response includes activity log entries for the specified day.",
  arguments: [
    { name: 'user-id', type: 'text', defaultValue: '-' },
    { name: 'start-date', type: 'date', defaultValue: '2024-01-01' },
    { name: 'end-date', type: 'date', defaultValue: '2024-01-01' },
    { name: 'detail-level', type: 'select', values: ['1min', '5min', '15min'], defaultValue: '1min' },
    { name: 'boolean-type', type: 'boolean', defaultValue: true}
  ],
  parameters: [
    { name: 'timezone', type: 'select', values: ['UTC'], defaultValue: 'UTC' }
  ]
}