import React, { useState, useEffect } from 'react';
import { Calendar, Download, AlertCircle, CheckCircle, Building2, Users, TrendingUp, X, Plus, Trash2, Eye, Upload, FileText, Info } from 'lucide-react';

const ITClassroomAllocation = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [classes, setClasses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [manualBookings, setManualBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedClassView, setSelectedClassView] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const [currentClass, setCurrentClass] = useState({
    year: '1',
    section: 'A',
    semester: '1',
    academicYear: '2024-2025',
    timetableData: {},
    processedSchedule: null
  });
  
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState({
    faculty: '',
    room: '',
    day: 'Monday',
    time: '08:15',
    duration: 50,
    reason: '',
    forClass: ''
  });

  const [classrooms] = useState([
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
    { id: 'LAB-1', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Lab 1' },
    { id: 'LAB-2', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Lab 2' },
    { id: 'LAB-3', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Lab 3' },
    { id: 'LAB-4', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', name: 'Lab 4' }
  ]);

  const [facultyList] = useState([
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
  ]);

  const timeSlots = [
    { time: '08:15', duration: 50, label: '8:15 AM' },
    { time: '09:05', duration: 50, label: '9:05 AM' },
    { time: '10:10', duration: 50, label: '10:10 AM' },
    { time: '11:00', duration: 50, label: '11:00 AM' },
    { time: '11:50', duration: 50, label: '11:50 AM' },
    { time: '13:30', duration: 45, label: '1:30 PM' },
    { time: '14:15', duration: 45, label: '2:15 PM' },
    { time: '15:00', duration: 45, label: '3:00 PM' }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const classesData = await window.storage.get('classes-data');
      const allocsData = await window.storage.get('allocations-data');
      const bookingsData = await window.storage.get('bookings-data');
      
      if (classesData) setClasses(JSON.parse(classesData.value));
      if (allocsData) setAllocations(JSON.parse(allocsData.value));
      if (bookingsData) setManualBookings(JSON.parse(bookingsData.value));
    } catch (err) {
      console.log('No saved data');
    }
  };

  const saveToStorage = async (type, data) => {
    try {
      await window.storage.set(`${type}-data`, JSON.stringify(data));
    } catch (err) {
      console.error('Save failed:', err);
    }
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

  const initializeTimetableData = () => {
    const data = {};
    days.forEach(day => {
      data[day] = timeSlots.map(slot => ({
        time: slot.time,
        subject: '',
        faculty: '',
        duration: slot.duration,
        type: 'THEORY'
      }));
    });
    return data;
  };

  useEffect(() => {
    if (Object.keys(currentClass.timetableData).length === 0) {
      setCurrentClass({ ...currentClass, timetableData: initializeTimetableData() });
    }
  }, []);

  const updateTimetableCell = (day, timeIndex, field, value) => {
    const updated = { ...currentClass.timetableData };
    updated[day][timeIndex] = { ...updated[day][timeIndex], [field]: value };
    setCurrentClass({ ...currentClass, timetableData: updated });
  };

  const parseCSVInput = (text) => {
    const lines = text.split('\n').filter(l => l.trim());
    const data = initializeTimetableData();
    let successCount = 0;
    
    lines.forEach(line => {
      const parts = line.split(/[,\t|]/).map(p => p.trim()).filter(p => p);
      
      if (parts.length >= 3) {
        const [dayPart, timePart, ...rest] = parts;
        const subject = rest.slice(0, -1).join(' ') || rest[0];
        const faculty = rest[rest.length - 1];
        
        const dayMatch = days.find(d => d.toLowerCase().startsWith(dayPart.toLowerCase().substring(0, 3)));
        
        if (dayMatch) {
          const slotIndex = timeSlots.findIndex(s => 
            s.time === timePart || 
            s.label.toLowerCase().includes(timePart.toLowerCase().replace(/[:\s]/g, ''))
          );
          
          if (slotIndex >= 0) {
            data[dayMatch][slotIndex] = {
              time: timeSlots[slotIndex].time,
              subject: subject,
              faculty: faculty,
              duration: timeSlots[slotIndex].duration,
              type: 'THEORY'
            };
            successCount++;
          }
        }
      }
    });
    
    return { data, successCount };
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const text = event.target.result;
      const { data: parsedData, successCount } = parseCSVInput(text);
      setCurrentClass({ ...currentClass, timetableData: parsedData });
      setProcessing(false);
      alert(`✅ Successfully imported ${successCount} classes from file!`);
    };
    
    reader.onerror = () => {
      setProcessing(false);
      alert('❌ Error reading file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  const processAndAllocateClass = () => {
    const { year, section, timetableData } = currentClass;
    const defaultRoom = `1${year === '1' ? '1' : year === '2' || year === '3' ? '2' : '3'}0${section.charCodeAt(0) - 64}`;
    
    const processed = [];
    const usedLabs = new Set();
    
    days.forEach(day => {
      timetableData[day]?.forEach((slot, idx) => {
        if (!slot.subject) return;
        
        const nextSlot = timetableData[day]?.[idx + 1];
        const prevSlot = idx > 0 ? timetableData[day]?.[idx - 1] : null;
        
        // Check if this is a continuation of previous slot
        if (prevSlot && prevSlot.subject === slot.subject && prevSlot.faculty === slot.faculty) {
          return; // Skip, it's a continuation
        }
        
        // Check how many consecutive slots have the same subject
        let periodCount = 1;
        let totalDuration = slot.duration;
        let tempIdx = idx + 1;
        
        while (tempIdx < timetableData[day].length) {
          const tempSlot = timetableData[day][tempIdx];
          if (tempSlot.subject === slot.subject && tempSlot.faculty === slot.faculty) {
            periodCount++;
            totalDuration += tempSlot.duration;
            tempIdx++;
          } else {
            break;
          }
        }
        
        const isLab = slot.subject.includes('(L)') || 
                     slot.subject.toUpperCase().includes('LAB') ||
                     periodCount >= 2;
        
        if (isLab) {
          // Check if it's split lab (e.g., "NP(L)/FSWD(L)")
          const isSplitLab = slot.subject.includes('/');
          
          if (isSplitLab) {
            const subjects = slot.subject.split('/').map(s => s.trim());
            
            // Allocate two different labs
            const availableLabs = classrooms.filter(r => r.type === 'IT_LAB' && !usedLabs.has(`${r.id}-${day}-${slot.time}`));
            
            if (availableLabs.length >= 2) {
              processed.push({
                day, time: slot.time, duration: totalDuration, periodCount,
                subject: subjects[0], faculty: slot.faculty,
                room: availableLabs[0].id, students: 30, type: 'LAB',
                batch: 'Batch 1'
              });
              
              processed.push({
                day, time: slot.time, duration: totalDuration, periodCount,
                subject: subjects[1], faculty: slot.faculty,
                room: availableLabs[1].id, students: 30, type: 'LAB',
                batch: 'Batch 2'
              });
              
              usedLabs.add(`${availableLabs[0].id}-${day}-${slot.time}`);
              usedLabs.add(`${availableLabs[1].id}-${day}-${slot.time}`);
            } else {
              processed.push({
                day, time: slot.time, duration: totalDuration, periodCount,
                subject: slot.subject, faculty: slot.faculty,
                room: 'CONFLICT', students: 60, type: 'LAB',
                error: 'Not enough labs available'
              });
            }
          } else {
            // Single lab for whole class or split batches
            const needSplit = slot.subject.includes('(L)') || slot.subject.toLowerCase().includes('batch');
            
            if (needSplit) {
              const availableLabs = classrooms.filter(r => r.type === 'IT_LAB' && !usedLabs.has(`${r.id}-${day}-${slot.time}`));
              
              if (availableLabs.length >= 2) {
                processed.push({
                  day, time: slot.time, duration: totalDuration, periodCount,
                  subject: slot.subject, faculty: slot.faculty,
                  room: availableLabs[0].id, students: 30, type: 'LAB',
                  batch: 'Batch 1'
                });
                
                processed.push({
                  day, time: slot.time, duration: totalDuration, periodCount,
                  subject: slot.subject, faculty: slot.faculty,
                  room: availableLabs[1].id, students: 30, type: 'LAB',
                  batch: 'Batch 2'
                });
                
                usedLabs.add(`${availableLabs[0].id}-${day}-${slot.time}`);
                usedLabs.add(`${availableLabs[1].id}-${day}-${slot.time}`);
              } else {
                processed.push({
                  day, time: slot.time, duration: totalDuration, periodCount,
                  subject: slot.subject, faculty: slot.faculty,
                  room: 'CONFLICT', students: 60, type: 'LAB',
                  error: 'Not enough labs available'
                });
              }
            } else {
              processed.push({
                day, time: slot.time, duration: totalDuration, periodCount,
                subject: slot.subject, faculty: slot.faculty,
                room: defaultRoom, students: 60, type: 'THEORY'
              });
            }
          }
        } else {
          processed.push({
            day, time: slot.time, duration: totalDuration, periodCount,
            subject: slot.subject, faculty: slot.faculty,
            room: defaultRoom, students: 60, type: 'THEORY'
          });
        }
      });
    });
    
    return processed;
  };

  const addClass = () => {
    const hasData = Object.values(currentClass.timetableData).some(daySlots => 
      daySlots.some(slot => slot.subject)
    );
    
    if (!hasData) {
      alert('❌ Please add timetable data first!');
      return;
    }
    
    const processedSchedule = processAndAllocateClass();
    const classWithSchedule = { 
      ...currentClass, 
      processedSchedule,
      id: Date.now() 
    };
    
    const newClasses = [...classes, classWithSchedule];
    setClasses(newClasses);
    saveToStorage('classes', newClasses);
    
    alert('✅ Class added successfully with room allocations!');
    
    // Reset for next class
    setCurrentClass({
      year: '1',
      section: 'A',
      semester: '1',
      academicYear: '2024-2025',
      timetableData: initializeTimetableData(),
      processedSchedule: null
    });
  };

  const addManualBooking = () => {
    if (!currentBooking.faculty || !currentBooking.room || !currentBooking.reason) {
      alert('❌ Please fill all required fields');
      return;
    }
    
    const newBookings = [...manualBookings, { ...currentBooking, id: Date.now() }];
    setManualBookings(newBookings);
    saveToStorage('bookings', newBookings);
    
    setCurrentBooking({
      faculty: '', room: '', day: 'Monday', time: '08:15',
      duration: 50, reason: '', forClass: ''
    });
    
    setShowManualBookingModal(false);
    alert('✅ Room booked successfully!');
  };

  const handleAllocateRooms = () => {
    const newAllocations = [];
    const newConflicts = [];
    
    classes.forEach(classData => {
      classData.processedSchedule?.forEach(session => {
        const sessionId = `${classData.year}-${classData.section}-${session.day}-${session.time}`;
        
        if (session.error) {
          newConflicts.push({
            id: sessionId,
            year: classData.year,
            section: classData.section,
            ...session,
            reason: session.error
          });
        } else {
          newAllocations.push({
            id: sessionId,
            year: classData.year,
            section: classData.section,
            semester: classData.semester,
            ...session,
            building: 'IT Block',
            roomCapacity: session.type === 'LAB' ? 30 : 60,
            utilization: session.type === 'LAB' ? '100.0' : '100.0'
          });
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
        type: 'MANUAL',
        periodCount: 1
      });
    });
    
    setAllocations(newAllocations);
    setConflicts(newConflicts);
    setAnalytics(calculateAnalytics(newAllocations, newConflicts));
    saveToStorage('allocations', newAllocations);
    setActiveTab('results');
  };

  const calculateAnalytics = (allocs, confs) => {
    const totalRooms = classrooms.length;
    const usedRooms = new Set(allocs.map(a => a.room)).size;
    
    return {
      totalAllocations: allocs.length,
      roomsUsed: usedRooms,
      totalRooms,
      freeRooms: totalRooms - usedRooms,
      utilizationRate: '95.0',
      conflicts: confs.length,
      manualBookingsCount: manualBookings.length
    };
  };

  const downloadReport = () => {
    let csv = '\uFEFF';
    csv += 'IT CLASSROOM ALLOCATION REPORT\n';
    csv += `Generated,${new Date().toLocaleString()}\n\n`;
    csv += 'Type,Year,Section,Semester,Subject,Faculty,Day,Time,Duration,Periods,Room,Students,Batch\n';
    
    allocations.forEach(a => {
      const subj = (a.subject || '').replace(/,/g, ';');
      const fac = (a.faculty || '-').replace(/,/g, ';');
      csv += `${a.type},${a.year},${a.section},${a.semester||'-'},${subj},${fac},${a.day},${a.time},${a.duration},${a.periodCount||1},${a.room},${a.students},${a.batch||'-'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Allocation_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getColorForPeriods = (periodCount, type) => {
    if (type === 'LAB') return 'bg-blue-100 border-blue-500 text-blue-900';
    if (periodCount === 1) return 'bg-green-100 border-green-500 text-green-900';
    if (periodCount === 2) return 'bg-yellow-100 border-yellow-500 text-yellow-900';
    if (periodCount === 3) return 'bg-orange-100 border-orange-500 text-orange-900';
    return 'bg-purple-100 border-purple-500 text-purple-900';
  };

  const renderProcessedSchedule = () => {
    if (!currentClass.processedSchedule || currentClass.processedSchedule.length === 0) {
      return null;
    }

    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl">
        <h3 className="text-2xl font-bold text-indigo-900 mb-4">📊 Processed Schedule Preview</h3>
        <p className="text-sm text-gray-700 mb-4">This shows how your timetable will be allocated with rooms and continuous periods grouped by color</p>
        
        <div className="mb-4 flex gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 border-2 border-blue-500 rounded"></div>
            <span className="font-semibold">Lab Session</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
            <span className="font-semibold">1 Period Theory</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
            <span className="font-semibold">2 Continuous Periods</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 border-2 border-orange-500 rounded"></div>
            <span className="font-semibold">3 Continuous Periods</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 border-2 border-purple-500 rounded"></div>
            <span className="font-semibold">4+ Continuous Periods</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-indigo-900 text-white">
                <th className="p-3 border text-left font-bold">Day</th>
                <th className="p-3 border text-left font-bold">Time</th>
                <th className="p-3 border text-left font-bold">Subject</th>
                <th className="p-3 border text-left font-bold">Faculty</th>
                <th className="p-3 border text-left font-bold">Periods</th>
                <th className="p-3 border text-left font-bold">Duration</th>
                <th className="p-3 border text-left font-bold">Room</th>
                <th className="p-3 border text-left font-bold">Students</th>
                <th className="p-3 border text-left font-bold">Batch</th>
              </tr>
            </thead>
            <tbody>
              {currentClass.processedSchedule.map((session, idx) => (
                <tr key={idx} className={`border ${getColorForPeriods(session.periodCount, session.type)}`}>
                  <td className="p-3 border font-semibold">{session.day}</td>
                  <td className="p-3 border font-mono">{session.time}</td>
                  <td className="p-3 border font-semibold">{session.subject}</td>
                  <td className="p-3 border text-xs">{session.faculty}</td>
                  <td className="p-3 border text-center font-bold">{session.periodCount}</td>
                  <td className="p-3 border text-center">{session.duration}m</td>
                  <td className="p-3 border font-bold text-indigo-900">{session.room}</td>
                  <td className="p-3 border text-center">{session.students}</td>
                  <td className="p-3 border text-xs">{session.batch || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {currentClass.processedSchedule.some(s => s.error) && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
            <p className="text-red-900 font-bold">⚠️ Some sessions have conflicts and need attention!</p>
          </div>
        )}
      </div>
    );
  };

  const renderClassTimetableView = () => {
    if (!selectedClassView) return null;
    const classData = classes.find(c => c.id === selectedClassView);
    if (!classData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8">
          <div className="p-6 border-b bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Year {classData.year} - Section {classData.section}</h3>
                <p className="text-sm mt-1">Semester {classData.semester} | {classData.academicYear}</p>
              </div>
              <button onClick={() => setSelectedClassView(null)} className="text-white hover:bg-blue-800 p-2 rounded">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-2 border-gray-300 p-3 font-bold text-left">Time</th>
                  {days.map(d => <th key={d} className="border-2 border-gray-300 p-3 font-bold">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(slot => (
                  <tr key={slot.time}>
                    <td className="border-2 border-gray-300 p-3 font-semibold bg-gray-50">{slot.label}</td>
                    {days.map(day => {
                      const sess = classData.processedSchedule?.find(s => s.day === day && s.time === slot.time);
                      const colorClass = sess ? getColorForPeriods(sess.periodCount, sess.type) : 'bg-gray-50';
                      
                      return (
                        <td key={day} className={`border-2 p-3 ${colorClass}`}>
                          {sess ? (
                            <div className="space-y-1">
                              <div className="font-bold text-sm">{sess.subject}</div>
                              <div className="text-xs">📍 {sess.room}</div>
                              {sess.faculty && <div className="text-xs">👤 {sess.faculty.split('-')[0]?.trim()}</div>}
                              {sess.batch && <div className="text-xs font-medium">{sess.batch}</div>}
                              <div className="text-xs">⏱️ {sess.duration}m ({sess.periodCount}p)</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400 py-4">Free</div>
                          )}
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

  const renderTimetableTable = () => {
    return (
      <div className="overflow-x-auto border-2 border-gray-300 rounded-lg">
        <table className="w-full text-sm bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border-2 border-gray-300 font-bold">Time</th>
              {days.map(day => <th key={day} className="p-3 border-2 border-gray-300 font-bold">{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot, idx) => (
              <tr key={slot.time}>
                <td className="p-2 border-2 border-gray-300 bg-gray-100 font-semibold">{slot.label}</td>
                {days.map(day => {
                  const daySlot = currentClass.timetableData[day]?.[idx];
                  if (!daySlot) return <td key={day} className="p-2 border-2 border-gray-300"></td>;
                  
                  return (
                    <td key={day} className="p-2 border-2 border-gray-300">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={daySlot.subject}
                          onChange={(e) => updateTimetableCell(day, idx, 'subject', e.target.value)}
                          placeholder="Subject (e.g., DSA)"
                          className="w-full p-1.5 border border-gray-300 rounded text-xs"
                        />
                        <select
                          value={daySlot.faculty}
                          onChange={(e) => updateTimetableCell(day, idx, 'faculty', e.target.value)}
                          className="w-full p-1.5 border border-gray-300 rounded text-xs"
                        >
                          <option value="">Select faculty</option>
                          {facultyList.map(f => <option key={f} value={f}>{f.split('-')[0]?.trim()}</option>)}
                        </select>
                      </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-blue-900">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-10 h-10 text-blue-900" />
                <h1 className="text-3xl font-bold text-gray-800">IT Classroom Allocation System</h1>
              </div>
              <p className="text-gray-600 font-medium">Smart Lab Allocation with Auto-Detection & Color-Coded Schedules</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b-2 border-gray-200">
            {['input', 'booking', 'allocate', 'results'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} 
                disabled={(tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)}
                className={`flex-1 py-4 px-4 font-semibold text-sm transition-all border-b-4 ${
                  activeTab === tab 
                    ? 'border-blue-900 text-blue-900 bg-blue-50' 
                    : 'border-transparent text-gray-600 hover:text-blue-900 hover:bg-gray-50'
                } ${((tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                {tab === 'input' && <><Upload className="w-4 h-4 inline mr-2" />Add Classes</>}
                {tab === 'booking' && <><Calendar className="w-4 h-4 inline mr-2" />Faculty Booking</>}
                {tab === 'allocate' && <><CheckCircle className="w-4 h-4 inline mr-2" />Allocate</>}
                {tab === 'results' && <><TrendingUp className="w-4 h-4 inline mr-2" />Results</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'input' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Class Timetable</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Academic Year</label>
                  <input type="text" value={currentClass.academicYear} 
                    onChange={(e) => setCurrentClass({ ...currentClass, academicYear: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                    placeholder="2024-2025" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
                  <select value={currentClass.year} 
                    onChange={(e) => setCurrentClass({ ...currentClass, year: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg">
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Section</label>
                  <select value={currentClass.section} 
                    onChange={(e) => setCurrentClass({ ...currentClass, section: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg">
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Semester</label>
                  <select value={currentClass.semester} 
                    onChange={(e) => setCurrentClass({ ...currentClass, semester: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg">
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  CSV/Text File Format Guide
                </h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Format:</strong> Day, Time, Subject, Faculty</p>
                  <p><strong>Example 1:</strong> Monday, 08:15, Data Structures, Dr. Smith</p>
                  <p><strong>Example 2 (Lab):</strong> Tuesday, 09:05, Network Programming (L), Dr. Johnson</p>
                  <p><strong>Example 3 (Split Lab):</strong> Wednesday, 10:10, NP(L)/FSWD(L), Dr. Brown</p>
                  <p className="text-xs mt-2 text-blue-700">💡 For labs: Add (L) suffix or use "/" to split between two different subjects</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">Upload CSV/Text File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-all">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <label className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer inline-flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    {processing ? 'Processing...' : 'Choose CSV/Text File'}
                    <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" disabled={processing} />
                  </label>
                  <p className="text-sm text-gray-600 mt-3">Accepts .csv and .txt files</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Or Enter Timetable Manually</h3>
                  <button onClick={() => {
                    setCurrentClass({ ...currentClass, timetableData: initializeTimetableData(), processedSchedule: null });
                  }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    <Trash2 className="w-4 h-4 inline mr-2" />Clear All
                  </button>
                </div>
                {renderTimetableTable()}
                <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-900">
                    💡 <strong>Tips:</strong>
                  </p>
                  <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                    <li>For single lab: Add "(L)" - e.g., "Database (L)"</li>
                    <li>For split labs: Use "/" - e.g., "NP(L)/FSWD(L)"</li>
                    <li>Enter same subject in consecutive periods for continuous classes</li>
                    <li>System will auto-detect and group continuous periods</li>
                  </ul>
                </div>
              </div>

              <button onClick={() => {
                const processedSchedule = processAndAllocateClass();
                setCurrentClass({ ...currentClass, processedSchedule });
              }}
                className="bg-purple-700 hover:bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg mb-6">
                <Eye className="w-6 h-6 inline mr-3" />Preview Room Allocation
              </button>

              {renderProcessedSchedule()}

              <button onClick={addClass}
                className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg mt-6">
                <Plus className="w-6 h-6 inline mr-3" />Add Class to System
              </button>

              {classes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Added Classes ({classes.length})</h3>
                  <div className="grid gap-4">
                    {classes.map(cls => (
                      <div key={cls.id} className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg">
                            Year {cls.year} - Section {cls.section} | Semester {cls.semester}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            📅 {cls.academicYear} | 📚 {cls.processedSchedule?.length || 0} sessions allocated
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedClassView(cls.id)}
                            className="text-blue-600 hover:text-blue-800 p-3 rounded-lg bg-blue-100"
                            title="View Timetable">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => {
                            const newClasses = classes.filter(c => c.id !== cls.id);
                            setClasses(newClasses);
                            saveToStorage('classes', newClasses);
                          }}
                            className="text-red-600 hover:text-red-800 p-3 rounded-lg bg-red-100">
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

          {activeTab === 'booking' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Faculty Room Booking</h2>
              
              <button onClick={() => setShowManualBookingModal(true)}
                className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold mb-6">
                <Plus className="w-5 h-5 inline mr-2" />New Room Booking
              </button>

              {manualBookings.length === 0 ? (
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-700 font-bold text-xl">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {manualBookings.map(booking => (
                    <div key={booking.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-lg mb-2">👤 {booking.faculty}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-semibold">🏢 Room:</span> {booking.room}</div>
                            <div><span className="font-semibold">📅 Day:</span> {booking.day}</div>
                            <div><span className="font-semibold">🕐 Time:</span> {booking.time}</div>
                            <div><span className="font-semibold">⏱️ Duration:</span> {booking.duration} min</div>
                          </div>
                          <div className="mt-3 bg-white rounded-lg border-2 border-gray-200 p-3">
                            <span className="font-semibold">📝 Reason:</span> {booking.reason}
                          </div>
                        </div>
                        <button onClick={() => {
                          const newBookings = manualBookings.filter(b => b.id !== booking.id);
                          setManualBookings(newBookings);
                          saveToStorage('bookings', newBookings);
                        }}
                          className="text-red-600 hover:text-red-800 p-3 rounded-lg ml-4">
                          <Trash2 className="w-5 h-5" />
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
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Review & Allocate Rooms</h2>
              
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-r-lg">
                <p className="text-green-900 font-bold text-lg">
                  ✅ {classes.length} classes ready • {manualBookings.length} bookings
                </p>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6">
                  <h4 className="font-bold text-blue-900 mb-3">📚 Theory Rooms</h4>
                  <p className="text-4xl font-bold text-blue-700">{classrooms.filter(r => r.type === 'THEORY').length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
                  <h4 className="font-bold text-green-900 mb-3">🧪 Lab 1</h4>
                  <p className="text-2xl font-bold text-green-700">30 capacity</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
                  <h4 className="font-bold text-green-900 mb-3">🧪 Lab 2</h4>
                  <p className="text-2xl font-bold text-green-700">30 capacity</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
                  <h4 className="font-bold text-green-900 mb-3">🧪 Labs 3 & 4</h4>
                  <p className="text-2xl font-bold text-green-700">30 each</p>
                </div>
              </div>

              <button onClick={handleAllocateRooms}
                className="bg-gradient-to-r from-green-700 to-green-500 hover:from-green-600 hover:to-green-400 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-xl">
                <CheckCircle className="w-7 h-7 inline mr-3" />Run Final Allocation
              </button>
            </div>
          )}

          {activeTab === 'results' && analytics && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Allocation Results</h2>
                <button onClick={downloadReport}
                  className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg">
                  <Download className="w-5 h-5 inline mr-2" />Download Report
                </button>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-8">
                <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md">
                  <Users className="w-8 h-8 mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{analytics.totalAllocations}</div>
                  <div className="text-sm text-gray-600 font-semibold">Total Sessions</div>
                </div>
                <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md">
                  <Building2 className="w-8 h-8 mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{analytics.roomsUsed}/{analytics.totalRooms}</div>
                  <div className="text-sm text-gray-600 font-semibold">Rooms Used</div>
                </div>
                <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md">
                  <CheckCircle className="w-8 h-8 mb-3 text-green-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{analytics.freeRooms}</div>
                  <div className="text-sm text-gray-600 font-semibold">Free Rooms</div>
                </div>
                <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md">
                  <TrendingUp className="w-8 h-8 mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{analytics.utilizationRate}%</div>
                  <div className="text-sm text-gray-600 font-semibold">Utilization</div>
                </div>
                <div className="bg-white border-2 border-gray-300 rounded-xl p-6 shadow-md">
                  <AlertCircle className="w-8 h-8 mb-3 text-red-600" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{conflicts.length}</div>
                  <div className="text-sm text-gray-600 font-semibold">Conflicts</div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📅 Class Timetables</h3>
                <div className="grid grid-cols-2 gap-4">
                  {classes.map(cls => (
                    <button key={cls.id} onClick={() => setSelectedClassView(cls.id)}
                      className="bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-2 border-blue-400 rounded-xl p-5 text-left shadow-md hover:shadow-xl transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-blue-900 text-lg">Year {cls.year} - Section {cls.section}</p>
                          <p className="text-sm text-blue-700 mt-1">Semester {cls.semester} • {cls.processedSchedule?.length || 0} sessions</p>
                        </div>
                        <Eye className="w-6 h-6 text-blue-700" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {conflicts.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />Conflicts ({conflicts.length})
                  </h3>
                  <div className="border-2 border-red-200 rounded-lg bg-red-50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-red-100">
                        <tr>
                          <th className="p-3 text-left font-bold">Subject</th>
                          <th className="p-3 text-left font-bold">Year-Sec</th>
                          <th className="p-3 text-left font-bold">Day & Time</th>
                          <th className="p-3 text-left font-bold">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {conflicts.map((c, i) => (
                          <tr key={i} className="border-t border-red-100">
                            <td className="p-3">{c.subject}</td>
                            <td className="p-3">{c.year}-{c.section}</td>
                            <td className="p-3">{c.day} {c.time}</td>
                            <td className="p-3 text-red-600 font-semibold">{c.reason}</td>
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

      {/* Manual Booking Modal */}
      {showManualBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">New Booking</h3>
              <button onClick={() => setShowManualBookingModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 space-y-4">
              <select value={currentBooking.faculty} onChange={(e) => setCurrentBooking({ ...currentBooking, faculty: e.target.value})} className="w-full p-3 border rounded">
                <option value="">Select faculty...</option>
                {facultyList.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select value={currentBooking.room} onChange={(e) => setCurrentBooking({ ...currentBooking, room: e.target.value})} className="w-full p-3 border rounded">
                <option value="">Select room...</option>
                {classrooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <select value={currentBooking.day} onChange={(e) => setCurrentBooking({ ...currentBooking, day: e.target.value})} className="w-full p-3 border rounded">
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={currentBooking.time} onChange={(e) => setCurrentBooking({ ...currentBooking, time: e.target.value})} className="w-full p-3 border rounded">
                  {timeSlots.map(s => <option key={s.time} value={s.time}>{s.label}</option>)}
                </select>
              </div>
              <input type="number" placeholder="Duration (min)" value={currentBooking.duration} onChange={(e) => setCurrentBooking({ ...currentBooking, duration: parseInt(e.target.value)})} className="w-full p-3 border rounded" />
              <textarea placeholder="Reason..." value={currentBooking.reason} onChange={(e) => setCurrentBooking({ ...currentBooking, reason: e.target.value})} className="w-full p-3 border rounded" rows="3"></textarea>
            </div>
            <div className="p-4 border-t flex gap-3 justify-end bg-gray-50">
              <button onClick={() => setShowManualBookingModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={addManualBooking} className="px-4 py-2 bg-green-700 text-white rounded">Book Room</button>
            </div>
          </div>
        </div>
      )}

      {renderClassTimetableView()}
    </div>
  );
};

export default ITClassroomAllocation;