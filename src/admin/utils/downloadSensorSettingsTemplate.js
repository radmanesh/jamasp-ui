/**
 * Sensor download settings template structure
 *
 */
export const downloadSensorSettingsTemplate = [
  {
    sensorId: 'AZM_Intraday',
    arguments: {
      'user-id': '-',
      'start-date': '2023-01-01',
      'end-date': '2024-01-01',
      'detail-level': '1min',
    },
    parameters: {
      'timezone': 'UTC',
    },
    enabled: true,
  },
  {
    sensorId: 'Activity_steps_Intraday',
    arguments: {
      'user-id': '-',
      'start-date': '2023-01-01',
      'end-date': '2024-01-01',
      'detail-level': '1min',
    },
    parameters: {
      'timezone': 'UTC',
    },
    enabled: true,
  }
];