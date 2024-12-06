document.addEventListener("DOMContentLoaded", () => {
    const datesContainer = document.querySelector(".dates");
    const timeSlotsContainer = document.querySelector(".time-slots");
    const currentMonthDisplay = document.getElementById("current-month");
    const selectedDateDisplay = document.querySelector(".selected-date");
  
    let currentDate = new Date(); // Current date
    let selectedDate = new Date(); // Initially set to today's date
  
    const timeSlots = [
      "12:30–1:00 PM",
      "1:00–1:30 PM",
      "1:30–2:00 PM",
      "2:00–2:30 PM",
      "2:30–3:00 PM",
      "3:00–3:30 PM",
      "3:30–4:00 PM",
      "4:00–4:30 PM",
      "4:30–5:00 PM",
    ];
  
    // Generate calendar days dynamically
    const generateCalendar = (date) => {
      datesContainer.innerHTML = ""; // Clear previous calendar
      const year = date.getFullYear();
      const month = date.getMonth();
      currentMonthDisplay.textContent = `${date.toLocaleString("default", {
        month: "long",
      })} ${year}`;
  
      const firstDay = new Date(year, month, 1).getDay(); // Day of the week (0-6)
      const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
  
      // Pad empty days before the 1st
      for (let i = 1; i < (firstDay === 0 ? 7 : firstDay); i++) {
        const emptySpan = document.createElement("span");
        datesContainer.appendChild(emptySpan);
      }
  
      // Generate days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateSpan = document.createElement("span");
        dateSpan.textContent = day;
        dateSpan.classList.add("date");
  
        // Highlight today's date
        if (
          year === currentDate.getFullYear() &&
          month === currentDate.getMonth() &&
          day === currentDate.getDate()
        ) {
          dateSpan.classList.add("today");
        }
  
        // Mark selected date
        if (
          year === selectedDate.getFullYear() &&
          month === selectedDate.getMonth() &&
          day === selectedDate.getDate()
        ) {
          dateSpan.classList.add("selected");
        }
  
        // Add click listener to select a date
        dateSpan.addEventListener("click", () => {
          selectedDate = new Date(year, month, day);
          updateSelectedDateDisplay();
          updateAvailableTimeSlots();
          generateCalendar(selectedDate); // Re-render to reflect the selected date
        });
  
        datesContainer.appendChild(dateSpan);
      }
    };
  
    // Update the available time slots based on the selected date
    const updateAvailableTimeSlots = () => {
      timeSlotsContainer.innerHTML = ""; // Clear previous time slots
      const isToday =
        selectedDate.toDateString() === currentDate.toDateString();
      const currentHour = currentDate.getHours();
      const currentMinutes = currentDate.getMinutes();
  
      timeSlots.forEach((slot) => {
        const [start, end] = slot.split("–");
        const [startHour, startMinutes] = parseTime(start);
  
        // If today, show only upcoming slots
        if (
          !isToday ||
          (startHour > currentHour ||
            (startHour === currentHour && startMinutes > currentMinutes))
        ) {
          const timeButton = document.createElement("button");
          timeButton.textContent = slot;
          timeButton.addEventListener("click", () => {
            document
              .querySelectorAll(".time-slots button")
              .forEach((btn) => btn.classList.remove("selected"));
            timeButton.classList.add("selected");
          });
          timeSlotsContainer.appendChild(timeButton);
        }
      });
    };
  
    // Update the selected date display
    const updateSelectedDateDisplay = () => {
      selectedDateDisplay.textContent = selectedDate.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      );
    };
  
    // Parse a time string like "1:30 PM" into hour and minute
    const parseTime = (time) => {
      const [hourMin, period] = time.split(" ");
      let [hour, minutes] = hourMin.split(":").map(Number);
      if (period === "PM" && hour !== 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;
      return [hour, minutes || 0];
    };
  
    // Navigation: Go to the next month
    document.getElementById("next-month").addEventListener("click", () => {
      selectedDate.setMonth(selectedDate.getMonth() + 1);
      generateCalendar(selectedDate);
    });
  
    // Navigation: Go to the previous month
    document.getElementById("prev-month").addEventListener("click", () => {
      selectedDate.setMonth(selectedDate.getMonth() - 1);
      generateCalendar(selectedDate);
    });
  
    // Initialize
    generateCalendar(currentDate);
    updateSelectedDateDisplay();
    updateAvailableTimeSlots();
  });
  