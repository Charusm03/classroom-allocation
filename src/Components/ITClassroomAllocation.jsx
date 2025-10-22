import React, { useState } from 'react';
import { Calendar, Upload, Download, AlertCircle, CheckCircle, Building2, Users, TrendingUp, FileUp, Loader, X, Plus, Trash2, Clock, User, BookOpen, Settings } from 'lucide-react';

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

  // Enhanced image preprocessing
  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = function() {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        
        // Apply image enhancement
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        if (imageEnhancement) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Enhance contrast and brightness
          for (let i = 0; i < data.length; i += 4) {
            // Increase contrast
            data[i] = data[i] < 128 ? data[i] * 0.8 : data[i] * 1.2;
            data[i + 1] = data[i + 1] < 128 ? data[i + 1] * 0.8 : data[i + 1] * 1.2;
            data[i + 2] = data[i + 2] < 128 ? data[i + 2] * 0.8 : data[i + 2] * 1.2;
            
            // Clamp values
            data[i] = Math.min(255, Math.max(0, data[i]));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1]));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2]));
          }
          
          ctx.putImageData(imageData, 0, 0);
        }
        
        canvas.toBlob(resolve, 'image/jpeg', 0.9);
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
            
            parsed.push({
              subject: subject.trim(),
              day: currentDay,
              time: timeSlotsDef[idx].time,
              duration: isLab ? 120 : 50,
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
      
      setCurrentClass({
        ...currentClass,
        timetableFile: timetableData,
        timetableName: file.name
      });
      
      setProcessingStatus(`✅ Timetable loaded! ${timetableData.length} sessions extracted (${timetableData.filter(s => s.type === 'LAB').length} labs)`);
    } catch (error) {
      console.error('Error processing timetable:', error);
      setProcessingStatus(`❌ Error: ${error.message}`);
      alert(`Failed to process timetable: ${error.message}`);
    } finally {
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

  // ... (rest of the functions remain the same as previous version, but with updated styling)

  const getRoomSymbol = (roomId) => {
    const room = classrooms.find(r => r.id === roomId);
    return room ? room.symbol : '📍';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="professional-card rounded-xl shadow-lg p-8 mb-8 fade-in border-l-4 border-blue-600">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">IT Department - Classroom Allocation System</h1>
              <p className="text-gray-600 mt-1">Intelligent room allocation with faculty booking and lab management</p>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="professional-card rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {['input', 'booking', 'allocate', 'results'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                disabled={(tab === 'allocate' && classes.length === 0) || (tab === 'results' && allocations.length === 0)}
                className={`flex-1 py-4 px-6 font-semibold text-sm transition-all duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900'
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

        {/* Main Content */}
        <div className="professional-card rounded-xl shadow-lg p-8 fade-in">
          {activeTab === 'input' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add Class Timetable</h2>
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={imageEnhancement}
                      onChange={(e) => setImageEnhancement(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Enhance image quality</span>
                  </label>
                </div>
              </div>
              
              {/* Class Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select
                    value={currentClass.year}
                    onChange={(e) => setCurrentClass({ ...currentClass, year: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="1">1st Year 🟢</option>
                    <option value="2">2nd Year 🔵</option>
                    <option value="3">3rd Year 🟣</option>
                    <option value="4">4th Year 🔴</option>
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

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Timetable (Image/CSV/Text)</label>
                <label className={`btn-primary flex items-center gap-2 w-fit ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
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
                  <div className={`mt-4 border-l-4 p-4 rounded-r-lg ${
                    processingStatus.startsWith('✅') 
                      ? 'bg-green-50 border-green-500 text-green-800'
                      : processingStatus.startsWith('❌')
                      ? 'bg-red-50 border-red-500 text-red-800'
                      : 'bg-blue-50 border-blue-500 text-blue-800'
                  }`}>
                    {isProcessing && <Loader className="w-4 h-4 animate-spin inline mr-2" />}
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

              {/* Rest of the input tab content with updated styling... */}
              
            </div>
          )}

          {/* Other tabs with similar professional styling updates... */}
          
        </div>
      </div>

      {/* Modals with professional styling... */}
    </div>
  );
};

export default ITClassroomAllocation;