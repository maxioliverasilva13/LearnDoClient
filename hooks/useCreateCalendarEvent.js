const useCreateCalendarEvent = async (token, eventData) => {
    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        // 'https://www.googleapis.com/calendar/v3/calendars/dea787183a303740a6e9a94a1a5f7b284759f814ae02a9fdade5acde7aa0e583@group.calendar.google.com/events',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(eventData),
        }
      ).then((data) => {
        return data.json();
      }).then((data) => {
        console.log("resp: ", data);
        console.log("evento creado, chequea tu calendario");
      }).catch((error) => {
        console.log("errooor: ", error);
      });
  
      // if (!response?.ok) {
      //   throw new Error('Error al crear el evento en el calendario');
      // }
  
      const data = await response?.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export { useCreateCalendarEvent };
  