import { downloadSensorSettingsTemplate } from "./downloadSensorSettingsTemplate";

/**
 * Project doc in firestroe template structure
 */
export const projectDocTemplate = {
  "name": "tt",
  "devices": [
      "BPBM4V",
      "BPCPPB",
      "BQNN98"
  ],
  "sensors": [
      "AZM_Intraday",
      "AZM_Intraday_byDate",
      "Activity_Intraday",
      "Activity_Intraday_byDate",
      "Breathing_Intraday",
      "HeartRate_Intraday",
      "HRV_Intraday",
      "SpO2_Intraday",
      "Sleep_Log",
      "Sleep_Log_List",
      "VO2_Max_Summary",
      "ECG_Log_List",
      "Temperature_Core",
      "Temperature_Skin"
  ],
  "settings": {
      "dateRange": {
          "to": {
              "seconds": 1706767200,
              "nanoseconds": 0
          },
          "from": {
              "seconds": 1704088800,
              "nanoseconds": 0
          }
      },
      "enabled": true,
      "detailLevel": "1min"
  },
  downloadSettings: downloadSensorSettingsTemplate,
  "createdAt": {
      "seconds": 1706172802,
      "nanoseconds": 883000000
  },
  "updatedAt": {
      "seconds": 1706172802,
      "nanoseconds": 883000000
  }
}