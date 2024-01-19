const sensors = [
  {
    id: "AZM_Intraday",
    label: "AZM Intraday",
    link: "/1/user/[user-id]/activities/active-zone-minutes/date/[start-date]/[end-date]/[detail-level].json",
    description: "The number of minutes spent in each activity zone during the given day. The response includes activity log entries for the specified day.",
    arguments: ['user-id', 'start-date', 'end-date', 'detail-level'],
    defaultValues: ['-', '2024-01-01', '2024-01-01', '1min'],
    parameters: [
      { 'timezone': 'UTC' }
    ]
  },
  {
    id: "AZM_Intraday_byDate",
    label: "AZM Intraday by Date",
    link: "/1/user/[user-id]/activities/active-zone-minutes/date/[start-date]/1d/[detail-level].json",
    description: "The number of minutes spent in each activity zone during the given day. The response includes activity log entries for the specified day.",
    arguments: ['user-id', 'start-date', 'detail-level'],
    defaultValues: ['-', '2024-01-01', '1min'],
    parameters: []
  },
  {
    id: "Activity_Intraday",
    label: "Activity Time Series Intraday",
    link: "/1/user/[user-id]/activities/[resource]/date/[start-date]/[end-date]/[detail-level].json",
    description: "retrieves the activity intraday time series data for a given resource on a specific date range for a 24 hour period.",
    arguments: ['user-id', 'resource', 'start-date', 'end-date', 'detail-level'],
    defaultValues: ['-', 'steps' ,'2024-01-01', '2024-01-01', '1min'],
    //defaultValues: ['-', ['calories' , 'distance', 'elevation', 'floors', 'steps'] ,'2023-12-10', '2024-01-01', '1min'],
    parameters: []
  },  
  {
    id: "Activity_Intraday_byDate",
    label: "Activity Time Series Intraday By Date",
    link: "/1/user/[user-id]/activities/[resource]/date/[start-date]/1d/[detail-level].json",
    description: "retrieves the activity intraday time series data for a given resource on a specific date range for a 24 hour period.",
    arguments: ['user-id', 'resource', 'start-date', 'detail-level'],
    defaultValues: ['-', 'steps' ,'2024-01-01', '1min'],
    //defaultValues: ['-', ['calories' , 'distance', 'elevation', 'floors', 'steps'] ,'2023-12-10', '2024-01-01', '1min'],
    parameters: []
  },
  {
    id: "Breathing_Intraday",
    label: "Breathing Rate Intraday",
    link: "/1/user/[user-id]/br/date/[start-date]/[end-date]/all.json",
    description: "retrieves a summary and list of a user's heart rate and step activities for a given day.",
    arguments: ['user-id', 'start-date', 'end-date'],
    defaultValues: ['-', '2023-12-05', '2024-01-01'],
    parameters: []
  },
  {
    id: "HeartRate_Intraday",
    label: "Heart Rate Intraday",
    link: "/1/user/[user-id]/activities/heart/date/[start-date]/1d/[detail-level].json",
    description: "retrieves a summary and list of a user's heart rate and step activities for a given day.",
    arguments: ['user-id', 'start-date', 'detail-level'],
    defaultValues: ['-', '2024-01-01', '1min'],
    parameters: [{
      'timezone': 'UTC'
    }]
  },
  {
    id: "HRV_Intraday",
    label: "HRV Intraday",
    link: "/1/user/[user-id]/hrv/date/[start-date]/all.json",
    description: "retrieves a summary and list of a user's heart rate and step activities for a given day.",
    arguments: ['user-id', 'start-date'],
    defaultValues: ['-', '2024-01-01'],
    parameters: []
  },
  {
    id: "SpO2_Intraday",
    label: "SpO2 Intraday",
    link: "/1/user/[user-id]/spo2/date/[start-date]/all.json",
    description: "pO2 intraday data for a specified date range. SpO2 applies specifically to a user’s “main sleep”, which is the longest single period of time asleep on a given date. Spo2 values are calculated on a 5-minute exponentially-moving average.",
    arguments: ['user-id', 'start-date',],
    defaultValues: ['-', '2024-01-01'],
    parameters: []
  },
  {
    id: "Sleep_Log",
    label: "Sleep Log by Date Range",
    link: "/1.2/user/[user-id]/sleep/date/[start-date]/[end-date].json",
    description: "returns a list of a user's sleep log entries for a date range. The data returned for either date can include a sleep period that ended that date but began on the previous date.",
    arguments: ['user-id', 'start-date', 'end-date'],
    defaultValues: ['-', '2023-10-01', '2024-01-01'],
    parameters: []
  },
  {
    id: "Sleep_Log_List",
    label: "Sleep Log List",
    link: "/1.2/user/[user-id]/sleep/list.json",
    description: " returns a list of a user's sleep log entries before or after a given date, and specifying offset, limit and sort order. The data returned for different dates can include sleep periods that began on the previous date.",
    arguments: ['user-id'],
    defaultValues: ['-'],
    //parameters: ['beforeDate', 'afterDate', 'sort', 'offset', 'limit']
    parameters: [
      { 'beforeDate': '2024-01-01' },
      {'sort': 'desc'},
      {'offset': 0},
      {'limit': 100}
    ]
  },
  // {
  //   id: "Activity_Log_List",
  //   label: "Activity Log List",
  //   link: "/1/user/[user-id]/activities/list.json",
  //   description: "Retrieves a list of a user's activity log entries before or after a given day.",
  //   arguments: ['user-id'],
  //   parameters: ['beforeDate', 'afterDate', 'sort', 'offset', 'limit']
  // },
  {
    id: "VO2_Max_Summary",
    label: "VO2 Max Summary",
    link: "/1/user/[user-id]/cardioscore/date/[start-date]/[end-date].json",
    description: "returns a list of a user's VO2max and resting heart rate values for a given date range.",
    arguments: ['user-id', 'start-date', 'end-date'],
    defaultValues: ['-', '2023-10-01', '2024-01-01'],
    parameters: []
  },
  {
    id: "ECG_Log_List",
    label: "ECG Log List",
    link: "/1/user/[user-id]/ecg/list.json",
    description: "returns a list of a user's ECG log entries before or after a given day.",
    arguments: ['user-id'],
    defaultValues: ['-'],
    //parameters: ['beforeDate', 'afterDate', 'sort', 'offset', 'limit']
    parameters: [
      { 'beforeDate': '2024-01-01' },
      {'sort': 'desc'},
      {'offset': 0},
      {'limit': 10}
    ]
  },
  {
    id: "Temperature_Core",
    label: "Temperature (Core) Summary",
    link: "/1/user/[user-id]/temp/core/date/[start-date]/[end-date].json",
    description: "returns Temperature (Core) data for a date range. Temperature (Core) data applies specifically to data logged manually by the user on a given day. It only returns a value for dates on which the Fitbit device was able to record Temperature (Core) data and the maximum date range cannot exceed 30 days.",
    arguments: ['user-id', 'start-date', 'end-date'],
    defaultValues: ['-', '2023-10-01', '2024-01-01'],
    parameters: []
  },
  {
    id: "Temperature_Skin",
    label: "Temperature (Skin) Summary",
    link: "/1/user/[user-id]/temp/skin/date/[start-date]/[end-date].json",
    description: "returns Temperature (Skin) data for a date range. It only returns a value for dates on which the Fitbit device was able to record Temperature (skin) data and the maximum date range cannot exceed 30 days.",
    arguments: ['user-id', 'start-date', 'end-date'],
    defaultValues: ['-', '2023-10-01', '2024-01-01'],
    parameters: []
  }
];

export { sensors };