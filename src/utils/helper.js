import { message } from "antd";

export const limitText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  // Add leading zero if month or day is less than 10
  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
}
export function getTimes(event) {
  // Create Date objects from ISO strings
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  // Format time to HH:MM:SS (24-hour format)
  const startTime = startDate.toISOString().substr(11, 8); // Extracts 'HH:MM:SS'
  const endTime = endDate.toISOString().substr(11, 8);     // Same for the end date

  return {
    startTime,
    endTime
  };
}

export function addMonths(duration) {
  // Get the current date
  const now = new Date();

  // Create a new date object and set it to the current date
  const resultDate = new Date(now);

  // Add the duration in months to the current date
  resultDate.setMonth(resultDate.getMonth() + duration);

  // Format the date as "month/day/year"
  const formattedDate =
    resultDate.getMonth() +
    1 +
    "/" +
    resultDate.getDate() +
    "/" +
    resultDate.getFullYear();

  return formattedDate;
}

export function formatDateToYearMonthDay(date) {
  date = new Date(date);
  // Extract the year, month, and day from the date
  const year = date.getFullYear();
  let month = date.getMonth() + 1; // Months are zero-based
  let day = date.getDate();
  // Return the formatted date
  return `${year}-${month}-${day}`;
}

export function validateEmail(email) {
  // Regular expression for validating an Email
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}

export const toCapitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function isEighteenYearsApart(startDate, endDate) {
  // Convert the input dates to Date objects if they are not already
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if both dates are valid
  if (isNaN(start) || isNaN(end)) {
    message.warning("Invalid date(s) provided.");
  }

  // Calculate the difference in years
  const differenceInYears = end.getFullYear() - start.getFullYear();

  // Check if the difference is exactly 18 years
  if (differenceInYears >= 18) {
    return true;
  }

  return false;
}

export function validateMoroccanPhoneNumber(phoneNumber) {
  // Regular expression for validating a Moroccan phone number
  const phonePattern = /^(?:\+212|0)([ \-]?)(([5-7]\d{8}))$/;
  return phonePattern.test(phoneNumber);
}

export function removeDuplicateEmployees(data) {
  // Create a Set to store unique id_employe values
  const uniqueEmployees = new Set();

  // Filter the data array to keep only unique id_employe values
  const filteredData = data.data.filter((item) => {
    if (!uniqueEmployees.has(item.id_employe)) {
      uniqueEmployees.add(item.id_employe);
      return true;
    }
    return false;
  });

  return filteredData;
}

export function getTimeFromISOString(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Add leading zero to minutes if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes}`;
}

export function convertToDateTime(obj) {
  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  };

  const getDateOfWeekday = (weekday, weekNumber) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const januaryFirst = new Date(currentYear, 0, 1);
    const daysOffset = (weekNumber - 1) * 7 + (weekday - 1);
    const targetDate = new Date(januaryFirst);
    targetDate.setDate(januaryFirst.getDate() + daysOffset);

    // Adjust if the calculated date is in the past
    if (targetDate < now) {
      targetDate.setFullYear(currentYear + 1);
    }

    return targetDate;
  };

  const getCurrentWeek = () => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    return Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  };

  const currentWeek = getCurrentWeek();
  const targetDate = getDateOfWeekday(obj.jour, currentWeek);
  const startTime = parseTime(obj.heure_debut);
  const endTime = parseTime(obj.heure_fin);

  const startDate = new Date(targetDate);
  startDate.setHours(startTime.hours, startTime.minutes, 0, 0);

  const endDate = new Date(targetDate);
  endDate.setHours(endTime.hours, endTime.minutes, 0, 0);

  // Format the dates to the desired string format with milliseconds
  const formatDate = (date) => {
    return date.toISOString();
  };

  // Convert color from "Color(0xff673ab7)" format to hex
  const convertColor = (colorString) => {
    const match = colorString.match(/0x([0-9a-fA-F]{6})/);
    return match ? `#${match[1]}` : "#000000"; // Default to black if no match
  };

  return {
    id: obj.id_seance,
    title: obj.cour,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    color: convertColor(obj.color)
  };
}

 const adjustDateToCurrentWeek = (date, dayOfWeek) => {
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  const diff = dayOfWeek - currentDayOfWeek;
  
  // Clone the date to avoid modifying the original
  const adjustedDate = new Date(today);
  
  // Adjust to the correct day of the week
  adjustedDate.setDate(today.getDate() + diff);
  
  // If the adjusted date is in the past, move it to next week
  if (adjustedDate < today) {
    adjustedDate.setDate(adjustedDate.getDate() + 7);
  }
  
  return adjustedDate;
};

export const parseSeance = (seance) => {
  const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // Adjust the date to the current week
  const adjustedDate = adjustDateToCurrentWeek(new Date(), seance.jour);
  
  // Format the adjusted date
  const year = adjustedDate.getFullYear();
  const month = adjustedDate.getMonth() + 1; // getMonth() returns 0-11
  const day = adjustedDate.getDate();
  
  // Combine adjusted date with time
  const startDateTime = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${seance.heure_debut}`);
  const endDateTime = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${seance.heure_fin}`);
  
  return {
    ...seance,
    formatted_date: {
      year,
      month,
      day,
      dayOfWeek: seance.jour,
      dayName: dayNames[seance.jour],
    },
    date_reservation: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
  };
};

export function getTimeInHHMM(dateString) {
  const startTime = new Date(dateString);
  const hours = startTime.getHours().toString().padStart(2, "0");
  const minutes = startTime.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getDayNameInFrench(date) {
  const daysInFrench = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];
  const dayIndex = new Date(date).getDay();
  return { jour: daysInFrench[dayIndex], index: dayIndex };
}

export const getCurrentTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export async function addNewTrace(
  id_staff,
  type_operation,
  date_operation,
  description,
  cible
) {
  const url = "https://jyssrmmas.pythonanywhere.com/api/trace/";

  const data = {
    id_staff: id_staff,
    cible: cible,
    type_operation: type_operation,
    date_operation: date_operation,
    description: description,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    Alert.alert("Error", error.message);
    console.error("There was an error!", error);
  }
}

export async function addNewTraceDetail(id_trace, name, old_value, new_value) {
  const url = "https://fithouse.pythonanywhere.com/api/trace_details/";

  const data = {
    id_trace: id_trace,
    name: name,
    old_value: old_value,
    new_value: new_value,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const responseData = await response.json();
    Alert.alert("Success", "Trace detail added successfully!");
    return responseData;
  } catch (error) {
    Alert.alert("Error", error.message);
    console.error("There was an error!", error);
  }
}
