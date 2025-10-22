import React, { useState } from 'react';
import { Calendar, Upload, Download, AlertCircle, CheckCircle, Building2, Users, TrendingUp, FileUp, Loader, X, Plus, Trash2, Clock, User, BookOpen, Settings, Image as ImageIcon } from 'lucide-react';

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
  const [imageEnhancement, setImageEnhancement] = useState(true);

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
    { id: 'Open Source Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Open Source Lab' },
    { id: 'Internet Technology Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Internet Tech Lab' },
    { id: 'Database Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Database Lab' },
    { id: 'Software Engineering Lab', capacity: 30, type: 'IT_LAB', building: 'IT Block', year: 'all', symbol: '💻', name: 'Software Eng Lab' }
  ];

  // Enhanced lab subjects with specific room mappings
  const labSubjects = [
    'NP Lab',
    'FSWD Lab', 
    'MP Lab',
    'DSA(L)',
    'OOPJ(L)',
    'FAIML(L)',
    'Networks Programming Lab',
    'Full Stack Web Development Lab',
    'Mini Project',
    'Data Structures Lab',
    'Object Oriented Programming Java Lab',
    'Fundamentals of AI/ML Lab'
  ];

  // Lab to room mapping based on your requirements
  const labRoomMapping = {
    // NP Lab → Open Source Lab
    'NP': 'Open Source Lab',
    'NP Lab': 'Open Source Lab',
    'Networks Programming Lab': 'Open Source Lab',
    
    // FSWD Lab → Software Engineering Lab
    'FSWD': 'Software Engineering Lab',
    'FSWD Lab': 'Software Engineering Lab',
    'Full Stack Web Development Lab': 'Software Engineering Lab',
    
    // OOPJ Lab → Software Engineering Lab
    'OOPJ': 'Software Engineering Lab',
    'OOPJ(L)': 'Software Engineering Lab',
    'Object Oriented Programming Java Lab': 'Software Engineering Lab',
    
    // FAIML Lab → Internet Technology Lab
    'FAIML': 'Internet Technology Lab',
    'FAIML(L)': 'Internet Technology Lab',
    'Fundamentals of AI/ML Lab': 'Internet Technology Lab',
    
    // DSA Lab → Database Lab
    'DSA': 'Database Lab',
    'DSA(L)': 'Database Lab',
    'Data Structures Lab': 'Database Lab',
    
    // MP Lab → Classrooms based on year
    'MP': '1101', // Default for first year
    'MP Lab': '1101',
    'Mini Project': '1101'
  };

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

  // Enhanced image preprocessing with multiple enhancement techniques
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = function() {
        // Double the resolution for better OCR
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        
        // Draw original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        if (imageEnhancement) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Multiple enhancement techniques
          for (let i = 0; i < data.length; i += 4) {
            // 1. Increase contrast
            const contrast = 1.5;
            data[i] = ((data[i] - 128) * contrast) + 128;
            data[i + 1] = ((data[i + 1] - 128) * contrast) + 128;
            data[i + 2] = ((data[i + 2] - 128) * contrast) + 128;
            
            // 2. Adjust brightness
            const brightness = 20;
            data[i] = Math.min(255, Math.max(0, data[i] + brightness));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness));
            
            // 3. Sharpen edges (simplified)
            if (i > canvas.width * 4 && i < data.length - canvas.width * 4) {
              // Simple edge enhancement
              const sharpen = 0.3;
              data[i] = Math.min(255, Math.max(0, data[i] + 
                (data[i] - data[i - 4]) * sharpen));
            }
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        // Convert to high-quality JPEG
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

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
    let processedFile = file;
    
    // Preprocess image if enhancement is enabled
    if (imageEnhancement && file.type.startsWith('image/')) {
      setProcessingStatus('🖼️ Enhancing image quality...');
      processedFile = await preprocessImage(file);
    }
    
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
      tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789():-,. ',
    });
    
    const { data: { text } } = await worker.recognize(processedFile);
    await worker.terminate();
    
    return text;
  };

  // Enhanced timetable parser with better lab detection
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
    
    // Enhanced lab detection patterns
    const labPatterns = [
      /NP\s*(LAB)?/i,
      /FSWD\s*(LAB)?/i,
      /MP\s*(LAB)?/i,
      /DSA\s*\(?L\)?/i,
      /OOPJ\s*\(?L\)?/i,
      /FAIML\s*\(?L\)?/i,
      /NETWORKS?\s*PROGRAMMING?\s*(LAB)?/i,
      /FULL\s*STACK\s*(LAB)?/i,
      /MINI\s*PROJECT/i,
      /DATA\s*STRUCTURES?\s*(LAB)?/i,
      /OBJECT\s*ORIENTED\s*PROGRAMMING?\s*(LAB)?/i,
      /AI\s*ML\s*(LAB)?/i,
      /ARTIFICIAL\s*INTELLIGENCE\s*(LAB)?/i
    ];
    
    for (let line of lines) {
      const upperLine = line.trim().toUpperCase();
      
      // Check for day headers
      for (let day of days) {
        if (upperLine.includes(day)) {
          currentDay = dayMap[day];
          break;
        }
      }
      
      if (currentDay) {
        // Extract subjects from the line
        const subjectMatches = upperLine.match(/[A-Z]{2,}(?:\s*\(?[A-Z]?\)?)?(?:\s*LAB)?/g) || [];
        
        subjectMatches.forEach((subject, idx) => {
          if (idx < timeSlotsDef.length && subject.length > 1) {
            // Skip if it's a day name
            if (days.some(day => subject.includes(day))) return;
            
            // Enhanced lab detection
            const isLab = labPatterns.some(pattern => pattern.test(subject));
            
            // Determine duration - labs are 3-4 periods (135-180 minutes)
            const duration = isLab ? 180 : 50; // 3 hours for labs
            
            parsed.push({
              subject: subject.trim(),
              day: currentDay,
              time: timeSlotsDef[idx].time,
              duration: duration,
              students: isLab ? 30 : 60,
              type: isLab ? 'LAB' : 'THEORY'
            });
          }
        });
      }
    }
    
    // Remove duplicates and validate
    const uniqueSessions = [];
    const sessionMap = new Map();
    
    parsed.forEach(session => {
      const key = `${session.day}-${session.time}-${session.subject}`;
      if (!sessionMap.has(key)) {
        sessionMap.set(key, true);
        uniqueSessions.push(session);
      }
    });
    
    return uniqueSessions;
  };

  // Auto-generate lab rules based on subject and year
  const generateLabRules = (timetableData, year, section) => {
    const labRules = [];
    
    timetableData.forEach(session => {
      if (session.type === 'LAB') {
        const subject = session.subject.toUpperCase();
        let labRoom = '';
        
        // Determine lab room based on subject and mapping
        if (subject.includes('NP') || subject.includes('NETWORKS PROGRAMMING')) {
          labRoom = 'Open Source Lab';
        } else if (subject.includes('FSWD') || subject.includes('FULL STACK')) {
          labRoom = 'Software Engineering Lab';
        } else if (subject.includes('OOPJ') || subject.includes('OBJECT ORIENTED')) {
          labRoom = 'Software Engineering Lab';
        } else if (subject.includes('FAIML') || subject.includes('AI/ML') || subject.includes('ARTIFICIAL INTELLIGENCE')) {
          labRoom = 'Internet Technology Lab';
        } else if (subject.includes('DSA') || subject.includes('DATA STRUCTURES')) {
          labRoom = 'Database Lab';
        } else if (subject.includes('MP') || subject.includes('MINI PROJECT')) {
          // MP in regular classrooms based on year
          if (year === '1') {
            labRoom = '1101'; // First year MP in 1101
          } else if (year === '2') {
            labRoom = '1201'; // Second year MP in 1201
          } else {
            labRoom = '1301'; // Third/Fourth year MP in 1301
          }
        }
        
        if (labRoom) {
          const existingRule = labRules.find(rule => rule.subject === session.subject);
          if (!existingRule) {
            labRules.push({
              subject: session.subject,
              labType: subject.includes('MP') ? 'whole' : 'split',
              batch1Room: labRoom,
              batch2Room: subject.includes('MP') ? '' : labRoom, // MP uses same room for both batches
              wholeClassRoom: subject.includes('MP') ? labRoom : '',
              strength: 30
            });
          }
        }
      }
    });
    
    return labRules;
  };

  const handleTimetableUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus('📄 Processing timetable...');

    try {
      let text = '';
      
      if (file.type.startsWith('image/')) {
        setProcessingStatus('🖼️ Enhancing and extracting text from image...');
        text = await performOCR(file);
      } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        text = await file.text();
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        throw new Error('Unsupported file format');
      }

      console.log('Extracted text:', text); // For debugging
      
      const timetableData = parseTimetable(text);
      
      if (timetableData.length === 0) {
        throw new Error('No timetable data extracted. Please check image quality or try manual entry.');
      }
      
      // Auto-generate lab rules
      const autoLabRules = generateLabRules(timetableData, currentClass.year, currentClass.section);
      
      setCurrentClass({
        ...currentClass,
        timetableFile: timetableData,
        timetableName: file.name,
        labRules: [...currentClass.labRules, ...autoLabRules]
      });
      
      const labCount = timetableData.filter(s => s.type === 'LAB').length;
      setProcessingStatus(`✅ Timetable loaded! ${timetableData.length} sessions extracted (${labCount} labs, ${autoLabRules.length} auto-generated rules)`);
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

  // Get MP room based on year
  const getMPRoom = (year) => {
    if (year === '1') return '1101';
    if (year === '2') return '1201';
    if (year === '3') return '1301';
    return '1301'; // Default for 4th year
  };

  const allocateRooms = () => {
    const newAllocations = [];
    const newConflicts = [];
    
    classes.forEach(classData => {
      const { year, section, timetableFile, labRules } = classData;
      
      timetableFile.forEach(session => {
        const sessionId = `${year}-${section}-${session.day}-${session.time}`;
        
        const labRule = labRules.find(rule => 
          session.subject.toUpperCase().includes(rule.subject.toUpperCase().split('(')[0].trim())
        );
        
        if (labRule || session.type === 'LAB') {
          // Handle lab sessions
          if (labRule?.labType === 'split' && !session.subject.toUpperCase().includes('MP')) {
            // Split batch lab (except MP)
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
            // Whole class lab or MP
            let room;
            if (session.subject.toUpperCase().includes('MP')) {
              room = getMPRoom(year);
            } else {
              // Find the appropriate lab room
              const subjectKey = Object.keys(labRoomMapping).find(key => 
                session.subject.toUpperCase().includes(key.toUpperCase())
              );
              room = subjectKey ? labRoomMapping[subjectKey] : 'Open Source Lab';
            }
            
            const wholeClass = {
              id: sessionId,
              subject: session.subject,
              department: 'IT',
              year: year,
              section: section,
              students: session.subject.toUpperCase().includes('MP') ? 60 : 30,
              day: session.day,
              time: session.time,
              duration: session.duration,
              room: room,
              building: 'IT Block',
              roomCapacity: session.subject.toUpperCase().includes('MP') ? 
                classrooms.find(r => r.id === room)?.capacity || 60 : 30,
              utilization: session.subject.toUpperCase().includes('MP') ? 
                ((60 / (classrooms.find(r => r.id === room)?.capacity || 60)) * 100).toFixed(1) : 
                ((30 / 30) * 100).toFixed(1),
              type: 'LAB'
            };
            
            if (!checkConflict(wholeClass.room, wholeClass.day, wholeClass.time, wholeClass.duration, wholeClass.id, newAllocations)) {
              newAllocations.push(wholeClass);
            } else {
              newConflicts.push({ ...wholeClass, reason: 'Room conflict' });
            }
          }
        } else {
          // Theory session allocation
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
    
    // Add manual bookings
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
    
    // Calculate utilization only for non-manual bookings
    const nonManualAllocs = allocs.filter(a => a.type !== 'MANUAL' && a.utilization !== '-');
    const avgUtilization = nonManualAllocs.length > 0 
      ? nonManualAllocs.reduce((sum, a) => sum + parseFloat(a.utilization), 0) / nonManualAllocs.length : 0;
    
    const byDay = {};
    allocs.forEach(a => { byDay[a.day] = (byDay[a.day] || 0) + 1; });
    
    const byYear = {};
    allocs.forEach(a => { if (a.year !== '-') byYear[a.year] = (byYear[a.year] || 0) + 1; });
    
    const byType = {
      'THEORY': allocs.filter(a => a.type === 'THEORY').length,
      'LAB': allocs.filter(a => a.type === 'LAB').length,
      'MANUAL': allocs.filter(a => a.type === 'MANUAL').length
    };
    
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
      byType,
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
    csv += `Theory Sessions,${analytics?.byType?.THEORY || 0}\n`;
    csv += `Lab Sessions,${analytics?.byType?.LAB || 0}\n`;
    csv += `Manual Bookings,${manualBookings.length}\n`;
    csv += `Conflicts,${conflicts.length}\n`;
    csv += `Free Rooms,${analytics?.freeRooms || 0}\n`;
    csv += `Average Utilization,${analytics?.utilizationRate || 0}%\n`;
    csv += '\n\n';
    
    csv += 'SUMMARY ANALYTICS\n';
    csv += 'Metric,Value\n';
    if (analytics) {
      csv += `Total Allocations,${analytics.totalAllocations}\n`;
      csv += `Rooms Used,${analytics.roomsUsed} of ${analytics.totalRooms}\n`;
      csv += `Free Rooms,${analytics.freeRooms}\n`;
      csv += `Theory Sessions,${analytics.byType.THEORY}\n`;
      csv += `Lab Sessions,${analytics.byType.LAB}\n`;
      csv += `Manual Bookings,${analytics.byType.MANUAL}\n`;
      csv += `Average Utilization,${analytics.utilizationRate}%\n`;
      csv += `Conflicts,${analytics.conflicts}\n`;
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
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Room Availability & Free Time Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.roomSchedule).map(([roomId, data]) => (
            <div
              key={roomId}
              className={`border rounded-lg p-4 shadow-sm transition-all cursor-pointer ${
                data.allocations.length === 0 
                  ? 'bg-green-50 border-green-200' 
                  : data.freeSlots.length > 8 
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'
              }`}
              onClick={() => setSelectedRoom(selectedRoom === roomId ? null : roomId)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-lg font-semibold text-gray-800">{getRoomSymbol(roomId)} {roomId}</div>
                  <div className="text-sm text-gray-600">{data.room.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">{data.freeSlots.length}</div>
                  <div className="text-xs text-gray-500">Free Slots</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-700">
                <div>Capacity: {data.room.capacity}</div>
                <div>Allocated: {data.allocations.length} sessions</div>
              </div>

              {selectedRoom === roomId && (
                <div className="mt-3 bg-white rounded border border-gray-200 p-3">
                  <div className="font-semibold text-gray-800 mb-2">Free Time Slots:</div>
                  <div className="max-h-32 overflow-y-auto text-xs">
                    {data.freeSlots.length > 0 ? (
                      data.freeSlots.map((slot, idx) => (
                        <div key={idx} className="flex justify-between py-1 border-b border-gray-100">
                          <span className="text-gray-700">{slot.day}</span>
                          <span className="text-gray-600">{slot.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-gray-500">No free slots available</div>
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
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full text-sm bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left font-semibold border-r border-gray-600 sticky left-0 bg-gray-800">Time</th>
              {days.map(day => (
                <th key={day} className="p-3 text-center font-semibold border-r border-gray-600">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((time, idx) => (
              <tr key={time} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-3 font-medium text-gray-700 border-r border-gray-200 sticky left-0 bg-gray-100">{time}</td>
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
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : s.type === 'MANUAL'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}
                            >
                              <div className="font-semibold">{getRoomSymbol(s.room)} {s.room}</div>
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
      <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full text-sm bg-white">
          <thead className="bg-gray-800 text-white sticky top-0">
            <tr>
              <th className="p-3 text-left font-semibold">Subject</th>
              <th className="p-3 text-left font-semibold">Year-Sec</th>
              <th className="p-3 text-left font-semibold">Students</th>
              <th className="p-3 text-left font-semibold">Day & Time</th>
              <th className="p-3 text-left font-semibold">Room</th>
              <th className="p-3 text-left font-semibold">Type</th>
              <th className="p-3 text-left font-semibold">Utilization</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((alloc, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="p-3 text-gray-800">
                  {alloc.subject}
                  {alloc.faculty && <div className="text-xs text-gray-600">by {alloc.faculty}</div>}
                </td>
                <td className="p-3 text-gray-700">
                  {alloc.year === '1'} 
                  {alloc.year === '2'} 
                  {alloc.year === '3'} 
                  {alloc.year === '4'} 
                  {alloc.year}-{alloc.section}
                </td>
                <td className="p-3 text-gray-700">{alloc.students}</td>
                <td className="p-3 text-gray-700">{alloc.day} {alloc.time}</td>
                <td className="p-3 font-semibold text-gray-800">
                  {getRoomSymbol(alloc.room)} {alloc.room}
                </td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alloc.type === 'LAB' 
                      ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                      : alloc.type === 'MANUAL'
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
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
                    <span className="text-xs text-gray-700 font-medium">{alloc.utilization}%</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 text-white rounded-xl shadow-lg p-8 mb-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-2">
            <Building2 className="w-12 h-12 text-blue-300" />
            <h1 className="text-4xl font-bold tracking-tight">IT Classroom Allocation System</h1>
          </div>
          <p className="text-gray-300 text-lg font-medium">Professional Classroom Management with Faculty Booking</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 mb-8">
          <div className="flex border-b border-gray-300">
            {['input', 'booking', 'allocate', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={(tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)}
                className={`flex-1 py-5 px-6 font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
                } ${((tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {tab === 'input' && <><Upload className="w-5 h-5 inline mr-2" />Add Classes</>}
                {tab === 'booking' && <><Calendar className="w-5 h-5 inline mr-2" />Faculty Booking</>}
                {tab === 'allocate' && <><CheckCircle className="w-5 h-5 inline mr-2" />Review & Allocate</>}
                {tab === 'results' && <><TrendingUp className="w-5 h-5 inline mr-2" />View Results</>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-300 p-8">
          {activeTab === 'input' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Class Timetable</h2>
              
              {/* Image Enhancement Settings */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 font-medium">Image Enhancement Settings</p>
                    <p className="text-blue-700 text-sm">Improve OCR accuracy for blurry timetable images</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={imageEnhancement}
                      onChange={(e) => setImageEnhancement(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-blue-800">Enable Image Enhancement</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select
                    value={currentClass.year}
                    onChange={(e) => setCurrentClass({ ...currentClass, year: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                  <select
                    value={currentClass.section}
                    onChange={(e) => setCurrentClass({ ...currentClass, section: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Timetable (Image/CSV/Text)</label>
                <label className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2 w-fit ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <FileUp className="w-5 h-5" />
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
                  <div className={`mt-4 border-l-4 p-4 rounded-r-lg ${
                    processingStatus.startsWith('✅') 
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : processingStatus.startsWith('❌')
                      ? 'bg-red-50 border-red-500 text-red-800'
                      : 'bg-blue-50 border-blue-500 text-blue-800'
                  }`}>
                    {isProcessing && <Loader className="w-5 h-5 animate-spin inline mr-2" />}
                    <span className="text-sm font-medium">{processingStatus}</span>
                  </div>
                )}
                
                {currentClass.timetableName && (
                  <div className="mt-3 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                    <p className="text-sm text-green-800 font-medium">
                      <strong>Loaded:</strong> {currentClass.timetableName} ({currentClass.timetableFile.length} sessions)
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">Lab Allocation Rules</h3>
                  <button
                    onClick={() => setShowLabRuleModal(true)}
                    disabled={!currentClass.timetableFile}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lab Rule
                  </button>
                </div>
                
                {currentClass.labRules.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No lab rules defined. Add rules to specify how lab sessions should be allocated.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {currentClass.labRules.map((rule, idx) => (
                      <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{rule.subject}</p>
                          {rule.labType === 'split' ? (
                            <p className="text-sm text-gray-700">
                              Batch 1 → {rule.batch1Room} ({rule.strength} students) | 
                              Batch 2 → {rule.batch2Room} ({rule.strength} students)
                            </p>
                          ) : (
                            <p className="text-sm text-gray-700">
                              Whole Class → {rule.wholeClassRoom} (60 students)
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeLabRule(idx)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Class to List
                </button>
              </div>

              {classes.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Added Classes ({classes.length})</h3>
                  <div className="grid gap-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {cls.year === '1'} 
                            {cls.year === '2'} 
                            {cls.year === '3'} 
                            {cls.year === '4'} 
                            Year {cls.year} - Section {cls.section}
                          </p>
                          <p className="text-sm text-gray-700">
                            {cls.timetableFile.length} sessions | {cls.labRules.length} lab rules
                          </p>
                        </div>
                        <button
                          onClick={() => removeClass(cls.id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all"
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

          {/* Rest of the component remains the same... */}
          {activeTab === 'booking' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Faculty Room Booking</h2>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
                <p className="text-amber-800 font-medium">
                  <strong>Note:</strong> Faculty members can book rooms for special events, meetings, or other activities. All bookings will be included in the allocation report.
                </p>
              </div>

              <button
                onClick={() => setShowManualBookingModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors shadow-sm hover:shadow-md flex items-center gap-2 mb-6"
              >
                <Plus className="w-5 h-5" />
                New Room Booking
              </button>

              {manualBookings.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-700 font-semibold text-lg">No manual bookings yet</p>
                  <p className="text-gray-600 mt-2">Click "New Room Booking" to add a faculty booking</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Bookings ({manualBookings.length})</h3>
                  <div className="space-y-3">
                    {manualBookings.map((booking) => (
                      <div key={booking.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-purple-600" />
                              <p className="font-semibold text-gray-800">{booking.faculty}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Room:</span>
                                <span className="ml-2 text-gray-800">{getRoomSymbol(booking.room)} {booking.room}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Day:</span>
                                <span className="ml-2 text-gray-800">{booking.day}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Time:</span>
                                <span className="ml-2 text-gray-800">{booking.time}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Duration:</span>
                                <span className="ml-2 text-gray-800">{booking.duration} min</span>
                              </div>
                              {booking.forClass && (
                                <div>
                                  <span className="font-medium text-gray-700">For Class:</span>
                                  <span className="ml-2 text-gray-800">{booking.forClass}</span>
                                </div>
                              )}
                              <div>
                                <span className="font-medium text-gray-700">Booked:</span>
                                <span className="ml-2 text-gray-800">{booking.bookedAt}</span>
                              </div>
                            </div>
                            <div className="mt-2 bg-white rounded border border-gray-200 p-2">
                              <span className="font-medium text-gray-700">Reason:</span>
                              <span className="ml-2 text-gray-800">{booking.reason}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeManualBooking(booking.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all ml-4"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Review & Allocate</h2>
              
              <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg mb-6">
                <p className="font-medium">
                  <strong>{classes.length} classes</strong> with <strong>{classes.reduce((sum, c) => sum + c.timetableFile.length, 0)} total sessions</strong> + <strong>{manualBookings.length} faculty bookings</strong> ready for allocation
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Rooms:</h3>
                <div className="grid grid-cols-3 gap-4">
                  {classrooms.map(room => (
                    <div key={room.id} className="border border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{room.symbol}</span>
                        <div className="font-semibold text-gray-800">{room.id}</div>
                      </div>
                      <div className="text-sm text-gray-700">
                        Capacity: {room.capacity} | Type: {room.type}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {room.year === 'all' ? 'All Years' : `Year ${room.year}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={allocateRooms}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-8 py-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Run Allocation Algorithm
              </button>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Allocation Results</h2>
                <button
                  onClick={downloadReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download CSV Report
                </button>
              </div>

              {analytics && (
                <div className="grid grid-cols-5 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-sm">
                    <Users className="w-8 h-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">{analytics.totalAllocations}</div>
                    <div className="text-sm opacity-90">Total Allocations</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-lg shadow-sm">
                    <Building2 className="w-8 h-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">{analytics.roomsUsed}/{analytics.totalRooms}</div>
                    <div className="text-sm opacity-90">Rooms Used</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 rounded-lg shadow-sm">
                    <CheckCircle className="w-8 h-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">{analytics.freeRooms}</div>
                    <div className="text-sm opacity-90">Free Rooms</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-lg shadow-sm">
                    <TrendingUp className="w-8 h-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">{analytics.utilizationRate}%</div>
                    <div className="text-sm opacity-90">Avg Utilization</div>
                  </div>
                  <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-lg shadow-sm">
                    <AlertCircle className="w-8 h-8 mb-3" />
                    <div className="text-3xl font-bold mb-1">{conflicts.length}</div>
                    <div className="text-sm opacity-90">Conflicts</div>
                  </div>
                </div>
              )}

              <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                <div className="flex gap-3 items-center flex-wrap">
                  <span className="text-white font-semibold">View Mode:</span>
                  <div className="flex gap-2">
                    {['table', 'calendar', 'availability'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`px-4 py-2 rounded font-semibold text-sm transition-all ${
                          viewMode === mode
                            ? 'bg-white text-gray-800 shadow-sm'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
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
                      className="px-3 py-2 rounded font-medium text-sm bg-white text-gray-800 border border-gray-300"
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
                      className="px-3 py-2 rounded font-medium text-sm bg-white text-gray-800 border border-gray-300"
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
                      className="px-3 py-2 rounded font-medium text-sm bg-white text-gray-800 border border-gray-300 w-40"
                    />
                  </div>
                </div>
              </div>

              {viewMode === 'availability' && renderRoomAvailability()}
              {viewMode === 'calendar' && renderCalendarView()}
              {viewMode === 'table' && renderTableView()}

              {conflicts.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Conflicts Detected ({conflicts.length})
                  </h3>
                  <div className="border border-red-200 rounded-lg bg-red-50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-red-100 border-b border-red-200">
                        <tr>
                          <th className="p-3 text-left font-semibold text-red-900">Subject</th>
                          <th className="p-3 text-left font-semibold text-red-900">Year-Sec</th>
                          <th className="p-3 text-left font-semibold text-red-900">Students</th>
                          <th className="p-3 text-left font-semibold text-red-900">Day & Time</th>
                          <th className="p-3 text-left font-semibold text-red-900">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflicts.map((conf, idx) => (
                          <tr key={idx} className="border-t border-red-200">
                            <td className="p-3 text-red-800">{conf.subject}</td>
                            <td className="p-3 text-red-700">{conf.year}-{conf.section}</td>
                            <td className="p-3 text-red-700">{conf.students}</td>
                            <td className="p-3 text-red-700">{conf.day} {conf.time}</td>
                            <td className="p-3 text-red-800 font-medium">{conf.reason}</td>
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-6 border-b border-gray-300 flex justify-between items-center bg-gray-800 text-white">
              <h3 className="text-xl font-semibold">Add Lab Allocation Rule</h3>
              <button
                onClick={() => setShowLabRuleModal(false)}
                className="text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lab Subject</label>
                <select
                  value={currentLabRule.subject}
                  onChange={(e) => setCurrentLabRule({ ...currentLabRule, subject: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select a lab subject...</option>
                  {labSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Lab Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="split"
                      checked={currentLabRule.labType === 'split'}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-700">Split Batches (2 labs × 30 students)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="whole"
                      checked={currentLabRule.labType === 'whole'}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, labType: e.target.value })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="font-medium text-gray-700">Whole Class (60 students)</span>
                  </label>
                </div>
              </div>

              {currentLabRule.labType === 'split' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Batch 1 Room</label>
                    <select
                      value={currentLabRule.batch1Room}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch1Room: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Batch 2 Room</label>
                    <select
                      value={currentLabRule.batch2Room}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, batch2Room: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Students per Batch</label>
                    <input
                      type="number"
                      value={currentLabRule.strength}
                      onChange={(e) => setCurrentLabRule({ ...currentLabRule, strength: parseInt(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      min="1"
                      max="40"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Whole Class Room</label>
                  <select
                    value={currentLabRule.wholeClassRoom}
                    onChange={(e) => setCurrentLabRule({ ...currentLabRule, wholeClassRoom: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-sm text-blue-800">
                  <strong>Lab Room Mappings:</strong><br/>
                  • NP Lab → Open Source Lab<br/>
                  • FSWD Lab → Software Engineering Lab<br/>
                  • OOPJ Lab → Software Engineering Lab<br/>
                  • FAIML Lab → Internet Technology Lab<br/>
                  • DSA Lab → Database Lab<br/>
                  • MP Lab → Classrooms (Year-based: 1st→1101, 2nd→1201, 3rd/4th→1301)
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-300 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowLabRuleModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addLabRule}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm hover:shadow-md"
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
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-300">
            <div className="p-6 border-b border-gray-300 flex justify-between items-center bg-gray-800 text-white">
              <h3 className="text-xl font-semibold">New Room Booking</h3>
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty Member</label>
                <select
                  value={currentBooking.faculty}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, faculty: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Select faculty member...</option>
                  {facultyList.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Room</label>
                <select
                  value={currentBooking.room}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, room: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                  <select
                    value={currentBooking.day}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, day: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <select
                    value={currentBooking.time}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, time: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot.time} value={slot.time}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={currentBooking.duration}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    min="15"
                    max="180"
                    step="15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">For Class (Optional)</label>
                  <input
                    type="text"
                    value={currentBooking.forClass}
                    onChange={(e) => setCurrentBooking({ ...currentBooking, forClass: e.target.value })}
                    placeholder="e.g., Year 1 - Section A"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Booking</label>
                <textarea
                  value={currentBooking.reason}
                  onChange={(e) => setCurrentBooking({ ...currentBooking, reason: e.target.value })}
                  placeholder="Please describe the purpose of this booking..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-300 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowManualBookingModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addManualBooking}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm hover:shadow-md"
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