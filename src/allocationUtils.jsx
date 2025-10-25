// src/allocationUtils.jsx
export const performOCR = async (file, setProcessingStatus) => {
  return new Promise((resolve, reject) => {
    if (window.Tesseract) {
      performOCRWithTesseract(file, setProcessingStatus).then(resolve).catch(reject);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
    script.onload = async () => {
      try {
        const text = await performOCRWithTesseract(file, setProcessingStatus);
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = () => reject(new Error('Failed to load OCR library'));
    document.head.appendChild(script);
  });
};

export const performOCRWithTesseract = async (file, setProcessingStatus) => {
  const worker = await window.Tesseract.createWorker({
    logger: m => {
      if (m.status === 'recognizing text') {
        const progress = Math.round(m.progress * 100);
        setProcessingStatus(`OCR in progress: ${progress}%`);
      }
    }
  });
  
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  
  // Enhanced OCR settings for timetable recognition
  await worker.setParameters({
    tessedit_pageseg_mode: window.Tesseract.PSM.AUTO_OSD,
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789():-,.| ',
    preserve_interword_spaces: '1'
  });
  
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  
  return text;
};

export const parseTimetable = (text) => {
  console.log("Raw OCR Text:", text);
  
  // First, try structured parsing for timetable format
  let parsedData = parseStructuredTimetable(text);
  
  // If structured parsing fails, try alternative method
  if (parsedData.length === 0) {
    parsedData = parseAlternativeTimetable(text);
  }
  
  // Generate CSV file from parsed data
  if (parsedData.length > 0) {
    generateCSVFromTimetable(parsedData, 'Extracted_Timetable');
  }
  
  console.log("Parsed Timetable Data:", parsedData);
  return parsedData;
};

// Enhanced structured parsing for timetable format
const parseStructuredTimetable = (text) => {
  const parsed = [];
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  const timeSlots = [
    { time: '08:15', duration: 50 },
    { time: '09:05', duration: 50 },
    { time: '10:10', duration: 50 },
    { time: '11:00', duration: 50 },
    { time: '11:50', duration: 50 },
    { time: '13:30', duration: 45 },
    { time: '14:15', duration: 45 },
    { time: '15:00', duration: 45 }
  ];

  const dayMap = {
    'MON': 'Monday',
    'TUES': 'Tuesday',
    'WED': 'Wednesday', 
    'THURS': 'Thursday',
    'FRI': 'Friday'
  };

  let currentDay = '';
  let timeSlotIndex = 0;
  let isProcessingDay = false;

  lines.forEach(line => {
    const upperLine = line.trim().toUpperCase();
    
    // Check for day headers
    for (const [shortDay, fullDay] of Object.entries(dayMap)) {
      if (upperLine.includes(shortDay)) {
        currentDay = fullDay;
        timeSlotIndex = 0;
        isProcessingDay = true;
        
        // Extract subjects from the same line after day
        const dayIndex = upperLine.indexOf(shortDay);
        const restOfLine = line.substring(dayIndex + shortDay.length).trim();
        const subjects = extractSubjects(restOfLine);
        
        subjects.forEach((subject, idx) => {
          if (timeSlotIndex < timeSlots.length) {
            const isLab = isLabSession(subject, line);
            parsed.push({
              subject: subject,
              day: currentDay,
              time: timeSlots[timeSlotIndex].time,
              duration: isLab ? 120 : timeSlots[timeSlotIndex].duration,
              students: isLab ? 30 : 60,
              type: isLab ? 'LAB' : 'THEORY'
            });
            timeSlotIndex++;
          }
        });
        break;
      }
    }

    // Process subject lines for current day
    if (isProcessingDay && currentDay && !Object.keys(dayMap).some(day => upperLine.includes(day))) {
      const subjects = extractSubjects(upperLine);
      
      subjects.forEach((subject, idx) => {
        if (timeSlotIndex < timeSlots.length) {
          const isLab = isLabSession(subject, line);
          parsed.push({
            subject: subject,
            day: currentDay,
            time: timeSlots[timeSlotIndex].time,
            duration: isLab ? 120 : timeSlots[timeSlotIndex].duration,
            students: isLab ? 30 : 60,
            type: isLab ? 'LAB' : 'THEORY'
          });
          timeSlotIndex++;
        }
      });
      
      // Reset for next day if we've processed all time slots
      if (timeSlotIndex >= timeSlots.length) {
        isProcessingDay = false;
      }
    }
  });

  return parsed;
};

// Alternative parsing method
const parseAlternativeTimetable = (text) => {
  const parsed = [];
  const lines = text.split('\n');
  
  const timeSlots = [
    '08:15', '09:05', '10:10', '11:00', '11:50', '13:30', '14:15', '15:00'
  ];

  const dayMap = {
    'MON': 'Monday',
    'TUES': 'Tuesday',
    'WED': 'Wednesday',
    'THURS': 'Thursday',
    'FRI': 'Friday'
  };

  let currentDay = '';
  let currentRow = [];

  lines.forEach(line => {
    const upperLine = line.trim().toUpperCase();
    
    // Check for day headers
    Object.entries(dayMap).forEach(([shortDay, fullDay]) => {
      if (upperLine.startsWith(shortDay) || upperLine.includes(` ${shortDay} `)) {
        currentDay = fullDay;
        // Extract subjects from the same line if available
        const subjects = extractSubjects(upperLine.replace(shortDay, '').trim());
        if (subjects.length > 0) {
          subjects.forEach((subject, idx) => {
            if (idx < timeSlots.length) {
              parsed.push(createSession(subject, currentDay, timeSlots[idx]));
            }
          });
        }
      }
    });

    // If we have a current day, look for subject rows
    if (currentDay && upperLine.length > 0 && 
        !upperLine.includes('DAY') && 
        !upperLine.includes('TIME') &&
        !upperLine.includes('BREAK') &&
        !upperLine.includes('LUNCH')) {
      
      const subjects = extractSubjects(upperLine);
      if (subjects.length > 0) {
        subjects.forEach((subject, idx) => {
          if (idx < timeSlots.length) {
            parsed.push(createSession(subject, currentDay, timeSlots[idx]));
          }
        });
      }
    }
  });

  return parsed;
};

// Helper function to extract subjects from text
const extractSubjects = (text) => {
  const commonSubjects = [
    'FAIML', 'OOPJ', 'DPCO', 'DM', 'CN', 'DSA', 'AT', 'TT', 'CSD-I', 'COUN',
    'OOPJ(L)', 'FAIML(L)', 'DPCO(L)', 'DSA(L)', 'BREAK', 'LUNCH'
  ];
  
  // Split by common separators and filter
  const words = text.split(/[\s\|\/\t]+/).filter(word => 
    word.length > 1 && 
    !word.match(/^\d+\.\d+|^\d+:\d+/) &&
    (commonSubjects.includes(word) || /^[A-Z]{2,}/.test(word))
  );
  
  // Remove BREAK and LUNCH from subjects
  return words.filter(word => !['BREAK', 'LUNCH'].includes(word));
};

// Helper function to identify lab sessions
const isLabSession = (subject, originalLine) => {
  return subject.includes('LAB') || 
         subject.includes('(L)') || 
         subject.includes('L)') ||
         originalLine.includes('(L)') ||
         ['DSA', 'OOPJ', 'FAIML', 'DPCO'].includes(subject.replace('(L)', '')) && 
         originalLine.includes('(L)');
};

// Create session object
const createSession = (subject, day, time) => {
  const isLab = isLabSession(subject, '');
  return {
    subject: subject,
    day: day,
    time: time,
    duration: isLab ? 120 : 
            (time === '13:30' || time === '14:15' || time === '15:00') ? 45 : 50,
    students: isLab ? 30 : 60,
    type: isLab ? 'LAB' : 'THEORY'
  };
};

// Generate CSV file from timetable data
export const generateCSVFromTimetable = (timetableData, fileName) => {
  if (!timetableData || timetableData.length === 0) {
    console.log('No data to generate CSV');
    return null;
  }
  
  let csvContent = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  
  // Header
  csvContent += 'Subject,Day,Time,Duration (min),Students,Type\n';
  
  // Data rows
  timetableData.forEach(session => {
    const subject = (session.subject || '').replace(/,/g, ' ');
    csvContent += `${subject},${session.day},${session.time},${session.duration},${session.students},${session.type}\n`;
  });
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log(`CSV file generated with ${timetableData.length} sessions`);
  return csvContent;
};

// Rest of the utility functions remain the same
export const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const timeOverlap = (time1, dur1, time2, dur2) => {
  const start1 = timeToMinutes(time1);
  const end1 = start1 + dur1;
  const start2 = timeToMinutes(time2);
  const end2 = start2 + dur2;
  return (start1 < end2 && end1 > start2);
};

export const checkConflict = (room, day, time, duration, currentId, allocs, manualBookings, timeOverlapFn) => {
  const conflictWithAllocations = allocs.some(alloc => 
    alloc.room === room && alloc.day === day && alloc.id !== currentId &&
    timeOverlapFn(alloc.time, alloc.duration, time, duration)
  );
  
  const conflictWithBookings = manualBookings.some(booking =>
    booking.room === room && booking.day === day &&
    timeOverlapFn(booking.time, booking.duration, time, duration)
  );
  
  return conflictWithAllocations || conflictWithBookings;
};

export const allocateRooms = (classes, manualBookings, classrooms, checkConflictFn) => {
  const newAllocations = [];
  const newConflicts = [];
  
  classes.forEach(classData => {
    const { year, section, timetableFile, labRules } = classData;
    
    timetableFile.forEach(session => {
      const sessionId = `${year}-${section}-${session.day}-${session.time}`;
      
      const labRule = labRules.find(rule => 
        session.subject.includes(rule.subject.split('(')[0].trim())
      );
      
      if (labRule) {
        if (labRule.labType === 'split') {
          const batch1 = {
            id: sessionId + '-batch1',
            subject: `${session.subject} (Batch 1)`,
            department: 'IT',
            year: year,
            section: section,
            students: labRule.strength,
            day: session.day,
            time: session.time,
            duration: session.duration,
            room: labRule.batch1Room,
            building: 'IT Block',
            roomCapacity: 30,
            utilization: ((labRule.strength / 30) * 100).toFixed(1),
            type: 'LAB'
          };
          
          const batch2 = {
            id: sessionId + '-batch2',
            subject: `${session.subject} (Batch 2)`,
            department: 'IT',
            year: year,
            section: section,
            students: labRule.strength,
            day: session.day,
            time: session.time,
            duration: session.duration,
            room: labRule.batch2Room,
            building: 'IT Block',
            roomCapacity: 30,
            utilization: ((labRule.strength / 30) * 100).toFixed(1),
            type: 'LAB'
          };
          
          if (!checkConflictFn(batch1.room, batch1.day, batch1.time, batch1.duration, batch1.id, newAllocations)) {
            newAllocations.push(batch1);
          } else {
            newConflicts.push({ ...batch1, reason: 'Room conflict for Batch 1' });
          }
          
          if (!checkConflictFn(batch2.room, batch2.day, batch2.time, batch2.duration, batch2.id, newAllocations)) {
            newAllocations.push(batch2);
          } else {
            newConflicts.push({ ...batch2, reason: 'Room conflict for Batch 2' });
          }
        } else {
          const wholeClass = {
            id: sessionId,
            subject: session.subject,
            department: 'IT',
            year: year,
            section: section,
            students: 60,
            day: session.day,
            time: session.time,
            duration: session.duration,
            room: labRule.wholeClassRoom,
            building: 'IT Block',
            roomCapacity: classrooms.find(r => r.id === labRule.wholeClassRoom)?.capacity || 60,
            utilization: ((60 / (classrooms.find(r => r.id === labRule.wholeClassRoom)?.capacity || 60)) * 100).toFixed(1),
            type: 'LAB'
          };
          
          if (!checkConflictFn(wholeClass.room, wholeClass.day, wholeClass.time, wholeClass.duration, wholeClass.id, newAllocations)) {
            newAllocations.push(wholeClass);
          } else {
            newConflicts.push({ ...wholeClass, reason: 'Room conflict' });
          }
        }
      } else {
        const suitableRooms = classrooms.filter(room => 
          room.type === 'THEORY' &&
          (room.year === year || room.year.includes(year)) &&
          room.capacity >= session.students
        ).sort((a, b) => a.capacity - b.capacity);
        
        let allocated = false;
        for (let room of suitableRooms) {
          if (!checkConflictFn(room.id, session.day, session.time, session.duration, sessionId, newAllocations)) {
            newAllocations.push({
              id: sessionId,
              subject: session.subject,
              department: 'IT',
              year: year,
              section: section,
              students: session.students,
              day: session.day,
              time: session.time,
              duration: session.duration,
              room: room.id,
              building: room.building,
              roomCapacity: room.capacity,
              utilization: ((session.students / room.capacity) * 100).toFixed(1),
              type: 'THEORY'
            });
            allocated = true;
            break;
          }
        }
        
        if (!allocated) {
          newConflicts.push({
            ...session,
            id: sessionId,
            department: 'IT',
            year: year,
            section: section,
            reason: 'No suitable room available or time conflict'
          });
        }
      }
    });
  });
  
  manualBookings.forEach(booking => {
    newAllocations.push({
      id: `manual-${booking.id}`,
      subject: `Manual Booking: ${booking.reason}`,
      department: 'IT',
      year: '-',
      section: booking.forClass || '-',
      students: '-',
      day: booking.day,
      time: booking.time,
      duration: booking.duration,
      room: booking.room,
      building: 'IT Block',
      roomCapacity: classrooms.find(r => r.id === booking.room)?.capacity || '-',
      utilization: '-',
      type: 'MANUAL',
      faculty: booking.faculty,
      reason: booking.reason
    });
  });
  
  return { allocations: newAllocations, conflicts: newConflicts };
};

export const calculateAnalytics = (allocs, confs, classrooms, manualBookings) => {
  const totalRooms = classrooms.length;
  const usedRooms = new Set(allocs.map(a => a.room)).size;
  const freeRooms = totalRooms - usedRooms;
  const avgUtilization = allocs.filter(a => a.utilization !== '-').length > 0 
    ? allocs.filter(a => a.utilization !== '-').reduce((sum, a) => sum + parseFloat(a.utilization), 0) / allocs.filter(a => a.utilization !== '-').length : 0;
  
  const byDay = {};
  allocs.forEach(a => { byDay[a.day] = (byDay[a.day] || 0) + 1; });
  
  const byYear = {};
  allocs.forEach(a => { if (a.year !== '-') byYear[a.year] = (byYear[a.year] || 0) + 1; });
  
  const roomSchedule = {};
  classrooms.forEach(room => {
    roomSchedule[room.id] = {
      room: room,
      allocations: [],
      freeSlots: []
    };
  });
  
  allocs.forEach(a => {
    if (roomSchedule[a.room]) {
      roomSchedule[a.room].allocations.push(a);
    }
  });
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:15', '09:05', '10:10', '11:00', '11:50', '13:30', '14:15', '15:00'];
  
  Object.keys(roomSchedule).forEach(roomId => {
    days.forEach(day => {
      times.forEach(time => {
        const isOccupied = roomSchedule[roomId].allocations.some(a => 
          a.day === day && timeOverlap(a.time, a.duration, time, 50)
        );
        if (!isOccupied) {
          roomSchedule[roomId].freeSlots.push({ day, time });
        }
      });
    });
  });
  
  return {
    totalAllocations: allocs.length,
    roomsUsed: usedRooms,
    totalRooms: totalRooms,
    freeRooms: freeRooms,
    utilizationRate: avgUtilization.toFixed(1),
    byDay,
    byYear,
    conflicts: confs.length,
    roomSchedule,
    manualBookingsCount: manualBookings.length
  };
};