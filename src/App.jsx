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
    { id: '1101', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', symbol: '🟢', name: 'Room 1101' },
    { id: '1102', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', symbol: '🟢', name: 'Room 1102' },
    { id: '1103', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', symbol: '🟢', name: 'Room 1103' },
    { id: '1104', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', symbol: '🟢', name: 'Room 1104' },
    { id: '1105', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', symbol: '🟢', name: 'Room 1105' },
    { id: '1106', capacity: 60, type: 'THEORY', building: 'IT Block', year: '1', symbol: '🟢', name: 'Room 1106' },
    { id: '1201', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1201' },
    { id: '1202', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1202' },
    { id: '1203', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1203' },
    { id: '1204', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1204' },
    { id: '1301', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1301' },
    { id: '1302', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1302' },
    { id: '1303', capacity: 70, type: 'THEORY', building: 'IT Block', year: '2,3', symbol: '🔵🟣', name: 'Room 1303' },
    { id: 'Open Source Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Open Source Lab' },
    { id: 'Internet Technology Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Internet Tech Lab' },
    { id: 'Database Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Database Lab' },
    { id: 'Software Engineering Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Software Eng Lab' }
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
          setProcessingStatus(`🔍 OCR in progress: ${progress}%`);
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
    setProcessingStatus('📄 Processing timetable...');

    try {
      let text = '';
      
      if (file.type.startsWith('image/')) {
        setProcessingStatus('🖼️ Extracting text from image...');
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
      
      setProcessingStatus(`✅ Timetable loaded! ${timetableData.length} sessions extracted`);
    } catch (error) {
      console.error('Error processing timetable:', error);
      setProcessingStatus(`❌ Error: ${error.message}`);
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
    alert('✅ Room booked successfully!');
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

  const getRoomSymbol = (roomId) => {
    const room = classrooms.find(r => r.id === roomId);
    return room ? room.symbol : '📍';
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
        <h3 className="text-2xl font-black text-teal-900 mb-4">🔍 Room Availability & Free Time Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.roomSchedule).map(([roomId, data]) => (
            <div
              key={roomId}
              className={`border-4 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all cursor-pointer ${
                data.allocations.length === 0 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 border-green-400' 
                  : data.freeSlots.length > 8 
                    ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-400'
                    : 'bg-gradient-to-br from-red-100 to-pink-100 border-red-400'
              }`}
              onClick={() => setSelectedRoom(selectedRoom === roomId ? null : roomId)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xl font-black text-teal-900">{getRoomSymbol(roomId)} {roomId}</div>
                  <div className="text-sm text-teal-700">{data.room.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-teal-900">{data.freeSlots.length}</div>
                  <div className="text-xs text-teal-600">Free Slots</div>
                </div>
              </div>
              
              <div className="text-sm text-teal-700">
                <div>Capacity: {data.room.capacity}</div>
                <div>Allocated: {data.allocations.length} sessions</div>
              </div>

              {selectedRoom === roomId && (
                <div className="mt-3 bg-white rounded-lg p-3 border-2 border-teal-300">
                  <div className="font-bold text-teal-900 mb-2">Free Time Slots:</div>
                  <div className="max-h-32 overflow-y-auto text-xs">
                    {data.freeSlots.length > 0 ? (
                      data.freeSlots.map((slot, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-teal-100">
                          <span className="text-teal-800">{slot.day}</span>
                          <span className="text-teal-600">{slot.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-teal-600">No free slots available</div>
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
      <div className="overflow-x-auto border-4 border-cyan-400 rounded-xl shadow-2xl">
        <table className="w-full text-sm bg-white">
          <thead className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
            <tr>
              <th className="p-3 text-left font-black border-4 border-cyan-300 sticky left-0 bg-teal-600">Time</th>
              {days.map(day => (
                <th key={day} className="p-3 text-center font-black border-4 border-cyan-300">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, idx) => (
              <tr key={time} className={idx % 2 === 0 ? 'bg-cyan-50' : 'bg-teal-50'}>
                <td className="p-3 font-bold text-teal-900 border-4 border-cyan-200 sticky left-0 bg-gradient-to-r from-cyan-100 to-teal-100">{time}</td>
                {days.map(day => {
                  const sessionsAtTime = filtered.filter(a => a.time === time && a.day === day);
                  return (
                    <td key={day} className="p-2 border-4 border-cyan-200 align-top">
                      {sessionsAtTime.length > 0 ? (
                        <div className="space-y-1">
                          {sessionsAtTime.map((s, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded-lg text-xs font-bold shadow-md ${
                                s.type === 'LAB'
                                  ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white'
                                  : s.type === 'MANUAL'
                                  ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
                                  : 'bg-gradient-to-br from-cyan-300 to-blue-400 text-blue-900'
                              }`}
                            >
                              <div className="font-black">{getRoomSymbol(s.room)} {s.room}</div>
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
      <div className="max-h-96 overflow-y-auto border-4 border-cyan-400 rounded-xl">
        <table className="w-full text-sm bg-white">
          <thead className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white sticky top-0">
            <tr>
              <th className="p-3 text-left font-black">Subject</th>
              <th className="p-3 text-left font-black">Year-Sec</th>
              <th className="p-3 text-left font-black">Students</th>
              <th className="p-3 text-left font-black">Day & Time</th>
              <th className="p-3 text-left font-black">Room</th>
              <th className="p-3 text-left font-black">Type</th>
              <th className="p-3 text-left font-black">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alloc, idx) => (
              <tr key={idx} className="border-b border-cyan-100 hover:bg-cyan-50 transition-colors">
                <td className="p-3 text-teal-900">
                  {alloc.subject}
                  {alloc.faculty && <div className="text-xs text-teal-600">by {alloc.faculty}</div>}
                </td>
                <td className="p-3 text-teal-800">
                  {alloc.year === '1' && '🟢'} 
                  {alloc.year === '2' && '🔵'} 
                  {alloc.year === '3' && '🟣'} 
                  {alloc.year === '4' && '🔴'} 
                  {alloc.year}-{alloc.section}
                </td>
                <td className="p-3 text-teal-800">{alloc.students}</td>
                <td className="p-3 text-teal-800">{alloc.day} {alloc.time}</td>
                <td className="p-3 font-black text-teal-900">
                  {getRoomSymbol(alloc.room)} {alloc.room}
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    alloc.type === 'LAB' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                      : alloc.type === 'MANUAL'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {alloc.type}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${alloc.utilization}%` }}
                      />
                    </div>
                    <span className="text-xs text-teal-800 font-black">{alloc.utilization}%</span>
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-teal-800 to-emerald-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-8 mb-8 border-4 border-yellow-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10 flex items-center gap-4 mb-2">
            <Building2 className="w-14 h-14 drop-shadow-2xl" />
            <h1 className="text-5xl font-black tracking-tight drop-shadow-2xl">IT Classroom Allocator Pro</h1>
          </div>
          <p className="relative z-10 text-yellow-200 text-xl font-bold drop-shadow-lg">🚀 Multi-Modal Batch-Wise Lab & Theory Allocation + Faculty Booking System</p>
        </header>

        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-2xl shadow-2xl border-4 border-yellow-400 mb-8">
          <div className="flex border-b-4 border-yellow-400">
            {['input', 'booking', 'allocate', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={(tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)}
                className={`flex-1 py-6 px-6 font-black text-base transition-all duration-300 border-b-4 transform hover:scale-105 ${
                  activeTab === tab
                    ? 'bg-gradient-to-br from-yellow-300 to-orange-400 text-teal-900 border-yellow-500 shadow-2xl scale-105'
                    : 'text-white border-transparent hover:bg-white/20 hover:text-yellow-300'
                } ${((tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab === 'input' && <><Upload className="w-6 h-6 inline mr-2" />📚 Add Classes</>}
                {tab === 'booking' && <><Calendar className="w-6 h-6 inline mr-2" />📅 Faculty Booking</>}
                {tab === 'allocate' && <><CheckCircle className="w-6 h-6 inline mr-2" />🎯 Review & Allocate</>}
                {tab === 'results' && <><TrendingUp className="w-6 h-6 inline mr-2" />✨ View Results</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-white via-cyan-50 to-teal-50 rounded-2xl shadow-2xl border-4 border-cyan-400 p-8">
          {activeTab === 'input' && (
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-6">📚 Add Class Timetable</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">🎓 Year</label>
                  <select
                    value={currentClass.year}
                    onChange={(e) => setCurrentClass({ ...currentClass, year: e.target.value })}
                    className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                  >
                    <option value="1">1st Year 🟢</option>
                    <option value="2">2nd Year 🔵</option>
                    <option value="3">3rd Year 🟣</option>
                    <option value="4">4th Year 🔴</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">📖 Section</label>
                  <select
                    value={currentClass.section}
                    onChange={(e) => setCurrentClass({ ...currentClass, section: e.target.value })}
                    className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-black text-teal-900 mb-3">📤 Upload Timetable (Image/CSV/Text)</label>
                <label className={`bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center gap-2 w-fit border-4 border-yellow-400 transform hover:scale-105 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <FileUp className="w-5 h-5" />
                  {isProcessing ? '⏳ Processing...' : '🚀 Upload Timetable'}
                  <input
                    type="file"
                    accept=".csv,.txt,image/*"
                    onChange={handleTimetableUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </label>
                
                {processingStatus && (
                  <div className={`mt-4 border-l-8 p-4 rounded-r-2xl shadow-lg ${
                    processingStatus.startsWith('✅') 
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-600 text-green-900'
                      : processingStatus.startsWith('❌')
                      ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-600 text-red-900'
                      : 'bg-gradient-to-r from-cyan-100 to-teal-100 border-cyan-600 text-cyan-900'
                  }`}>
                    {isProcessing && <Loader className="w-5 h-5 animate-spin inline mr-2" />}
                    <span className="text-sm font-bold">{processingStatus}</span>
                  </div>
                )}
                
                {currentClass.timetableName && (
                  <div className="mt-3 bg-gradient-to-r from-green-100 to-emerald-100 border-l-8 border-green-600 p-3 rounded-r-2xl shadow-lg">
                    <p className="text-sm text-green-900 font-bold">
                      <strong>✅ Loaded:</strong> {currentClass.timetableName} ({currentClass.timetableFile.length} sessions)
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-black text-teal-900">🧪 Lab Allocation Rules</h3>
                  <button
                    onClick={() => setShowLabRuleModal(true)}
                    disabled={!currentClass.timetableFile}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg transform hover:scale-105 flex items-center gap-2 border-2 border-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lab Rule
                  </button>
                </div>
                
                {currentClass.labRules.length === 0 ? (
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-4 border-dashed border-gray-400 rounded-xl p-6 text-center">
                    <p className="text-gray-700 font-semibold">No lab rules defined. Add rules to specify how lab sessions should be allocated.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentClass.labRules.map((rule, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-cyan-100 to-teal-100 border-4 border-cyan-400 rounded-xl p-4 flex justify-between items-center shadow-lg">
                        <div>
                          <p className="font-black text-teal-900">{rule.subject}</p>
                          {rule.labType === 'split' ? (
                            <p className="text-sm text-teal-800 font-bold">
                              Batch 1 → {rule.batch1Room} ({rule.strength} students) | 
                              Batch 2 → {rule.batch2Room} ({rule.strength} students)
                            </p>
                          ) : (
                            <p className="text-sm text-teal-800 font-bold">
                              Whole Class → {rule.wholeClassRoom} (60 students)
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeLabRule(idx)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={addClass}
                  disabled={!currentClass.timetableFile}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-black px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-cyan-300 transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Class to List
                </button>
              </div>

              {classes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-black text-teal-900 mb-4">✅ Added Classes ({classes.length})</h3>
                  <div className="grid gap-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="bg-gradient-to-r from-cyan-100 via-teal-100 to-emerald-100 border-4 border-teal-400 rounded-xl p-4 flex justify-between items-center shadow-lg">
                        <div>
                          <p className="font-black text-teal-900">
                            {cls.year === '1' && '🟢'} 
                            {cls.year === '2' && '🔵'} 
                            {cls.year === '3' && '🟣'} 
                            {cls.year === '4' && '🔴'} 
                            Year {cls.year} - Section {cls.section}
                          </p>
                          <p className="text-sm text-teal-800 font-bold">
                            {cls.timetableFile.length} sessions | {cls.labRules.length} lab rules
                          </p>
                        </div>
                        <button
                          onClick={() => removeClass(cls.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
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
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-6">📅 Faculty Room Booking</h2>
              
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 border-l-8 border-yellow-600 p-4 rounded-r-2xl mb-6 shadow-lg">
                <p className="text-yellow-900 font-bold">
                  ℹ️ <strong>Note:</strong> Faculty members can book rooms for special events, meetings, or other activities. All bookings will be included in the allocation report.
                </p>
              </div>

              <button
                onClick={() => setShowManualBookingModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-2xl flex items-center gap-2 border-2 border-emerald-300 transform hover:scale-105 mb-6"
              >
                <Plus className="w-5 h-5" />
                📝 New Room Booking
              </button>

              {manualBookings.length === 0 ? (
                <div className="bg-gradient-to-r from-gray-100 to-gray-50 border-4 border-dashed border-gray-400 rounded-xl p-8 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-700 font-bold text-lg">No manual bookings yet</p>
                  <p className="text-gray-600 mt-2">Click "New Room Booking" to add a faculty booking</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-black text-teal-900 mb-4">📋 Current Bookings ({manualBookings.length})</h3>
                  <div className="space-y-3">
                    {manualBookings.map((booking) => (
                      <div key={booking.id} className="bg-gradient-to-r from-emerald-100 to-teal-100 border-4 border-emerald-400 rounded-xl p-4 shadow-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-teal-700" />
                              <p className="font-black text-teal-900">{booking.faculty}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div>
                                <span className="font-bold text-teal-700">Room:</span>
                                <span className="ml-2 text-teal-900 font-semibold">{getRoomSymbol(booking.room)} {booking.room}</span>
                              </div>
                              <div>
                                <span className="font-bold text-teal-700">Day:</span>
                                <span className="ml-2 text-teal-900 font-semibold">{booking.day}</span>
                              </div>
                              <div>
                                <span className="font-bold text-teal-700">Time:</span>
                                <span className="ml-2 text-teal-900 font-semibold">{booking.time}</span>
                              </div>
                              <div>
                                <span className="font-bold text-teal-700">Duration:</span>
                                <span className="ml-2 text-teal-900 font-semibold">{booking.duration} min</span>
                              </div>
                              {booking.forClass && (
                                <div>
                                  <span className="font-bold text-teal-700">For Class:</span>
                                  <span className="ml-2 text-teal-900 font-semibold">{booking.forClass}</span>
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-teal-700">Booked:</span>
                                <span className="ml-2 text-teal-900 font-semibold">{booking.bookedAt}</span>
                              </div>
                            </div>
                            <div className="mt-2 bg-white rounded-lg p-2 border-2 border-teal-300">
                              <span className="font-bold text-teal-700">Reason:</span>
                              <span className="ml-2 text-teal-900 font-semibold">{booking.reason}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeManualBooking(booking.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all ml-4"
                          >
                            <Trash2 className="w-5 h-5" />
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
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mb-6">🎯 Review & Allocate</h2>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-l-8 border-green-600 text-green-900 p-4 rounded-r-2xl mb-6 shadow-lg">
                <p className="font-bold">
                  ✅ <strong>{classes.length} classes</strong> with <strong>{classes.reduce((sum, c) => sum + c.timetableFile.length, 0)} total sessions</strong> + <strong>{manualBookings.length} faculty bookings</strong> ready for allocation
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-black text-teal-900 mb-4">🏢 Available Rooms:</h3>
                <div className="grid grid-cols-3 gap-4">
                  {classrooms.map(room => (
                    <div key={room.id} className="border-4 border-cyan-400 rounded-xl p-4 bg-gradient-to-br from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{room.symbol}</span>
                        <div className="font-black text-teal-900">{room.id}</div>
                      </div>
                      <div className="text-sm text-teal-700 font-bold">
                        Capacity: {room.capacity} | Type: {room.type}
                      </div>
                      <div className="text-xs text-teal-600 mt-1 font-semibold">
                        {room.year === 'all' ? 'All Years' : `Year ${room.year}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={allocateRooms}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl border-4 border-green-300 transform hover:scale-105"
              >
                🚀 Run Allocation Algorithm
              </button>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">✨ Allocation Results</h2>
                <button
                  onClick={downloadReport}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-2xl flex items-center gap-2 border-2 border-green-300 transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  📊 Download CSV Report
                </button>
              </div>

              {analytics && (
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform">
                    <Users className="w-10 h-10 mb-3 drop-shadow-lg" />
                    <div className="text-4xl font-black mb-1 drop-shadow-lg">{analytics.totalAllocations}</div>
                    <div className="text-sm font-bold opacity-90">Total Allocations</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform">
                    <Building2 className="w-10 h-10 mb-3 drop-shadow-lg" />
                    <div className="text-4xl font-black mb-1 drop-shadow-lg">{analytics.roomsUsed}/{analytics.totalRooms}</div>
                    <div className="text-sm font-bold opacity-90">Rooms Used</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform">
                    <CheckCircle className="w-10 h-10 mb-3 drop-shadow-lg" />
                    <div className="text-4xl font-black mb-1 drop-shadow-lg">{analytics.freeRooms}</div>
                    <div className="text-sm font-bold opacity-90">Free Rooms</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform">
                    <TrendingUp className="w-10 h-10 mb-3 drop-shadow-lg" />
                    <div className="text-4xl font-black mb-1 drop-shadow-lg">{analytics.utilizationRate}%</div>
                    <div className="text-sm font-bold opacity-90">Avg Utilization</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 text-white p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 transform hover:scale-105 transition-transform">
                    <AlertCircle className="w-10 h-10 mb-3 drop-shadow-lg" />
                    <div className="text-4xl font-black mb-1 drop-shadow-lg">{conflicts.length}</div>
                    <div className="text-sm font-bold opacity-90">Conflicts</div>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-4 mb-6 border-2 border-yellow-400 shadow-lg">
                <div className="flex gap-3 items-center flex-wrap">
                  <span className="text-white font-black">View Mode:</span>
                  <div className="flex gap-2">
                    {['table', 'calendar', 'availability'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-4 py-2 rounded-lg font-black text-sm transition-all transform hover:scale-105 ${
                          viewMode === mode
                            ? 'bg-yellow-400 text-teal-900 shadow-lg scale-105'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {mode === 'table' && '📋 Table'}
                        {mode === 'calendar' && '📅 Calendar'}
                        {mode === 'availability' && '🔍 Room Availability'}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 ml-auto flex-wrap">
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="px-3 py-2 rounded-lg font-bold text-sm bg-white/90 text-teal-900 border-2 border-yellow-300"
                    >
                      <option value="all">All Years</option>
                      <option value="1">Year 1 🟢</option>
                      <option value="2">Year 2 🔵</option>
                      <option value="3">Year 3 🟣</option>
                      <option value="4">Year 4 🔴</option>
                    </select>
                    
                    <select
                      value={filterDay}
                      onChange={(e) => setFilterDay(e.target.value)}
                      className="px-3 py-2 rounded-lg font-bold text-sm bg-white/90 text-teal-900 border-2 border-yellow-300"
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
                      placeholder="🔍 Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-3 py-2 rounded-lg font-bold text-sm bg-white/90 text-teal-900 border-2 border-yellow-300 w-40"
                    />
                  </div>
                </div>
              </div>

              {viewMode === 'availability' && renderRoomAvailability()}
              {viewMode === 'calendar' && renderCalendarView()}
              {viewMode === 'table' && renderTableView()}

              {conflicts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-black text-teal-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Conflicts Detected ({conflicts.length})
                  </h3>
                  <div className="border-4 border-amber-200 rounded-xl bg-amber-50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-amber-100 border-b border-amber-200">
                        <tr>
                          <th className="p-3 text-left font-black text-amber-900">Subject</th>
                          <th className="p-3 text-left font-black text-amber-900">Year-Sec</th>
                          <th className="p-3 text-left font-black text-amber-900">Students</th>
                          <th className="p-3 text-left font-black text-amber-900">Day & Time</th>
                          <th className="p-3 text-left font-black text-amber-900">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflicts.map((conf, idx) => (
                          <tr key={idx} className="border-t border-amber-200">
                            <td className="p-3 text-amber-900">{conf.subject}</td>
                            <td className="p-3 text-amber-800">{conf.year}-{conf.section}</td>
                            <td className="p-3 text-amber-800">{conf.students}</td>
                            <td className="p-3 text-amber-800">{conf.day} {conf.time}</td>
                            <td className="p-3 text-amber-900 font-black">{conf.reason}</td>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-cyan-400">
            <div className="p-6 border-b-4 border-cyan-400 flex justify-between items-center bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
              <h3 className="text-2xl font-black">Add Lab Allocation Rule</h3>
              <button
                onClick={() => setShowLabRuleModal(false)}
                className="text-white hover:text-yellow-300"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-black text-teal-900 mb-2">Lab Subject</label>
                <select
                  value={currentLabRule.subject}
                  onChange={(e) => setCurrentLabRule({ ...currentLabRule, subject: e.target.value })}
                  className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                >
                  <option value="">Select a lab subject...</option>
                  {labSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-teal-900 mb-2">Lab Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="split"
                      checked={currentLabRule.labType === 'split'}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value })}
                      className="w-5 h-5 text-cyan-600"
                    />
                    <span className="font-bold text-teal-900">Split Batches (2 labs × 30 students)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="whole"
                      checked={currentLabRule.labType === 'whole'}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value })}
                      className="w-5 h-5 text-cyan-600"
                    />
                    <span className="font-bold text-teal-900">Whole Class (60 students)</span>
                  </label>
                </div>
              </div>

              {currentLabRule.labType === 'split' ? (
                <>
                  <div>
                    <label className="block text-sm font-black text-teal-900 mb-2">Batch 1 Room</label>
                    <select
                      value={currentLabRule.batch1Room}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch1Room: e.target.value })}
                      className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                    >
                      <option value="">Select room for Batch 1...</option>
                      {classrooms.filter(r => r.type === 'IT_LAB' || r.type === 'THEORY').map(room => (
                        <option key={room.id} value={room.id}>
                          {room.symbol} {room.id} - {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-teal-900 mb-2">Batch 2 Room</label>
                    <select
                      value={currentLabRule.batch2Room}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch2Room: e.target.value })}
                      className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                    >
                      <option value="">Select room for Batch 2...</option>
                      {classrooms.filter(r => r.type === 'IT_LAB' || r.type === 'THEORY').map(room => (
                        <option key={room.id} value={room.id}>
                          {room.symbol} {room.id} - {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-teal-900 mb-2">Students per Batch</label>
                    <input
                      type="number"
                      value={currentLabRule.strength}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, strength: parseInt(e.target.value) })}
                      className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                      min="1"
                      max="40"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">Whole Class Room</label>
                  <select
                    value={currentLabRule.wholeClassRoom}
                    onChange={(e) => setCurrentLabRule({ ...currentLabRule, wholeClassRoom: e.target.value })}
                    className="w-full p-3 border-4 border-cyan-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-cyan-50 to-teal-50"
                  >
                    <option value="">Select room for whole class...</option>
                    {classrooms.filter(r => r.capacity >= 60).map(room => (
                      <option key={room.id} value={room.id}>
                        {room.symbol} {room.id} - {room.name} (Capacity: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-gradient-to-r from-cyan-100 to-teal-100 border-l-8 border-cyan-600 p-4 rounded-r-2xl">
                <p className="text-sm text-teal-900 font-bold">
                  <strong>Examples:</strong><br/>
                  • NP Lab: Split → Batch 1 in Open Source Lab, Batch 2 in Internet Tech Lab<br/>
                  • FSWD Lab: Split → Batch 1 in Software Eng Lab, Batch 2 in Database Lab<br/>
                  • Mini Project: Whole Class → In regular classroom (1201, 1202, etc.)
                </p>
              </div>
            </div>

            <div className="p-6 border-t-4 border-cyan-400 flex gap-3 justify-end bg-gradient-to-r from-teal-50 to-cyan-50">
              <button
                onClick={() => setShowLabRuleModal(false)}
                className="px-6 py-3 border-4 border-cyan-400 rounded-xl text-teal-900 hover:bg-cyan-100 font-black transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addLabRule}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 font-black transition-all shadow-lg hover:shadow-xl"
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-emerald-400">
            <div className="p-6 border-b-4 border-emerald-400 flex justify-between items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <h3 className="text-2xl font-black">New Room Booking</h3>
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="text-white hover:text-yellow-300"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-black text-teal-900 mb-2">Faculty Member</label>
                <select
                  value={currentBooking.faculty}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, faculty: e.target.value })}
                  className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50"
                >
                  <option value="">Select faculty member...</option>
                  {facultyList.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-teal-900 mb-2">Room</label>
                <select
                  value={currentBooking.room}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, room: e.target.value })}
                  className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50"
                >
                  <option value="">Select room...</option>
                  {classrooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.symbol} {room.id} - {room.name} (Capacity: {room.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">Day</label>
                  <select
                    value={currentBooking.day}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, day: e.target.value })}
                    className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">Time</label>
                  <select
                    value={currentBooking.time}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, time: e.target.value })}
                    className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot.time} value={slot.time}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={currentBooking.duration}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50"
                    min="15"
                    max="180"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-teal-900 mb-2">For Class (Optional)</label>
                  <input
                    type="text"
                    value={currentBooking.forClass}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, forClass: e.target.value })}
                    placeholder="e.g., Year 1 - Section A"
                    className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-teal-900 mb-2">Reason for Booking</label>
                <textarea
                  value={currentBooking.reason}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, reason: e.target.value })}
                  placeholder="Please describe the purpose of this booking..."
                  rows="3"
                  className="w-full p-3 border-4 border-emerald-400 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-300 font-bold text-teal-900 bg-gradient-to-r from-emerald-50 to-teal-50 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t-4 border-emerald-400 flex gap-3 justify-end bg-gradient-to-r from-emerald-50 to-teal-50">
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="px-6 py-3 border-4 border-emerald-400 rounded-xl text-teal-900 hover:bg-emerald-100 font-black transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addManualBooking}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-black transition-all shadow-lg hover:shadow-xl"
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