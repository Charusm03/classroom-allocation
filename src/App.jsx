import React, { useState } from 'react';
import { Calendar, Upload, Download, AlertCircle, CheckCircle, Building2, Users, TrendingUp, FileUp, Loader, X, Plus, Trash2, Clock, User, BookOpen } from 'lucide-react';

const ITClassroomAllocation = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [classes, setClasses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [manualBookings, setManualBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [currentClass, setCurrentClass] = useState({
    year: '1',
    section: 'A',
    timetableFile: null,
    timetableName: '',
    labRules: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showLabRuleModal, setShowLabRuleModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [currentLabRule, setCurrentLabRule] = useState({
    subject: '',
    labType: 'split',
    batch1Room: '',
    batch2Room: '',
    wholeClassRoom: '',
    strength: 30
  });
  const [currentBooking, setCurrentBooking] = useState({
    faculty: '',
    room: '',
    day: 'Monday',
    time: '08:15',
    duration: 50,
    reason: '',
    forClass: ''
  });
  const [viewMode, setViewMode] = useState('table');
  const [filterYear, setFilterYear] = useState('all');
  const [filterDay, setFilterDay] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const facultyList = [
    'Dr. N. ANANTHI - Professor',
    'Dr. M. MOHANA - Associate Professor',
    'Dr. S. GNANAPRIYA - Assistant Professor',
    'Dr. M. HEMA - Assistant Professor',
    'Dr. B. CHANDRA - Assistant Professor',
    'Dr. DURAI ARUMUGAM S.S.L. - Assistant Professor',
    'Mr. K.RAVINDRAN - Assistant Professor',
    'Dr. K. JOHNY ELMA - Assistant Professor',
    'Mrs. T. SARASWATHI - Assistant Professor',
    'Dr. S. PRAVEENA RACHEL KAMALA - Assistant Professor',
    'Mrs. S. ANUSHA - Assistant Professor',
    'Dr. K.SUNDAR - Assistant Professor',
    'Mrs.P. SIVASAKTHI - Assistant Professor',
    'Mrs.S.SHEREEN PRISCILA - Assistant Professor',
    'Mrs.S. SARANYA - Assistant Professor',
    'Mrs.K. SANTHI - Assistant Professor',
    'Dr.M.A. GUNAVATHIE - Assistant Professor',
    'Dr.G.MARIA KALAVATHY - Professor',
    'Mrs.T.P.DAYANA PETER - Assistant Professor',
    'Mrs.P.ABERNA (ML) - Assistant Professor',
    'Mrs.M.SWATHI - Assistant Professor',
    'Mrs.V.KUMARASUNDARI - Assistant Professor',
    'Mrs.V.KAVITHA - Assistant Professor',
    'Mrs.G.S. DEVI LAKSHMI - Assistant Professor',
    'Mrs.B.PRIYADARSHINI - Assistant Professor',
    'Mrs.K.SUDHA - Assistant Professor',
    'Ms.M.MADHUMITHA - Assistant Professor',
    'Mrs.S. SUGANYA - Assistant Professor',
    'Dr. S. BERLIN SHAHEEMA - Assistant Professor'
  ];

  const classrooms = [
    { id: '1101', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', name: 'Room 1101' },
    { id: '1102', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', name: 'Room 1102' },
    { id: '1103', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', name: 'Room 1103' },
    { id: '1104', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', name: 'Room 1104' },
    { id: '1105', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', name: 'Room 1105' },
    { id: '1106', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', name: 'Room 1106' },
    { id: '1201', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1201' },
    { id: '1202', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1202' },
    { id: '1203', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1203' },
    { id: '1204', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1204' },
    { id: '1301', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1301' },
    { id: '1302', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1302' },
    { id: '1303', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', name: 'Room 1303' },
    { id: 'Open Source Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Open Source Lab' },
    { id: 'Internet Technology Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Internet Tech Lab' },
    { id: 'Database Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Database Lab' },
    { id: 'Software Engineering Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Software Eng Lab' }
  ];

  const labSubjects = [
    'Networks Programming Lab (NP)',
    'Full Stack Web Development Lab (FSWD)',
    'Mini Project (MP)',
    'Data Structures Lab',
    'Database Lab',
    'Web Technologies Lab',
    'AI/ML Lab',
    'Cloud Computing Lab'
  ];

  const timeSlots = [
    { time: '08:15', label: '8:15 AM' },
    { time: '09:05', label: '9:05 AM' },
    { time: '10:10', label: '10:10 AM' },
    { time: '11:00', label: '11:00 AM' },
    { time: '11:50', label: '11:50 AM' },
    { time: '13:30', label: '1:30 PM' },
    { time: '14:15', label: '2:15 PM' },
    { time: '15:00', label: '3:00 PM' }
  ];

  const performOCR = async (file) => {
    return new Promise((resolve, reject) => {
      if (window.Tesseract) {
        performOCRWithTesseract(file).then(resolve).catch(reject);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
      script.onload = async () => {
        try {
          const text = await performOCRWithTesseract(file);
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error('Failed to load OCR library'));
      document.head.appendChild(script);
    });
  };

  const performOCRWithTesseract = async (file) => {
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
    await worker.setParameters({
      tessedit_pageseg_mode: window.Tesseract.PSM.AUTO,
    });
    const { data: { text } } = await worker.recognize(file);
    await worker.terminate();
    
    return text;
  };

  const parseTimetable = (text) => {
    const parsed = [];
    const days = ['MON', 'MONDAY', 'TUE', 'TUES', 'TUESDAY', 'WED', 'WEDNESDAY', 'THU', 'THUR', 'THURS', 'THURSDAY', 'FRI', 'FRIDAY'];
    const dayMap = { 
      'MON': 'Monday', 'MONDAY': 'Monday',
      'TUE': 'Tuesday', 'TUES': 'Tuesday', 'TUESDAY': 'Tuesday',
      'WED': 'Wednesday', 'WEDNESDAY': 'Wednesday',
      'THU': 'Thursday', 'THUR': 'Thursday', 'THURS': 'Thursday', 'THURSDAY': 'Thursday',
      'FRI': 'Friday', 'FRIDAY': 'Friday'
    };
    
    const timeSlotsDef = [
      { time: '08:15', duration: 50 },
      { time: '09:05', duration: 50 },
      { time: '10:10', duration: 50 },
      { time: '11:00', duration: 50 },
      { time: '11:50', duration: 50 },
      { time: '13:30', duration: 45 },
      { time: '14:15', duration: 45 },
      { time: '15:00', duration: 45 }
    ];
    
    const lines = text.split('\n');
    let currentDay = null;
    
    for (let line of lines) {
      const upperLine = line.trim().toUpperCase();
      
      for (let day of days) {
        if (upperLine.includes(day)) {
          currentDay = dayMap[day];
          
          const restOfLine = line.substring(upperLine.indexOf(day) + day.length).trim();
          const subjects = restOfLine.split(/[\s\|\/\t]+/).filter(s => 
            s.length > 1 && 
            !s.match(/BREAK|LUNCH|^\d+\.\d+|^\d+:\d+/) &&
            s.match(/[A-Z]{2,}/)
          );
          
          subjects.forEach((subject, idx) => {
            if (idx < timeSlotsDef.length) {
              const isLab = subject.includes('LAB') || subject.includes('PROJECT') || subject.includes('MP') || subject.includes('FSWD');
              parsed.push({
                subject: subject.trim(),
                day: currentDay,
                time: timeSlotsDef[idx].time,
                duration: isLab ? 120 : 50,
                students: isLab ? 30 : 60
              });
            }
          });
          break;
        }
      }
      
      if (currentDay && !days.some(d => upperLine.includes(d))) {
        const subjects = line.trim().split(/[\s\|\/\t]+/).filter(s => 
          s.length > 1 && 
          !s.match(/BREAK|LUNCH|^\d+\.\d+|^\d+:\d+/) &&
          s.match(/[A-Z]{2,}/)
        );
        
        if (subjects.length > 0 && subjects.length <= timeSlotsDef.length) {
          subjects.forEach((subject, idx) => {
            const isLab = subject.includes('LAB') || subject.includes('PROJECT') || subject.includes('MP') || subject.includes('FSWD');
            parsed.push({
              subject: subject.trim(),
              day: currentDay,
              time: timeSlotsDef[idx].time,
              duration: isLab ? 120 : 50,
              students: isLab ? 30 : 60
            });
          });
        }
      }
    }
    
    return parsed;
  };

  const handleTimetableUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus('Processing timetable...');

    try {
      let text = '';
      
      if (file.type.startsWith('image/')) {
        setProcessingStatus('Extracting text from image...');
        text = await performOCR(file);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        text = await file.text();
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        throw new Error('Unsupported file format');
      }

      const timetableData = parseTimetable(text);
      
      if (timetableData.length === 0) {
        throw new Error('No timetable data extracted. Please check image quality or format.');
      }
      
      setCurrentClass({
        ...currentClass,
        timetableFile: timetableData,
        timetableName: file.name
      });
      
      setProcessingStatus(`Timetable loaded! ${timetableData.length} sessions extracted`);
    } catch (error) {
      console.error('Error processing timetable:', error);
      setProcessingStatus(`Error: ${error.message}`);
      alert(`Failed to process timetable: ${error.message}`);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  const addLabRule = () => {
    if (!currentLabRule.subject) {
      alert('Please select a subject');
      return;
    }
    
    if (currentLabRule.labType === 'split') {
      if (!currentLabRule.batch1Room || !currentLabRule.batch2Room) {
        alert('Please select rooms for both batches');
        return;
      }
    } else {
      if (!currentLabRule.wholeClassRoom) {
        alert('Please select a room for the whole class');
        return;
      }
    }
    
    setCurrentClass({
      ...currentClass,
      labRules: [...currentClass.labRules, { ...currentLabRule }]
    });
    
    setCurrentLabRule({
      subject: '',
      labType: 'split',
      batch1Room: '',
      batch2Room: '',
      wholeClassRoom: '',
      strength: 30
    });
    
    setShowLabRuleModal(false);
  };

  const addManualBooking = () => {
    if (!currentBooking.faculty || !currentBooking.room || !currentBooking.reason) {
      alert('Please fill all required fields');
      return;
    }
    
    const newBooking = {
      ...currentBooking,
      id: Date.now(),
      bookedAt: new Date().toLocaleString()
    };
    
    setManualBookings([...manualBookings, newBooking]);
    
    setCurrentBooking({
      faculty: '',
      room: '',
      day: 'Monday',
      time: '08:15',
      duration: 50,
      reason: '',
      forClass: ''
    });
    
    setShowManualBookingModal(false);
    alert('Room booked successfully!');
  };

  const removeLabRule = (index) => {
    const newRules = currentClass.labRules.filter((_, i) => i !== index);
    setCurrentClass({ ...currentClass, labRules: newRules });
  };

  const removeManualBooking = (id) => {
    setManualBookings(manualBookings.filter(b => b.id !== id));
  };

  const addClass = () => {
    if (!currentClass.timetableFile) {
      alert('Please upload a timetable');
      return;
    }
    
    setClasses([...classes, { ...currentClass, id: Date.now() }]);
    
    setCurrentClass({
      year: '1',
      section: 'A',
      timetableFile: null,
      timetableName: '',
      labRules: []
    });
    
    setProcessingStatus('');
  };

  const removeClass = (id) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const timeOverlap = (time1, dur1, time2, dur2) => {
    const start1 = timeToMinutes(time1);
    const end1 = start1 + dur1;
    const start2 = timeToMinutes(time2);
    const end2 = start2 + dur2;
    return (start1 < end2 && end1 > start2);
  };

  const checkConflict = (room, day, time, duration, currentId, allocs) => {
    const conflictWithAllocations = allocs.some(alloc => 
      alloc.room === room && alloc.day === day && alloc.id !== currentId &&
      timeOverlap(alloc.time, alloc.duration, time, duration)
    );
    
    const conflictWithBookings = manualBookings.some(booking =>
      booking.room === room && booking.day === day &&
      timeOverlap(booking.time, booking.duration, time, duration)
    );
    
    return conflictWithAllocations || conflictWithBookings;
  };

  const allocateRooms = () => {
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
            
            if (!checkConflict(batch1.room, batch1.day, batch1.time, batch1.duration, batch1.id, newAllocations)) {
              newAllocations.push(batch1);
            } else {
              newConflicts.push({ ...batch1, reason: 'Room conflict for Batch 1' });
            }
            
            if (!checkConflict(batch2.room, batch2.day, batch2.time, batch2.duration, batch2.id, newAllocations)) {
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
            
            if (!checkConflict(wholeClass.room, wholeClass.day, wholeClass.time, wholeClass.duration, wholeClass.id, newAllocations)) {
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
            if (!checkConflict(room.id, session.day, session.time, session.duration, sessionId, newAllocations)) {
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
    
    setAllocations(newAllocations);
    setConflicts(newConflicts);
    calculateAnalytics(newAllocations, newConflicts);
    setActiveTab('results');
  };

  const calculateAnalytics = (allocs, confs) => {
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
    
    setAnalytics({
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
    });
  };

  const downloadReport = () => {
    let csv = '\uFEFF';
    
    csv += 'IT DEPARTMENT CLASSROOM ALLOCATION REPORT\n';
    csv += `Generated on,${new Date().toLocaleString()}\n`;
    csv += `Total Classes,${classes.length}\n`;
    csv += `Total Allocations,${allocations.length}\n`;
    csv += `Manual Bookings,${manualBookings.length}\n`;
    csv += `Conflicts,${conflicts.length}\n`;
    csv += `Free Rooms,${analytics?.freeRooms || 0}\n`;
    csv += '\n\n';
    
    csv += 'SUMMARY ANALYTICS\n';
    csv += 'Metric,Value\n';
    if (analytics) {
      csv += `Total Allocations,${analytics.totalAllocations}\n`;
      csv += `Rooms Used,${analytics.roomsUsed} of ${analytics.totalRooms}\n`;
      csv += `Free Rooms,${analytics.freeRooms}\n`;
      csv += `Average Utilization,${analytics.utilizationRate}%\n`;
      csv += `Conflicts,${analytics.conflicts}\n`;
      csv += `Manual Bookings,${analytics.manualBookingsCount}\n`;
    }
    csv += '\n\n';
    
    csv += 'DETAILED ALLOCATIONS\n';
    csv += 'Type,Year,Section,Subject,Day,Time,Duration (min),Room,Students,Capacity,Utilization %,Faculty,Reason\n';
    
    allocations.forEach(a => {
      const subj = (a.subject || '').replace(/,/g, ' ');
      const reason = (a.reason || '-').replace(/,/g, ' ');
      csv += `${a.type},${a.year},${a.section},"${subj}",${a.day},${a.time},${a.duration},${a.room},${a.students},${a.roomCapacity},${a.utilization},${a.faculty || '-'},"${reason}"\n`;
    });
    
    csv += '\n\n';
    
    csv += 'ROOM AVAILABILITY SCHEDULE\n';
    csv += 'Room ID,Room Name,Type,Capacity,Total Sessions,Free Slots Count\n';
    
    if (analytics && analytics.roomSchedule) {
      Object.entries(analytics.roomSchedule).forEach(([roomId, data]) => {
        csv += `${roomId},${data.room.name},${data.room.type},${data.room.capacity},${data.allocations.length},${data.freeSlots.length}\n`;
      });
    }
    
    csv += '\n\n';
    
    csv += 'ROOM FREE SLOTS DETAIL\n';
    csv += 'Room,Day,Time Slots (Free)\n';
    
    if (analytics && analytics.roomSchedule) {
      Object.entries(analytics.roomSchedule).forEach(([roomId, data]) => {
        const slotsByDay = {};
        data.freeSlots.forEach(slot => {
          if (!slotsByDay[slot.day]) slotsByDay[slot.day] = [];
          slotsByDay[slot.day].push(slot.time);
        });
        
        Object.entries(slotsByDay).forEach(([day, times]) => {
          csv += `${roomId},${day},"${times.join(', ')}"\n`;
        });
      });
    }
    
    csv += '\n\n';
    
    csv += 'MANUAL BOOKINGS BY FACULTY\n';
    csv += 'Faculty,Room,Day,Time,Duration,Reason,For Class,Booked At\n';
    
    manualBookings.forEach(b => {
      const reason = (b.reason || '').replace(/,/g, ' ');
      csv += `"${b.faculty}",${b.room},${b.day},${b.time},${b.duration},"${reason}",${b.forClass || 'N/A'},${b.bookedAt}\n`;
    });
    
    if (conflicts.length > 0) {
      csv += '\n\n';
      csv += 'CONFLICTS REPORT\n';
      csv += 'Year,Section,Subject,Day,Time,Students,Reason\n';
      conflicts.forEach(c => {
        const subj = (c.subject || '').replace(/,/g, ' ');
        const reason = (c.reason || '').replace(/,/g, ' ');
        csv += `${c.year},${c.section},"${subj}",${c.day},${c.time},${c.students},"${reason}"\n`;
      });
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IT_Allocation_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getFilteredAllocations = () => {
    let filtered = allocations;
    if (filterYear !== 'all') {
      filtered = filtered.filter(a => a.year === filterYear);
    }
    if (filterDay !== 'all') {
      filtered = filtered.filter(a => a.day === filterDay);
    }
    if (searchTerm) {
      filtered = filtered.filter(a => 
        (a.subject && a.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (a.room && a.room.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  };

  const renderRoomAvailability = () => {
    if (!analytics?.roomSchedule) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#0D47A1] mb-4">Room Availability & Free Time Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.roomSchedule).map(([roomId, data]) => (
            <div
              key={roomId}
              className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                data.allocations.length === 0 
                  ? 'bg-[#E8F5E8] border-[#2E7D32]' 
                  : data.freeSlots.length > 8 
                    ? 'bg-[#FFF8E1] border-[#FF8F00]'
                    : 'bg-[#FFEBEE] border-[#C62828]'
              }`}
              onClick={() => setSelectedRoom(selectedRoom === roomId ? null : roomId)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-lg font-semibold text-[#1E1E1E]">{roomId}</div>
                  <div className="text-sm text-[#555]">{data.room.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-[#1E1E1E]">{data.freeSlots.length}</div>
                  <div className="text-xs text-[#555]">Free Slots</div>
                </div>
              </div>
              
              <div className="text-sm text-[#555]">
                <div>Capacity: {data.room.capacity}</div>
                <div>Allocated: {data.allocations.length} sessions</div>
              </div>

              {selectedRoom === roomId && (
                <div className="mt-3 bg-white rounded border p-3">
                  <div className="font-medium text-[#1E1E1E] mb-2">Free Time Slots:</div>
                  <div className="max-h-32 overflow-y-auto text-xs">
                    {data.freeSlots.length > 0 ? (
                      data.freeSlots.map((slot, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="text-[#1E1E1E]">{slot.day}</span>
                          <span className="text-[#555]">{slot.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-[#555]">No free slots available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendarView = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['08:15', '09:05', '10:10', '11:00', '11:50', '13:30', '14:15', '15:00'];
    const filtered = getFilteredAllocations();

    return (
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm bg-white">
          <thead className="bg-[#0D47A1] text-white">
            <tr>
              <th className="p-3 text-left font-medium border-r border-[#0D47A1] sticky left-0 bg-[#0D47A1]">Time</th>
              {days.map(day => (
                <th key={day} className="p-3 text-center font-medium border-r border-[#0D47A1]">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, idx) => (
              <tr key={time} className={idx % 2 === 0 ? 'bg-[#F7F9FC]' : 'bg-white'}>
                <td className="p-3 font-medium text-[#1E1E1E] border-r border-gray-200 sticky left-0 bg-inherit">{time}</td>
                {days.map(day => {
                  const sessionsAtTime = filtered.filter(a => a.time === time && a.day === day);
                  return (
                    <td key={day} className="p-2 border-r border-gray-200 align-top">
                      {sessionsAtTime.length > 0 ? (
                        <div className="space-y-1">
                          {sessionsAtTime.map((s, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded text-xs font-medium ${
                                s.type === 'LAB'
                                  ? 'bg-[#E3F2FD] text-[#0D47A1] border border-[#0D47A1]'
                                  : s.type === 'MANUAL'
                                  ? 'bg-[#FFF8E1] text-[#FF8F00] border border-[#FF8F00]'
                                  : 'bg-[#E8F5E8] text-[#2E7D32] border border-[#2E7D32]'
                              }`}
                            >
                              <div className="font-semibold">{s.room}</div>
                              <div className="text-xs opacity-90">{s.year}-{s.section}</div>
                              {s.faculty && <div className="text-xs opacity-90">{s.faculty.split(' - ')[0]}</div>}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 text-xs">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTableView = () => {
    const filtered = getFilteredAllocations();

    return (
      <div className="max-h-96 overflow-y-auto border rounded-lg shadow-sm">
        <table className="w-full text-sm bg-white">
          <thead className="bg-[#0D47A1] text-white sticky top-0">
            <tr>
              <th className="p-3 text-left font-medium">Subject</th>
              <th className="p-3 text-left font-medium">Year-Sec</th>
              <th className="p-3 text-left font-medium">Students</th>
              <th className="p-3 text-left font-medium">Day & Time</th>
              <th className="p-3 text-left font-medium">Room</th>
              <th className="p-3 text-left font-medium">Type</th>
              <th className="p-3 text-left font-medium">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alloc, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-3 text-[#1E1E1E]">
                  {alloc.subject}
                  {alloc.faculty && <div className="text-xs text-[#555]">by {alloc.faculty}</div>}
                </td>
                <td className="p-3 text-[#1E1E1E]">
                  {alloc.year}-{alloc.section}
                </td>
                <td className="p-3 text-[#1E1E1E]">{alloc.students}</td>
                <td className="p-3 text-[#1E1E1E]">{alloc.day} {alloc.time}</td>
                <td className="p-3 font-medium text-[#1E1E1E]">
                  {alloc.room}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alloc.type === 'LAB' 
                      ? 'bg-[#E3F2FD] text-[#0D47A1] border border-[#0D47A1]' 
                      : alloc.type === 'MANUAL'
                      ? 'bg-[#FFF8E1] text-[#FF8F00] border border-[#FF8F00]'
                      : 'bg-[#E8F5E8] text-[#2E7D32] border border-[#2E7D32]'
                  }`}>
                    {alloc.type}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#00ACC1] h-2 rounded-full transition-all"
                        style={{ width: `${alloc.utilization}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#1E1E1E] font-medium">{alloc.utilization}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-8 h-8 text-[#0D47A1]" />
            <h1 className="text-2xl font-semibold text-[#1E1E1E]">IT Classroom Allocation System</h1>
          </div>
          <p className="text-[#555]">Multi-Modal Batch-Wise Lab & Theory Allocation with Faculty Booking System</p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {['input', 'booking', 'allocate', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={(tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)}
                className={`flex-1 py-4 px-4 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab
                    ? 'border-[#0D47A1] text-[#0D47A1] bg-[#E3F2FD]'
                    : 'border-transparent text-[#555] hover:text-[#0D47A1] hover:bg-gray-50'
                } ${((tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab === 'input' && <><Upload className="w-4 h-4 inline mr-2" />Add Classes</>}
                {tab === 'booking' && <><Calendar className="w-4 h-4 inline mr-2" />Faculty Booking</>}
                {tab === 'allocate' && <><CheckCircle className="w-4 h-4 inline mr-2" />Review & Allocate</>}
                {tab === 'results' && <><TrendingUp className="w-4 h-4 inline mr-2" />View Results</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'input' && (
            <div>
              <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Add Class Timetable</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Year</label>
                  <select
                    value={currentClass.year}
                    onChange={(e) => setCurrentClass({ ...currentClass, year: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Section</label>
                  <select
                    value={currentClass.section}
                    onChange={(e) => setCurrentClass({ ...currentClass, section: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#1E1E1E] mb-3">Upload Timetable (Image/CSV/Text)</label>
                <label className={`bg-[#0D47A1] hover:bg-[#0B3D91] text-white px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm flex items-center gap-2 w-fit border border-[#0D47A1] ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <FileUp className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Upload Timetable'}
                  <input
                    type="file"
                    accept=".csv,.txt,image/*"
                    onChange={handleTimetableUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </label>
                
                {processingStatus && (
                  <div className={`mt-3 border-l-4 p-3 rounded-r ${
                    processingStatus.startsWith('Timetable loaded') 
                      ? 'bg-[#E8F5E8] border-[#2E7D32] text-[#2E7D32]'
                      : processingStatus.startsWith('Error')
                      ? 'bg-[#FFEBEE] border-[#C62828] text-[#C62828]'
                      : 'bg-[#E3F2FD] border-[#0D47A1] text-[#0D47A1]'
                  }`}>
                    {isProcessing && <Loader className="w-4 h-4 animate-spin inline mr-2" />}
                    <span className="text-sm font-medium">{processingStatus}</span>
                  </div>
                )}
                
                {currentClass.timetableName && (
                  <div className="mt-3 bg-[#E8F5E8] border-l-4 border-[#2E7D32] p-3 rounded-r">
                    <p className="text-sm text-[#2E7D32] font-medium">
                      <strong>Loaded:</strong> {currentClass.timetableName} ({currentClass.timetableFile.length} sessions)
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-[#1E1E1E]">Lab Allocation Rules</h3>
                  <button
                    onClick={() => setShowLabRuleModal(true)}
                    disabled={!currentClass.timetableFile}
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-3 py-2 rounded text-sm font-medium transition-colors shadow-sm flex items-center gap-2 border border-[#2E7D32] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lab Rule
                  </button>
                </div>
                
                {currentClass.labRules.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed border-gray-400 rounded p-4 text-center">
                    <p className="text-gray-600 font-medium">No lab rules defined. Add rules to specify how lab sessions should be allocated.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentClass.labRules.map((rule, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-300 rounded p-4 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-medium text-[#1E1E1E]">{rule.subject}</p>
                          {rule.labType === 'split' ? (
                            <p className="text-sm text-[#555] font-medium">
                              Batch 1 → {rule.batch1Room} ({rule.strength} students) | 
                              Batch 2 → {rule.batch2Room} ({rule.strength} students)
                            </p>
                          ) : (
                            <p className="text-sm text-[#555] font-medium">
                              Whole Class → {rule.wholeClassRoom} (60 students)
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeLabRule(idx)}
                          className="text-[#C62828] hover:text-[#B71C1C] p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addClass}
                  disabled={!currentClass.timetableFile}
                  className="bg-[#0D47A1] hover:bg-[#0B3D91] text-white font-medium px-4 py-2 rounded transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-[#0D47A1]"
                >
                  <Plus className="w-4 h-4" />
                  Add Class to List
                </button>
              </div>

              {classes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#1E1E1E] mb-4">Added Classes ({classes.length})</h3>
                  <div className="grid gap-3">
                    {classes.map((cls) => (
                      <div key={cls.id} className="bg-gray-50 border border-gray-300 rounded p-4 flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-medium text-[#1E1E1E]">
                            Year {cls.year} - Section {cls.section}
                          </p>
                          <p className="text-sm text-[#555] font-medium">
                            {cls.timetableFile.length} sessions | {cls.labRules.length} lab rules
                          </p>
                        </div>
                        <button
                          onClick={() => removeClass(cls.id)}
                          className="text-[#C62828] hover:text-[#B71C1C] p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'booking' && (
            <div>
              <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Faculty Room Booking</h2>
              
              <div className="bg-[#FFF8E1] border-l-4 border-[#FF8F00] p-3 rounded-r mb-4">
                <p className="text-[#FF8F00] font-medium">
                  <strong>Note:</strong> Faculty members can book rooms for special events, meetings, or other activities. All bookings will be included in the allocation report.
                </p>
              </div>

              <button
                onClick={() => setShowManualBookingModal(true)}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm flex items-center gap-2 border border-[#2E7D32] mb-4"
              >
                <Plus className="w-4 h-4" />
                New Room Booking
              </button>

              {manualBookings.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-400 rounded p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-600 font-medium text-lg">No manual bookings yet</p>
                  <p className="text-gray-500 mt-1">Click "New Room Booking" to add a faculty booking</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-[#1E1E1E] mb-4">Current Bookings ({manualBookings.length})</h3>
                  <div className="space-y-3">
                    {manualBookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-50 border border-gray-300 rounded p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-[#555]" />
                              <p className="font-medium text-[#1E1E1E]">{booking.faculty}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <div>
                                <span className="font-medium text-[#555]">Room:</span>
                                <span className="ml-2 text-[#1E1E1E] font-medium">{booking.room}</span>
                              </div>
                              <div>
                                <span className="font-medium text-[#555]">Day:</span>
                                <span className="ml-2 text-[#1E1E1E] font-medium">{booking.day}</span>
                              </div>
                              <div>
                                <span className="font-medium text-[#555]">Time:</span>
                                <span className="ml-2 text-[#1E1E1E] font-medium">{booking.time}</span>
                              </div>
                              <div>
                                <span className="font-medium text-[#555]">Duration:</span>
                                <span className="ml-2 text-[#1E1E1E] font-medium">{booking.duration} min</span>
                              </div>
                              {booking.forClass && (
                                <div>
                                  <span className="font-medium text-[#555]">For Class:</span>
                                  <span className="ml-2 text-[#1E1E1E] font-medium">{booking.forClass}</span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-[#555]">Booked:</span>
                                <span className="ml-2 text-[#1E1E1E] font-medium">{booking.bookedAt}</span>
                              </div>
                            </div>
                            <div className="mt-2 bg-white rounded border p-2">
                              <span className="font-medium text-[#555]">Reason:</span>
                              <span className="ml-2 text-[#1E1E1E] font-medium">{booking.reason}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeManualBooking(booking.id)}
                            className="text-[#C62828] hover:text-[#B71C1C] p-2 hover:bg-red-50 rounded transition-colors ml-3"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'allocate' && (
            <div>
              <h2 className="text-xl font-semibold text-[#1E1E1E] mb-4">Review & Allocate</h2>
              
              <div className="bg-[#E8F5E8] border-l-4 border-[#2E7D32] text-[#2E7D32] p-3 rounded-r mb-4">
                <p className="font-medium">
                  <strong>{classes.length} classes</strong> with <strong>{classes.reduce((sum, c) => sum + c.timetableFile.length, 0)} total sessions</strong> + <strong>{manualBookings.length} faculty bookings</strong> ready for allocation
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#1E1E1E] mb-3">Available Rooms:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {classrooms.map(room => (
                    <div key={room.id} className="border border-gray-300 rounded p-3 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                      <div className="font-medium text-[#1E1E1E]">{room.id}</div>
                      <div className="text-sm text-[#555] font-medium">
                        Capacity: {room.capacity} | Type: {room.type}
                      </div>
                      <div className="text-xs text-[#555] mt-1 font-medium">
                        {room.year === 'all' ? 'All Years' : `Year ${room.year}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={allocateRooms}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-medium px-6 py-3 rounded transition-colors shadow-sm border border-[#2E7D32]"
              >
                Run Allocation Algorithm
              </button>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#1E1E1E]">Allocation Results</h2>
                <button
                  onClick={downloadReport}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm flex items-center gap-2 border border-[#2E7D32]"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Report
                </button>
              </div>

              {analytics && (
                <div className="grid grid-cols-5 gap-3 mb-6">
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
                    <Users className="w-6 h-6 mb-2 text-[#0D47A1]" />
                    <div className="text-2xl font-semibold text-[#1E1E1E] mb-1">{analytics.totalAllocations}</div>
                    <div className="text-sm text-[#555] font-medium">Total Allocations</div>
                  </div>
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
                    <Building2 className="w-6 h-6 mb-2 text-[#0D47A1]" />
                    <div className="text-2xl font-semibold text-[#1E1E1E] mb-1">{analytics.roomsUsed}/{analytics.totalRooms}</div>
                    <div className="text-sm text-[#555] font-medium">Rooms Used</div>
                  </div>
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
                    <CheckCircle className="w-6 h-6 mb-2 text-[#0D47A1]" />
                    <div className="text-2xl font-semibold text-[#1E1E1E] mb-1">{analytics.freeRooms}</div>
                    <div className="text-sm text-[#555] font-medium">Free Rooms</div>
                  </div>
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
                    <TrendingUp className="w-6 h-6 mb-2 text-[#0D47A1]" />
                    <div className="text-2xl font-semibold text-[#1E1E1E] mb-1">{analytics.utilizationRate}%</div>
                    <div className="text-sm text-[#555] font-medium">Avg Utilization</div>
                  </div>
                  <div className="bg-white border border-gray-300 rounded p-4 shadow-sm">
                    <AlertCircle className="w-6 h-6 mb-2 text-[#C62828]" />
                    <div className="text-2xl font-semibold text-[#1E1E1E] mb-1">{conflicts.length}</div>
                    <div className="text-sm text-[#555] font-medium">Conflicts</div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded p-3 mb-4 border border-gray-200">
                <div className="flex gap-3 items-center flex-wrap">
                  <span className="text-[#1E1E1E] font-medium">View Mode:</span>
                  <div className="flex gap-2">
                    {['table', 'calendar', 'availability'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          viewMode === mode
                            ? 'bg-[#0D47A1] text-white shadow-sm'
                            : 'bg-white text-[#555] border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {mode === 'table' && 'Table'}
                        {mode === 'calendar' && 'Calendar'}
                        {mode === 'availability' && 'Room Availability'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 ml-auto flex-wrap">
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="px-2 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-[#1E1E1E]"
                    >
                      <option value="all">All Years</option>
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                    
                    <select
                      value={filterDay}
                      onChange={(e) => setFilterDay(e.target.value)}
                      className="px-2 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-[#1E1E1E]"
                    >
                      <option value="all">All Days</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-2 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-[#1E1E1E] w-32"
                    />
                  </div>
                </div>
              </div>

              {viewMode === 'availability' && renderRoomAvailability()}
              {viewMode === 'calendar' && renderCalendarView()}
              {viewMode === 'table' && renderTableView()}

              {conflicts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-[#1E1E1E] mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#C62828]" />
                    Conflicts Detected ({conflicts.length})
                  </h3>
                  <div className="border border-gray-200 rounded bg-white overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="p-3 text-left font-medium text-[#1E1E1E]">Subject</th>
                          <th className="p-3 text-left font-medium text-[#1E1E1E]">Year-Sec</th>
                          <th className="p-3 text-left font-medium text-[#1E1E1E]">Students</th>
                          <th className="p-3 text-left font-medium text-[#1E1E1E]">Day & Time</th>
                          <th className="p-3 text-left font-medium text-[#1E1E1E]">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflicts.map((conf, idx) => (
                          <tr key={idx} className="border-t border-gray-200">
                            <td className="p-3 text-[#1E1E1E]">{conf.subject}</td>
                            <td className="p-3 text-[#1E1E1E]">{conf.year}-{conf.section}</td>
                            <td className="p-3 text-[#1E1E1E]">{conf.students}</td>
                            <td className="p-3 text-[#1E1E1E]">{conf.day} {conf.time}</td>
                            <td className="p-3 text-[#1E1E1E] font-medium">{conf.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lab Rule Modal */}
      {showLabRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-[#1E1E1E]">Add Lab Allocation Rule</h3>
              <button
                onClick={() => setShowLabRuleModal(false)}
                className="text-[#555] hover:text-[#1E1E1E]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Lab Subject</label>
                <select
                  value={currentLabRule.subject}
                  onChange={(e) => setCurrentLabRule({ ...currentLabRule, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                >
                  <option value="">Select a lab subject...</option>
                  {labSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Lab Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="split"
                      checked={currentLabRule.labType === 'split'}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value })}
                      className="w-4 h-4 text-[#0D47A1]"
                    />
                    <span className="font-medium text-[#1E1E1E]">Split Batches (2 labs × 30 students)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="whole"
                      checked={currentLabRule.labType === 'whole'}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value })}
                      className="w-4 h-4 text-[#0D47A1]"
                    />
                    <span className="font-medium text-[#1E1E1E]">Whole Class (60 students)</span>
                  </label>
                </div>
              </div>

              {currentLabRule.labType === 'split' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Batch 1 Room</label>
                    <select
                      value={currentLabRule.batch1Room}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch1Room: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                    >
                      <option value="">Select room for Batch 1...</option>
                      {classrooms.filter(r => r.type === 'IT_LAB' || r.type === 'THEORY').map(room => (
                        <option key={room.id} value={room.id}>
                          {room.id} - {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Batch 2 Room</label>
                    <select
                      value={currentLabRule.batch2Room}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch2Room: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                    >
                      <option value="">Select room for Batch 2...</option>
                      {classrooms.filter(r => r.type === 'IT_LAB' || r.type === 'THEORY').map(room => (
                        <option key={room.id} value={room.id}>
                          {room.id} - {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Students per Batch</label>
                    <input
                      type="number"
                      value={currentLabRule.strength}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, strength: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                      min="1"
                      max="40"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Whole Class Room</label>
                  <select
                    value={currentLabRule.wholeClassRoom}
                    onChange={(e) => setCurrentLabRule({ ...currentLabRule, wholeClassRoom: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                  >
                    <option value="">Select room for whole class...</option>
                    {classrooms.filter(r => r.capacity >= 60).map(room => (
                      <option key={room.id} value={room.id}>
                        {room.id} - {room.name} (Capacity: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-gray-50 border-l-4 border-[#0D47A1] p-3 rounded-r">
                <p className="text-sm text-[#1E1E1E] font-medium">
                  <strong>Examples:</strong><br/>
                  • NP Lab: Split → Batch 1 in Open Source Lab, Batch 2 in Internet Tech Lab<br/>
                  • FSWD Lab: Split → Batch 1 in Software Eng Lab, Batch 2 in Database Lab<br/>
                  • Mini Project: Whole Class → In regular classroom (1201, 1202, etc.)
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-300 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowLabRuleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-[#1E1E1E] hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addLabRule}
                className="px-4 py-2 bg-[#0D47A1] text-white rounded hover:bg-[#0B3D91] font-medium transition-colors shadow-sm"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Booking Modal */}
      {showManualBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-4 border-b border-gray-300 flex justify-between items-center bg-white">
              <h3 className="text-lg font-semibold text-[#1E1E1E]">New Room Booking</h3>
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="text-[#555] hover:text-[#1E1E1E]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Faculty Member</label>
                <select
                  value={currentBooking.faculty}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, faculty: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                >
                  <option value="">Select faculty member...</option>
                  {facultyList.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Room</label>
                <select
                  value={currentBooking.room}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, room: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                >
                  <option value="">Select room...</option>
                  {classrooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.id} - {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Day</label>
                  <select
                    value={currentBooking.day}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, day: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Time</label>
                  <select
                    value={currentBooking.time}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, time: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot.time} value={slot.time}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={currentBooking.duration}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                    min="15"
                    max="180"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1E1E1E] mb-2">For Class (Optional)</label>
                  <input
                    type="text"
                    value={currentBooking.forClass}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, forClass: e.target.value })}
                    placeholder="e.g., Year 1 - Section A"
                    className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1E1E1E] mb-2">Reason for Booking</label>
                <textarea
                  value={currentBooking.reason}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, reason: e.target.value })}
                  placeholder="Please describe the purpose of this booking..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1] font-medium text-[#1E1E1E] bg-white resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t border-gray-300 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-[#1E1E1E] hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addManualBooking}
                className="px-4 py-2 bg-[#2E7D32] text-white rounded hover:bg-[#1B5E20] font-medium transition-colors shadow-sm"
              >
                Book Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITClassroomAllocation;