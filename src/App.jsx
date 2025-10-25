import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Download, AlertCircle, CheckCircle, Building2, Users, TrendingUp, FileUp, Loader, X, Plus, Trash2, Eye } from 'lucide-react';

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

// Storage functions for persistence
const saveToStorage = (key, data) => {
  try {
    const storageData = {
      data: data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(storageData));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

const loadFromStorage = (key) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.data;
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
  }
  return null;
};

const ITClassroomAllocation = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [classes, setClasses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [manualBookings, setManualBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedClassView, setSelectedClassView] = useState(null);
  
  const [currentClass, setCurrentClass] = useState({
    year: '1',
    section: 'A',
    semester: '1',
    academicYear: '2024-2025',
    timetableFile: null,
    timetableName: '',
    labRules: []
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showLabRuleModal, setShowLabRuleModal] = useState(false);
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [showClassroomManager, setShowClassroomManager] = useState(false);
  const [showFacultyManager, setShowFacultyManager] = useState(false);
  
  const [currentLabRule, setCurrentLabRule] = useState({
    subject: '',
    labType: 'split',
    batch1Room: '',
    batch2Room: '',
    wholeClassRoom: '',
    strength: 30,
    faculty: ''
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

  // Initialize with localStorage data or defaults
  const [classrooms, setClassrooms] = useState(() => {
    const saved = loadFromStorage('classrooms');
    return saved || [
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
  });

  const [facultyList, setFacultyList] = useState(() => {
    const saved = loadFromStorage('facultyList');
    return saved || [
      'Dr. N. ANANTHI - Professor',
      'Dr. M. MOHANA - Associate Professor',
      'Dr. S. GNANAPRIYA - Assistant Professor',
      'Dr. M. HEMA - Assistant Professor',
      'Dr. B. CHANDRA - Assistant Professor',
      'Mr. K.RAVINDRAN - Assistant Professor',
      'Mrs. T. SARASWATHI - Assistant Professor',
      'Mrs. S. ANUSHA - Assistant Professor',
      'Dr. K.SUNDAR - Assistant Professor',
      'Mrs.P. SIVASAKTHI - Assistant Professor'
    ];
  });

  const [newClassroom, setNewClassroom] = useState({
    id: '',
    capacity: 60,
    type: 'THEORY',
    building: 'IT Block',
    year: '1',
    name: ''
  });

  const [newFaculty, setNewFaculty] = useState('');

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
    { time: '08:15', duration: 50, label: '8:15 AM - 9:05 AM' },
    { time: '09:05', duration: 50, label: '9:05 AM - 9:55 AM' },
    { time: '10:10', duration: 50, label: '10:10 AM - 11:00 AM' },
    { time: '11:00', duration: 50, label: '11:00 AM - 11:50 AM' },
    { time: '11:50', duration: 50, label: '11:50 AM - 12:40 PM' },
    { time: '13:30', duration: 45, label: '1:30 PM - 2:15 PM' },
    { time: '14:15', duration: 45, label: '2:15 PM - 3:00 PM' },
    { time: '15:00', duration: 45, label: '3:00 PM - 3:45 PM' }
  ];

  // Enhanced timetable parsing function
  const parseTimetableText = (text) => {
    console.log("Raw text received:", text);
    
    const parsed = [];
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const dayMap = {
      'MON': 'Monday',
      'MONDAY': 'Monday',
      'TUES': 'Tuesday',
      'TUESDAY': 'Tuesday',
      'WED': 'Wednesday',
      'WEDNESDAY': 'Wednesday',
      'THURS': 'Thursday',
      'THURSDAY': 'Thursday',
      'FRI': 'Friday',
      'FRIDAY': 'Friday'
    };

    let currentDay = '';
    
    lines.forEach(line => {
      const upperLine = line.trim().toUpperCase();
      console.log("Processing line:", line);
      
      // Check for day headers
      Object.keys(dayMap).forEach(shortDay => {
        if (upperLine.includes(shortDay)) {
          currentDay = dayMap[shortDay];
          console.log("Found day:", currentDay);
          
          // Extract subjects from the same line if available
          const dayIndex = upperLine.indexOf(shortDay);
          const restOfLine = line.substring(dayIndex + shortDay.length).trim();
          if (restOfLine.length > 0) {
            const subjects = extractSubjects(restOfLine);
            subjects.forEach((subject, idx) => {
              if (idx < timeSlots.length) {
                const isLab = isLabSession(subject, line);
                parsed.push({
                  subject: subject,
                  day: currentDay,
                  time: timeSlots[idx].time,
                  duration: isLab ? 120 : timeSlots[idx].duration,
                  students: isLab ? 30 : 60,
                  type: isLab ? 'LAB' : 'THEORY'
                });
              }
            });
          }
        }
      });

      // If we have a current day and this line contains subjects
      if (currentDay && line.trim().length > 0) {
        const subjects = extractSubjects(line);
        if (subjects.length > 0) {
          console.log("Found subjects:", subjects);
          subjects.forEach((subject, idx) => {
            if (idx < timeSlots.length) {
              const isLab = isLabSession(subject, line);
              parsed.push({
                subject: subject,
                day: currentDay,
                time: timeSlots[idx].time,
                duration: isLab ? 120 : timeSlots[idx].duration,
                students: isLab ? 30 : 60,
                type: isLab ? 'LAB' : 'THEORY'
              });
            }
          });
        }
      }
    });

    console.log("Final parsed data:", parsed);
    return parsed;
  };

  const extractSubjects = (text) => {
    // Common subject abbreviations
    const commonSubjects = [
      'FAIML', 'OOPJ', 'DPCO', 'DM', 'CN', 'DSA', 'AT', 'TT', 'CSD-I', 'COUN',
      'OOPJ(L)', 'FAIML(L)', 'DPCO(L)', 'DSA(L)', 'BREAK', 'LUNCH'
    ];
    
    // Split by common separators and filter valid subjects
    const words = text.split(/[\s\|\/\t,]+/).filter(word => {
      const cleanWord = word.trim().replace(/[^a-zA-Z0-9()\-]/g, '');
      return cleanWord.length > 1 && 
             !cleanWord.match(/^\d+\.\d+|^\d+:\d+/) &&
             (commonSubjects.includes(cleanWord) || /^[A-Z]{2,}/i.test(cleanWord));
    });
    
    // Remove BREAK and LUNCH
    return words.filter(word => !['BREAK', 'LUNCH'].includes(word));
  };

  const isLabSession = (subject, originalLine) => {
    return subject.includes('LAB') || 
           subject.includes('(L)') || 
           subject.includes('L)') ||
           originalLine.includes('(L)') ||
           ['DSA', 'OOPJ', 'FAIML', 'DPCO'].includes(subject.replace('(L)', '')) && 
           originalLine.includes('(L)');
  };

  // Load data from storage on mount
  useEffect(() => {
    const savedClasses = loadFromStorage('classes');
    const savedBookings = loadFromStorage('manualBookings');
    const savedAllocations = loadFromStorage('allocations');
    
    if (savedClasses) setClasses(savedClasses);
    if (savedBookings) setManualBookings(savedBookings);
    if (savedAllocations) setAllocations(savedAllocations);
  }, []);

  // Save data to storage whenever it changes
  useEffect(() => {
    saveToStorage('classes', classes);
  }, [classes]);

  useEffect(() => {
    saveToStorage('manualBookings', manualBookings);
  }, [manualBookings]);

  useEffect(() => {
    saveToStorage('allocations', allocations);
  }, [allocations]);

  useEffect(() => {
    saveToStorage('classrooms', classrooms);
  }, [classrooms]);

  useEffect(() => {
    saveToStorage('facultyList', facultyList);
  }, [facultyList]);

  // Fixed file upload handler
  const handleTimetableUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus('Processing timetable...');

    try {
      const text = await file.text();
      console.log("File content:", text);
      
      const timetableData = parseTimetableText(text);
      
      if (timetableData.length === 0) {
        throw new Error('No timetable data extracted. Please check file format.');
      }
      
      setCurrentClass({
        ...currentClass,
        timetableFile: timetableData,
        timetableName: file.name
      });
      
      setProcessingStatus(`Timetable loaded! ${timetableData.length} sessions extracted`);
    } catch (error) {
      console.error('Error processing file:', error);
      setProcessingStatus(`Error: ${error.message}`);
      alert(`Failed to process timetable: ${error.message}`);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  // Classroom Management Functions
  const addClassroom = () => {
    if (!newClassroom.id || !newClassroom.name) {
      alert('Please fill in all required fields');
      return;
    }

    if (classrooms.find(c => c.id === newClassroom.id)) {
      alert('Classroom ID already exists');
      return;
    }

    setClassrooms([...classrooms, { ...newClassroom }]);
    setNewClassroom({
      id: '',
      capacity: 60,
      type: 'THEORY',
      building: 'IT Block',
      year: '1',
      name: ''
    });
  };

  const removeClassroom = (id) => {
    setClassrooms(classrooms.filter(c => c.id !== id));
  };

  // Faculty Management Functions
  const addFaculty = () => {
    if (!newFaculty.trim()) {
      alert('Please enter faculty name');
      return;
    }

    if (facultyList.includes(newFaculty)) {
      alert('Faculty already exists');
      return;
    }

    setFacultyList([...facultyList, newFaculty]);
    setNewFaculty('');
  };

  const removeFaculty = (faculty) => {
    setFacultyList(facultyList.filter(f => f !== faculty));
  };

  const addLabRule = () => {
    if (!currentLabRule.subject || !currentLabRule.faculty) {
      alert('Please select subject and faculty');
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
      strength: 30,
      faculty: ''
    });
    
    setShowLabRuleModal(false);
  };

  const addManualBooking = () => {
    if (!currentBooking.faculty || !currentBooking.room || !currentBooking.reason) {
      alert('Please fill all required fields');
      return;
    }
    
    const hasConflict = [...manualBookings, ...allocations].some(item => 
      item.room === currentBooking.room &&
      item.day === currentBooking.day &&
      timeOverlap(item.time, item.duration, currentBooking.time, currentBooking.duration)
    );
    
    if (hasConflict) {
      alert('Room already booked for this time!');
      return;
    }
    
    setManualBookings([...manualBookings, {
      ...currentBooking,
      id: Date.now(),
      bookedAt: new Date().toLocaleString()
    }]);
    
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
      semester: '1',
      academicYear: '2024-2025',
      timetableFile: null,
      timetableName: '',
      labRules: []
    });
    setProcessingStatus('');
  };

  const checkAllConflicts = (allocation, existingAllocations, bookings) => {
    for (let existing of existingAllocations) {
      if (existing.room === allocation.room && existing.day === allocation.day) {
        if (timeOverlap(existing.time, existing.duration, allocation.time, allocation.duration)) {
          return { hasConflict: true, reason: `Room conflict with ${existing.subject}` };
        }
      }
    }
    
    if (allocation.faculty) {
      for (let existing of existingAllocations) {
        if (existing.faculty === allocation.faculty && existing.day === allocation.day) {
          if (timeOverlap(existing.time, existing.duration, allocation.time, allocation.duration)) {
            return { hasConflict: true, reason: `Faculty ${allocation.faculty.split('-')[0]} busy` };
          }
        }
      }
    }
    
    for (let existing of existingAllocations) {
      if (existing.year === allocation.year && existing.section === allocation.section && 
          existing.day === allocation.day && existing.batch !== allocation.batch) {
        if (timeOverlap(existing.time, existing.duration, allocation.time, allocation.duration)) {
          return { hasConflict: true, reason: `Students busy with ${existing.subject}` };
        }
      }
    }
    
    return { hasConflict: false };
  };

  const handleAllocateRooms = () => {
    const newAllocations = [];
    const newConflicts = [];
    
    classes.forEach(classData => {
      const { year, section, semester, timetableFile, labRules } = classData;
      
      timetableFile.forEach(session => {
        const sessionId = `${year}-${section}-${session.day}-${session.time}`;
        const labRule = labRules.find(rule => 
          session.subject.toUpperCase().includes(rule.subject.split('(')[0].trim().toUpperCase())
        );
        
        if (labRule) {
          if (labRule.labType === 'split') {
            const batch1 = {
              id: sessionId + '-b1',
              subject: `${session.subject} (Batch 1)`,
              faculty: labRule.faculty,
              year, section, semester,
              students: labRule.strength,
              day: session.day,
              time: session.time,
              duration: 120,
              room: labRule.batch1Room,
              building: 'IT Block',
              roomCapacity: 30,
              utilization: ((labRule.strength / 30) * 100).toFixed(1),
              type: 'LAB',
              batch: 'Batch 1'
            };
            
            const batch2 = {
              id: sessionId + '-b2',
              subject: `${session.subject} (Batch 2)`,
              faculty: labRule.faculty,
              year, section, semester,
              students: labRule.strength,
              day: session.day,
              time: session.time,
              duration: 120,
              room: labRule.batch2Room,
              building: 'IT Block',
              roomCapacity: 30,
              utilization: ((labRule.strength / 30) * 100).toFixed(1),
              type: 'LAB',
              batch: 'Batch 2'
            };
            
            const c1 = checkAllConflicts(batch1, newAllocations, manualBookings);
            const c2 = checkAllConflicts(batch2, newAllocations, manualBookings);
            
            if (!c1.hasConflict) newAllocations.push(batch1);
            else newConflicts.push({ ...batch1, reason: c1.reason });
            
            if (!c2.hasConflict) newAllocations.push(batch2);
            else newConflicts.push({ ...batch2, reason: c2.reason });
          } else {
            const wholeClass = {
              id: sessionId,
              subject: session.subject,
              faculty: labRule.faculty,
              year, section, semester,
              students: 60,
              day: session.day,
              time: session.time,
              duration: 120,
              room: labRule.wholeClassRoom,
              building: 'IT Block',
              roomCapacity: classrooms.find(r => r.id === labRule.wholeClassRoom)?.capacity || 60,
              utilization: '100.0',
              type: 'LAB'
            };
            
            const c = checkAllConflicts(wholeClass, newAllocations, manualBookings);
            if (!c.hasConflict) newAllocations.push(wholeClass);
            else newConflicts.push({ ...wholeClass, reason: c.reason });
          }
        } else {
          const suitableRooms = classrooms.filter(room => 
            room.type === 'THEORY' &&
            (room.year === year || room.year.includes(year) || room.year === 'all') &&
            room.capacity >= session.students
          ).sort((a, b) => a.capacity - b.capacity);
          
          let allocated = false;
          for (let room of suitableRooms) {
            const allocation = {
              id: sessionId,
              subject: session.subject,
              year, section, semester,
              students: session.students,
              day: session.day,
              time: session.time,
              duration: session.duration,
              room: room.id,
              building: room.building,
              roomCapacity: room.capacity,
              utilization: ((session.students / room.capacity) * 100).toFixed(1),
              type: 'THEORY'
            };
            
            const c = checkAllConflicts(allocation, newAllocations, manualBookings);
            if (!c.hasConflict) {
              newAllocations.push(allocation);
              allocated = true;
              break;
            }
          }
          
          if (!allocated) {
            newConflicts.push({
              ...session,
              id: sessionId,
              year, section, semester,
              reason: 'No suitable room available'
            });
          }
        }
      });
    });
    
    manualBookings.forEach(booking => {
      newAllocations.push({
        id: `manual-${booking.id}`,
        subject: `Booking: ${booking.reason}`,
        faculty: booking.faculty,
        year: '-',
        section: booking.forClass || '-',
        students: '-',
        day: booking.day,
        time: booking.time,
        duration: booking.duration,
        room: booking.room,
        building: 'IT Block',
        roomCapacity: '-',
        utilization: '-',
        type: 'MANUAL'
      });
    });
    
    setAllocations(newAllocations);
    setConflicts(newConflicts);
    setAnalytics(calculateAnalytics(newAllocations, newConflicts));
    setActiveTab('results');
  };

  const calculateAnalytics = (allocs, confs) => {
    const totalRooms = classrooms.length;
    const usedRooms = new Set(allocs.map(a => a.room)).size;
    const freeRooms = totalRooms - usedRooms;
    
    const utilizationValues = allocs.filter(a => a.utilization !== '-' && a.type !== 'MANUAL').map(a => parseFloat(a.utilization));
    const avgUtilization = utilizationValues.length > 0 ? utilizationValues.reduce((s, v) => s + v, 0) / utilizationValues.length : 0;
    
    const roomSchedule = {};
    classrooms.forEach(room => {
      roomSchedule[room.id] = { room, allocations: [], freeSlots: [] };
    });
    
    allocs.forEach(a => {
      if (roomSchedule[a.room]) roomSchedule[a.room].allocations.push(a);
    });
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    Object.keys(roomSchedule).forEach(roomId => {
      days.forEach(day => {
        timeSlots.forEach(slot => {
          const isOccupied = roomSchedule[roomId].allocations.some(a => 
            a.day === day && timeOverlap(a.time, a.duration, slot.time, slot.duration)
          );
          if (!isOccupied) roomSchedule[roomId].freeSlots.push({ day, time: slot.time, label: slot.label });
        });
      });
    });
    
    return {
      totalAllocations: allocs.length,
      roomsUsed: usedRooms,
      totalRooms,
      freeRooms,
      utilizationRate: avgUtilization.toFixed(1),
      conflicts: confs.length,
      roomSchedule,
      manualBookingsCount: manualBookings.length
    };
  };

  const downloadReport = () => {
    let csv = '\uFEFF';
    csv += 'IT DEPARTMENT CLASSROOM ALLOCATION REPORT\n';
    csv += `Generated,${new Date().toLocaleString()}\n\n`;
    csv += 'Type,Year,Section,Semester,Subject,Faculty,Day,Time,Duration,Room,Students,Capacity,Util%,Batch\n';
    
    allocations.forEach(a => {
      const subj = (a.subject || '').replace(/,/g, ';');
      const fac = (a.faculty || '-').replace(/,/g, ';');
      csv += `${a.type},${a.year},${a.section},${a.semester||'-'},${subj},${fac},${a.day},${a.time},${a.duration},${a.room},${a.students},${a.roomCapacity},${a.utilization},${a.batch||'-'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Allocation_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getClassTimetable = (classId) => {
    const classData = classes.find(c => c.id === classId);
    if (!classData) return [];
    return allocations.filter(a => a.year === classData.year && a.section === classData.section);
  };

  const renderClassTimetableView = () => {
    if (!selectedClassView) return null;
    const classData = classes.find(c => c.id === selectedClassView);
    if (!classData) return null;
    const classSessions = getClassTimetable(selectedClassView);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b bg-[#0D47A1] text-white flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Year {classData.year} - Section {classData.section}</h3>
              <p className="text-sm">Semester {classData.semester} | {classData.academicYear}</p>
            </div>
            <button onClick={() => setSelectedClassView(null)} className="text-white hover:bg-[#0B3D91] p-2 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 font-semibold text-left">Time</th>
                  {days.map(d => <th key={d} className="border p-3 font-semibold">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot.time}>
                    <td className="border p-3 font-medium bg-gray-50">{slot.label}</td>
                    {days.map(day => {
                      const sess = classSessions.find(s => s.day === day && s.time === slot.time);
                      return (
                        <td key={day} className="border p-3">
                          {sess ? (
                            <div className={`p-2 rounded text-xs ${sess.type === 'LAB' ? 'bg-blue-100 border-l-4 border-blue-600' : 'bg-green-100 border-l-4 border-green-600'}`}>
                              <div className="font-bold">{sess.subject}</div>
                              <div className="text-gray-700 mt-1">Room: {sess.room}</div>
                              {sess.faculty && <div className="text-gray-600 mt-1">{sess.faculty.split('-')[0].trim()}</div>}
                              {sess.batch && <div className="text-blue-700 font-medium mt-1">{sess.batch}</div>}
                              <div className="text-gray-500 mt-1">{sess.duration} min</div>
                            </div>
                          ) : <div className="text-center text-gray-400">-</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6 border">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-8 h-8 text-[#0D47A1]" />
                <h1 className="text-2xl font-semibold">IT Classroom Allocation System</h1>
              </div>
              <p className="text-gray-600">Advanced Scheduling with Conflict Detection</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowClassroomManager(true)} className="bg-[#0D47A1] hover:bg-[#0B3D91] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />Classrooms
              </button>
              <button onClick={() => setShowFacultyManager(true)} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />Faculty
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex border-b">
            {['input', 'booking', 'allocate', 'results'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} disabled={(tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)}
                className={`flex-1 py-4 px-4 font-medium text-sm border-b-2 ${activeTab === tab ? 'border-[#0D47A1] text-[#0D47A1] bg-[#E3F2FD]' : 'border-transparent text-gray-600 hover:text-[#0D47A1]'} ${((tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {tab === 'input' && <><Upload className="w-4 h-4 inline mr-2" />Add Classes</>}
                {tab === 'booking' && <><Calendar className="w-4 h-4 inline mr-2" />Faculty Booking</>}
                {tab === 'allocate' && <><CheckCircle className="w-4 h-4 inline mr-2" />Allocate</>}
                {tab === 'results' && <><TrendingUp className="w-4 h-4 inline mr-2" />Results</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'input' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Add Class Timetable</h2>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Academic Year</label>
                  <input type="text" value={currentClass.academicYear} onChange={(e) => setCurrentClass({ ...currentClass, academicYear: e.target.value })}
                    className="w-full p-3 border rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]" placeholder="2024-2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select value={currentClass.year} onChange={(e) => setCurrentClass({ ...currentClass, year: e.target.value })}
                    className="w-full p-3 border rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Section</label>
                  <select value={currentClass.section} onChange={(e) => setCurrentClass({ ...currentClass, section: e.target.value })}
                    className="w-full p-3 border rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]">
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Semester</label>
                  <select value={currentClass.semester} onChange={(e) => setCurrentClass({ ...currentClass, semester: e.target.value })}
                    className="w-full p-3 border rounded focus:border-[#0D47A1] focus:ring-1 focus:ring-[#0D47A1]">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Upload Timetable (CSV/Text)</label>
                <label className={`bg-[#0D47A1] hover:bg-[#0B3D91] text-white px-4 py-2 rounded text-sm flex items-center gap-2 w-fit cursor-pointer ${isProcessing ? 'opacity-50' : ''}`}>
                  <FileUp className="w-4 h-4" />
                  {isProcessing ? 'Processing...' : 'Upload Timetable'}
                  <input type="file" accept=".csv,.txt" onChange={handleTimetableUpload} className="hidden" disabled={isProcessing} />
                </label>
                
                {processingStatus && (
                  <div className={`mt-3 border-l-4 p-3 rounded-r ${processingStatus.startsWith('Timetable loaded') ? 'bg-green-50 border-green-600 text-green-800' : processingStatus.startsWith('Error') ? 'bg-red-50 border-red-600 text-red-800' : 'bg-blue-50 border-blue-600 text-blue-800'}`}>
                    {isProcessing && <Loader className="w-4 h-4 animate-spin inline mr-2" />}
                    <span className="text-sm font-medium">{processingStatus}</span>
                  </div>
                )}
                
                {currentClass.timetableName && (
                  <div className="mt-3 bg-green-50 border-l-4 border-green-600 p-3 rounded-r">
                    <p className="text-sm text-green-800 font-medium">
                      <strong>Loaded:</strong> {currentClass.timetableName} ({currentClass.timetableFile.length} sessions)
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium">Lab Allocation Rules</h3>
                  <button onClick={() => setShowLabRuleModal(true)} disabled={!currentClass.timetableFile}
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-3 py-2 rounded text-sm flex items-center gap-2 disabled:opacity-50">
                    <Plus className="w-4 h-4" />Add Lab Rule
                  </button>
                </div>
                
                {currentClass.labRules.length === 0 ? (
                  <div className="bg-gray-50 border border-dashed rounded p-4 text-center">
                    <p className="text-gray-600">No lab rules defined</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentClass.labRules.map((rule, idx) => (
                      <div key={idx} className="bg-gray-50 border rounded p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{rule.subject}</p>
                          <p className="text-sm text-gray-600">Faculty: {rule.faculty}</p>
                          {rule.labType === 'split' ? (
                            <p className="text-sm text-gray-600">Batch 1 → {rule.batch1Room} | Batch 2 → {rule.batch2Room}</p>
                          ) : (
                            <p className="text-sm text-gray-600">Whole Class → {rule.wholeClassRoom}</p>
                          )}
                        </div>
                        <button onClick={() => setCurrentClass({ ...currentClass, labRules: currentClass.labRules.filter((_, i) => i !== idx) })}
                          className="text-red-600 hover:text-red-800 p-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={addClass} disabled={!currentClass.timetableFile}
                className="bg-[#0D47A1] hover:bg-[#0B3D91] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50">
                <Plus className="w-4 h-4" />Add Class to List
              </button>

              {classes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Added Classes ({classes.length})</h3>
                  <div className="grid gap-3">
                    {classes.map(cls => (
                      <div key={cls.id} className="bg-gray-50 border rounded p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-medium">Year {cls.year} - Section {cls.section} | Semester {cls.semester}</p>
                          <p className="text-sm text-gray-600">{cls.academicYear} | {cls.timetableFile.length} sessions | {cls.labRules.length} lab rules</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedClassView(cls.id)} className="text-blue-600 hover:text-blue-800 p-2">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setClasses(classes.filter(c => c.id !== cls.id))} className="text-red-600 hover:text-red-800 p-2">
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

          {activeTab === 'booking' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Faculty Room Booking</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r mb-4">
                <p className="text-yellow-800 text-sm"><strong>Note:</strong> Book rooms for meetings, events, or special sessions.</p>
              </div>
              <button onClick={() => setShowManualBookingModal(true)} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded text-sm flex items-center gap-2 mb-4">
                <Plus className="w-4 h-4" />New Room Booking
              </button>

              {manualBookings.length === 0 ? (
                <div className="bg-gray-50 border border-dashed rounded p-6 text-center">
                  <p className="text-gray-600">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {manualBookings.map(booking => (
                    <div key={booking.id} className="bg-gray-50 border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{booking.faculty}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div><span className="text-gray-600">Room:</span> {booking.room}</div>
                            <div><span className="text-gray-600">Day:</span> {booking.day}</div>
                            <div><span className="text-gray-600">Time:</span> {booking.time}</div>
                            <div><span className="text-gray-600">Duration:</span> {booking.duration} min</div>
                          </div>
                          <div className="mt-2 bg-white rounded border p-2 text-sm">
                            <span className="text-gray-600">Reason:</span> {booking.reason}
                          </div>
                        </div>
                        <button onClick={() => setManualBookings(manualBookings.filter(b => b.id !== booking.id))} className="text-red-600 hover:text-red-800 p-2 ml-3">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'allocate' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review & Allocate Rooms</h2>
              <div className="bg-green-50 border-l-4 border-green-600 p-3 rounded-r mb-4">
                <p className="text-green-800 font-medium">
                  <strong>{classes.length} classes</strong> ready • 
                  <strong> {classes.reduce((s, c) => s + c.timetableFile.length, 0)} sessions</strong> • 
                  <strong> {manualBookings.length} bookings</strong>
                </p>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Theory Rooms</h4>
                  <p className="text-2xl font-bold text-blue-700">{classrooms.filter(r => r.type === 'THEORY').length}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Lab Rooms</h4>
                  <p className="text-2xl font-bold text-green-700">{classrooms.filter(r => r.type === 'IT_LAB').length}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Total Capacity</h4>
                  <p className="text-2xl font-bold text-purple-700">{classrooms.reduce((s, r) => s + r.capacity, 0)}</p>
                </div>
              </div>

              <button onClick={handleAllocateRooms} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-3 rounded flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />Run Allocation Algorithm
              </button>
            </div>
          )}

          {activeTab === 'results' && analytics && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Allocation Results</h2>
                <button onClick={downloadReport} className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-4 py-2 rounded text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />Download Report
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-6">
                <div className="bg-white border rounded p-4">
                  <Users className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="text-2xl font-semibold">{analytics.totalAllocations}</div>
                  <div className="text-sm text-gray-600">Allocations</div>
                </div>
                <div className="bg-white border rounded p-4">
                  <Building2 className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="text-2xl font-semibold">{analytics.roomsUsed}/{analytics.totalRooms}</div>
                  <div className="text-sm text-gray-600">Rooms Used</div>
                </div>
                <div className="bg-white border rounded p-4">
                  <CheckCircle className="w-6 h-6 mb-2 text-green-600" />
                  <div className="text-2xl font-semibold">{analytics.freeRooms}</div>
                  <div className="text-sm text-gray-600">Free Rooms</div>
                </div>
                <div className="bg-white border rounded p-4">
                  <TrendingUp className="w-6 h-6 mb-2 text-blue-600" />
                  <div className="text-2xl font-semibold">{analytics.utilizationRate}%</div>
                  <div className="text-sm text-gray-600">Avg Util</div>
                </div>
                <div className="bg-white border rounded p-4">
                  <AlertCircle className="w-6 h-6 mb-2 text-red-600" />
                  <div className="text-2xl font-semibold">{conflicts.length}</div>
                  <div className="text-sm text-gray-600">Conflicts</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Class Timetables</h3>
                <div className="grid grid-cols-2 gap-3">
                  {classes.map(cls => (
                    <button key={cls.id} onClick={() => setSelectedClassView(cls.id)}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4 text-left hover:from-blue-100 hover:to-blue-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-blue-900">Year {cls.year} - Section {cls.section}</p>
                          <p className="text-sm text-blue-700">Semester {cls.semester} • {cls.academicYear}</p>
                        </div>
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Detailed Allocations</h3>
                <div className="max-h-96 overflow-y-auto border rounded">
                  <table className="w-full text-sm bg-white">
                    <thead className="bg-blue-900 text-white sticky top-0">
                      <tr>
                        <th className="p-3 text-left">Subject</th>
                        <th className="p-3 text-left">Year-Sec</th>
                        <th className="p-3 text-left">Faculty</th>
                        <th className="p-3 text-left">Day & Time</th>
                        <th className="p-3 text-left">Room</th>
                        <th className="p-3 text-left">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((a, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="font-medium">{a.subject}</div>
                            {a.batch && <div className="text-xs text-gray-600">{a.batch}</div>}
                          </td>
                          <td className="p-3">{a.year}-{a.section}</td>
                          <td className="p-3 text-xs">{a.faculty ? a.faculty.split('-')[0].trim() : '-'}</td>
                          <td className="p-3">
                            <div>{a.day}</div>
                            <div className="text-xs text-gray-600">{a.time} ({a.duration}m)</div>
                          </td>
                          <td className="p-3 font-medium">{a.room}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs ${a.type === 'LAB' ? 'bg-blue-100 text-blue-800' : a.type === 'MANUAL' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                              {a.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {conflicts.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />Conflicts ({conflicts.length})
                  </h3>
                  <div className="border border-red-200 rounded bg-red-50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="p-3 text-left">Subject</th>
                          <th className="p-3 text-left">Year-Sec</th>
                          <th className="p-3 text-left">Day & Time</th>
                          <th className="p-3 text-left">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {conflicts.map((c, i) => (
                          <tr key={i} className="border-t border-red-100">
                            <td className="p-3">{c.subject}</td>
                            <td className="p-3">{c.year}-{c.section}</td>
                            <td className="p-3">{c.day} {c.time}</td>
                            <td className="p-3 text-red-600 font-medium">{c.reason}</td>
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

      {/* Modals */}
      {showClassroomManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-blue-900 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">Manage Classrooms</h3>
              <button onClick={() => setShowClassroomManager(false)} className="text-white p-2 hover:bg-blue-800 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h4 className="text-lg font-semibold mb-3">Add New Classroom</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <input type="text" placeholder="Room ID" value={newClassroom.id} onChange={(e) => setNewClassroom({...newClassroom, id: e.target.value})} className="p-2 border rounded" />
                  <input type="text" placeholder="Room Name" value={newClassroom.name} onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})} className="p-2 border rounded" />
                  <input type="number" placeholder="Capacity" value={newClassroom.capacity} onChange={(e) => setNewClassroom({...newClassroom, capacity: parseInt(e.target.value)})} className="p-2 border rounded" />
                  <select value={newClassroom.type} onChange={(e) => setNewClassroom({...newClassroom, type: e.target.value})} className="p-2 border rounded">
                    <option value="THEORY">Theory</option>
                    <option value="IT_LAB">IT Lab</option>
                  </select>
                </div>
                <button onClick={addClassroom} className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800">Add Classroom</button>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Classrooms ({classrooms.length})</h4>
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Capacity</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classrooms.map(room => (
                        <tr key={room.id} className="border-t">
                          <td className="p-3 font-medium">{room.id}</td>
                          <td className="p-3">{room.name}</td>
                          <td className="p-3">{room.capacity}</td>
                          <td className="p-3">{room.type}</td>
                          <td className="p-3">
                            <button onClick={() => removeClassroom(room.id)} className="text-red-600 hover:text-red-800">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFacultyManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b bg-green-700 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">Manage Faculty</h3>
              <button onClick={() => setShowFacultyManager(false)} className="text-white p-2 hover:bg-green-600 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 border rounded bg-gray-50">
                <h4 className="text-lg font-semibold mb-3">Add New Faculty</h4>
                <div className="flex gap-3">
                  <input type="text" placeholder="Dr. Name - Designation" value={newFaculty} onChange={(e) => setNewFaculty(e.target.value)} className="flex-1 p-2 border rounded" />
                  <button onClick={addFaculty} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600">Add</button>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-3">Faculty List ({facultyList.length})</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {facultyList.map((fac, i) => (
                    <div key={i} className="flex justify-between items-center p-3 border rounded">
                      <span>{fac}</span>
                      <button onClick={() => removeFaculty(fac)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLabRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add Lab Rule</h3>
              <button onClick={() => setShowLabRuleModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 space-y-4">
              <select value={currentLabRule.subject} onChange={(e) => setCurrentLabRule({ ...currentLabRule, subject: e.target.value})} className="w-full p-3 border rounded">
                <option value="">Select lab subject...</option>
                {labSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={currentLabRule.faculty} onChange={(e) => setCurrentLabRule({ ...currentLabRule, faculty: e.target.value})} className="w-full p-3 border rounded">
                <option value="">Select faculty...</option>
                {facultyList.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" value="split" checked={currentLabRule.labType === 'split'} onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value})} />
                  Split Batches
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" value="whole" checked={currentLabRule.labType === 'whole'} onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value})} />
                  Whole Class
                </label>
              </div>
              {currentLabRule.labType === 'split' ? (
                <>
                  <select value={currentLabRule.batch1Room} onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch1Room: e.target.value})} className="w-full p-3 border rounded">
                    <option value="">Batch 1 Room...</option>
                    {classrooms.filter(r => r.type === 'IT_LAB').map(r => <option key={r.id} value={r.id}>{r.id} - {r.name}</option>)}
                  </select>
                  <select value={currentLabRule.batch2Room} onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch2Room: e.target.value})} className="w-full p-3 border rounded">
                    <option value="">Batch 2 Room...</option>
                    {classrooms.filter(r => r.type === 'IT_LAB').map(r => <option key={r.id} value={r.id}>{r.id} - {r.name}</option>)}
                  </select>
                </>
              ) : (
                <select value={currentLabRule.wholeClassRoom} onChange={(e) => setCurrentLabRule({ ...currentLabRule, wholeClassRoom: e.target.value})} className="w-full p-3 border rounded">
                  <option value="">Whole Class Room...</option>
                  {classrooms.filter(r => r.capacity >= 60).map(r => <option key={r.id} value={r.id}>{r.id} - {r.name}</option>)}
                </select>
              )}
            </div>
            <div className="p-4 border-t flex gap-3 justify-end bg-gray-50">
              <button onClick={() => setShowLabRuleModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button onClick={addLabRule} className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800">Add Rule</button>
            </div>
          </div>
        </div>
      )}

      {showManualBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">New Room Booking</h3>
              <button onClick={() => setShowManualBookingModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 space-y-4">
              <select value={currentBooking.faculty} onChange={(e) => setCurrentBooking({ ...currentBooking, faculty: e.target.value})} className="w-full p-3 border rounded">
                <option value="">Select faculty...</option>
                {facultyList.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select value={currentBooking.room} onChange={(e) => setCurrentBooking({ ...currentBooking, room: e.target.value})} className="w-full p-3 border rounded">
                <option value="">Select room...</option>
                {classrooms.map(r => <option key={r.id} value={r.id}>{r.id} - {r.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={currentBooking.day} onChange={(e) => setCurrentBooking({ ...currentBooking, day: e.target.value})} className="w-full p-3 border rounded">
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
                <select value={currentBooking.time} onChange={(e) => setCurrentBooking({ ...currentBooking, time: e.target.value})} className="w-full p-3 border rounded">
                  {timeSlots.map(s => <option key={s.time} value={s.time}>{s.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Duration (min)" value={currentBooking.duration} onChange={(e) => setCurrentBooking({ ...currentBooking, duration: parseInt(e.target.value)})} className="w-full p-3 border rounded" min="15" max="180" step="15" />
                <input type="text" placeholder="For Class (optional)" value={currentBooking.forClass} onChange={(e) => setCurrentBooking({ ...currentBooking, forClass: e.target.value})} className="w-full p-3 border rounded" />
              </div>
              <textarea placeholder="Reason for booking..." value={currentBooking.reason} onChange={(e) => setCurrentBooking({ ...currentBooking, reason: e.target.value})} rows="3" className="w-full p-3 border rounded resize-none" />
            </div>
            <div className="p-4 border-t flex gap-3 justify-end bg-gray-50">
              <button onClick={() => setShowManualBookingModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button onClick={addManualBooking} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600">Book Room</button>
            </div>
          </div>
        </div>
      )}

      {selectedClassView && renderClassTimetableView()}
    </div>
  );
};

export default ITClassroomAllocation;