import ApiCalendar from 'react-google-calendar-api';

const config = {
  clientId: '413254612236-28a9fg39rjgao9k91csakuhoms41r9ok.apps.googleusercontent.com',
  apiKey: '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',
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  discoveryDocs: [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ],
};

const apiCalendar = new ApiCalendar(config);

export default apiCalendar;
