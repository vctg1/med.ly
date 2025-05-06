import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import apiCalendar from '../../../services/googleCalendar';
import { Box } from '@mui/material';

export default function Agenda() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  const checkLoginStatus = () => {
    const signedIn = apiCalendar.sign;
    setIsSignedIn(signedIn);
  };

  const handleAuthClick = async () => {
    try {
      await apiCalendar.handleAuthClick();
      checkLoginStatus();
    } catch (err) {
      setError('Erro ao autenticar com o Google');
    }
  };

  const handleSignOutClick = async () => {
    await apiCalendar.handleSignoutClick();
    setIsSignedIn(false);
    setEvents([]);
  };

  const listEventsForNext30Days = async () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

    try {
      const res = await apiCalendar.listEvents({
        timeMin: now.toISOString(),
        timeMax: thirtyDaysFromNow.toISOString(),
        showDeleted: false,
        maxResults: 100,
        orderBy: 'startTime',
      });
      console.log(res.result)

      setEvents(res.result?.items || []);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      /* setError('Erro ao carregar eventos do calendário'); */
    }
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((event) => {
      const eventDate = (event.start.dateTime || event.start.date || '').split('T')[0];
      return eventDate === dateStr;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dailyEvents = getEventsForDate(date);
      if (dailyEvents.length > 0) {
        return <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full mx-auto" />;
      }
    }
    return null;
  };

  useEffect(() => {
    if (isSignedIn) listEventsForNext30Days();
  }, [isSignedIn]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!isSignedIn ? (
        <button
          onClick={handleAuthClick}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Entrar com Google
        </button>
      ) : (
        <>
          <button
            onClick={handleSignOutClick}
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
          >
            Sair
          </button>
            <Box display={'flex'} justifyContent={'center'} >

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            />
            </Box>

          <h2 className="text-xl font-semibold mt-6 mb-2">
            Eventos do dia {selectedDate.toLocaleDateString()}
          </h2>
          <ul className="space-y-2">
            {getEventsForDate(selectedDate).length === 0 ? (
              <p>Nenhum evento.</p>
            ) : (
              getEventsForDate(selectedDate).map((event) => (
                <li key={event.id} className="border p-3 rounded shadow">
                  <strong>{event.summary}</strong>
                  <p className="text-sm text-gray-600">
                    {event.start.dateTime
                      ? new Date(event.start.dateTime).toLocaleTimeString()
                      : 'Dia inteiro'}
                  </p>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}