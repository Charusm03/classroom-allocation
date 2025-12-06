import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, AlertCircle, CheckCircle, LayoutGrid, Users, BookOpen, Printer, Save, Clock, Settings, Filter, BarChart2, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import TimetablePreview from './components/TimetablePreview';
import UnallocatedView from './components/UnallocatedView';

const storage = {
  get: async (key) => {
    const val = localStorage.getItem(key);
    return val ? { value: val } : null;
  },
  set: async (key, val) => localStorage.setItem(key, val)
};

const SmartClassroomSystem = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [timetables, setTimetables] = useState([]);
  const [facultyBookings, setFacultyBookings] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [priorityMode, setPriorityMode] = useState('student');
  const [showBooking, setShowBooking] = useState(false);
  const [showConflictResolver, setShowConflictResolver] = useState(null);
  const [resultsFilter, setResultsFilter] = useState({ day: 'All', time: 'All' });

  // Phase 5: External Timetables State
  const [externalTimetables, setExternalTimetables] = useState([]);
  const [uploadRoom, setUploadRoom] = useState('');

  const [classrooms, setClassrooms] = useState([
    { name: '1201', type: 'Classroom' },
    { name: '1202', type: 'Classroom' },
    { name: '1203', type: 'Classroom' },
    { name: '1204', type: 'Classroom' },
    { name: '1301', type: 'Classroom' },
    { name: '1302', type: 'Classroom' },
    { name: 'SE Lab', type: 'Lab' },
    { name: 'OS Lab', type: 'Lab' },
    { name: 'DB Lab', type: 'Lab' },
    { name: 'IT Lab', type: 'Lab' },
    { name: 'Project Lab', type: 'Lab' }
  ]);
  const [newResource, setNewResource] = useState({ name: '', type: 'Classroom' });

  const [currentTT, setCurrentTT] = useState({
    regulation: 'R 2023 V1.0',
    chairperson: 'Dr.K.SUNDAR',
    coordinator: 'P.SIVA SAKTHI, Asst. Prof., IT',
    classroom: '1201',
    effectiveDate: '14.07.2025',
    period: 'June 2025 - Dec 2025',
    academicYear: '2025-2026',
    semester: '5',
    section: 'A',
    yearLevel: '3',
    department: 'INFORMATION TECHNOLOGY',
    courses: [],
    schedule: {}
  });

  const [currentBooking, setCurrentBooking] = useState({
    faculty: '',
    date: '',
    day: 'MON',
    time: '8:15-9:05',
    duration: 50,
    classroom: '',
    reason: '',
    yearLevel: '3',
    priority: 'medium'
  });

  const timeSlots = [
    { p: 1, t: '8:15-9:05' },
    { p: 2, t: '9:05-9:55' },
    { p: 3, t: '10:10-11:00' },
    { p: 4, t: '11:00-11:50' },
    { p: 5, t: '11:50-12:40' },
    { p: 6, t: '1:30-2:15' },
    { p: 7, t: '2:15-3:00' },
    { p: 8, t: '3:00-3:45' }
  ];

  const bookingTimeSlots = [
    ...timeSlots,
    { p: 'Spl', t: '16:00-17:00' }
  ];

  const days = ['MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const ttData = await storage.get('timetables');
        const bookData = await storage.get('bookings');
        const allocData = await storage.get('allocations');
        const roomData = await storage.get('classrooms');
        const extData = await storage.get('externalTimetables');

        if (ttData) { const parsed = JSON.parse(ttData.value); setTimetables(Array.isArray(parsed) ? parsed : []); }
        if (bookData) { const parsed = JSON.parse(bookData.value); setFacultyBookings(Array.isArray(parsed) ? parsed : []); }
        if (allocData) { const parsed = JSON.parse(allocData.value); setAllocations(Array.isArray(parsed) ? parsed : []); }
        if (roomData) { const parsed = JSON.parse(roomData.value); setClassrooms(Array.isArray(parsed) ? parsed : []); }
        if (extData) { const parsed = JSON.parse(extData.value); setExternalTimetables(Array.isArray(parsed) ? parsed : []); }
      } catch (e) {
        console.log('No saved data');
      }
    };
    loadData();
  }, []);

  const save = async (key, data) => {
    try {
      await storage.set(key, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  const addResource = () => {
    if (!newResource.name) return alert('Name is required');
    if (classrooms.find(c => c.name === newResource.name)) return alert('Resource already exists');
    const updated = [...classrooms, newResource];
    setClassrooms(updated);
    save('classrooms', updated);
    setNewResource({ name: '', type: 'Classroom' });
    alert('Resource added!');
  };

  const removeResource = (name) => {
    if (confirm(`Delete ${name}?`)) {
      const updated = classrooms.filter(c => c.name !== name);
      setClassrooms(updated);
      save('classrooms', updated);
    }
  };

  // Phase 5: File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!uploadRoom && !file.name.endsWith('.csv')) {
      alert('Please select a target room for this file!');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target.result;
      const newExt = {
        id: Date.now(),
        name: file.name,
        type: file.type.includes('image') ? 'image' : (file.name.endsWith('.csv') ? 'csv' : 'pdf'),
        data: content,
        targetRoom: uploadRoom || 'Auto (CSV)',
        timestamp: new Date().toLocaleString()
      };

      const updated = [...externalTimetables, newExt];
      setExternalTimetables(updated);
      save('externalTimetables', updated);
      setUploadRoom('');
      e.target.value = null;
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const removeExternal = (id) => {
    const updated = externalTimetables.filter(t => t.id !== id);
    setExternalTimetables(updated);
    save('externalTimetables', updated);
  };

  const addCourse = () => {
    setCurrentTT({
      ...currentTT,
      courses: [...currentTT.courses, {
        id: Date.now(),
        code: '',
        name: '',
        mne: '',
        faculty: '',
        dept: 'IT',
        labResource: '',
        curr: 3,
        allot: 0
      }]
    });
  };

  const updateCourse = (id, field, value) => {
    setCurrentTT({
      ...currentTT,
      courses: currentTT.courses.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const updateSchedule = (day, period, value) => {
    setCurrentTT(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [period]: value
        }
      }
    }));
  };

  const calcPeriods = () => {
    const counts = {};
    days.forEach(day => {
      timeSlots.forEach(slot => {
        const val = currentTT.schedule[day]?.[slot.p];
        if (val) {
          counts[val] = (counts[val] || 0) + 1;
        }
      });
    });

    setCurrentTT(prev => ({
      ...prev,
      courses: prev.courses.map(c => ({
        ...c,
        allot: counts[c.mne] || 0
      }))
    }));
  };

  const saveTimetable = () => {
    if (!currentTT.academicYear || !currentTT.period) {
      alert('❌ Please specify Academic Year and Period');
      return;
    }
    calcPeriods();
    const newTT = { ...currentTT, id: Date.now() };
    const newTimetables = [...timetables.filter(t => t.id !== newTT.id), newTT];
    setTimetables(newTimetables);
    save('timetables', newTimetables);
    alert('✅ Timetable saved successfully!');
  };

  const addBooking = () => {
    if (!currentBooking.faculty || !currentBooking.date || !currentBooking.reason || !currentBooking.classroom) {
      alert('❌ All fields including Reason, Date, Faculty, and Room are mandatory.');
      return;
    }

    if (!currentBooking.yearLevel) {
      alert('❌ Please specify the Year Level for this booking.');
      return;
    }

    const newBooking = { ...currentBooking, id: Date.now() };
    const newBookings = [...facultyBookings, newBooking];
    setFacultyBookings(newBookings);
    save('bookings', newBookings);
    setShowBooking(false);

    setCurrentBooking({
      faculty: '', date: '', day: 'MON', time: '8:15-9:05',
      duration: 50, classroom: '', reason: '', yearLevel: '3', priority: 'medium'
    });
    alert('✅ Booking added successfully!');
  };

  const resolveConflict = (conflictId, action, data) => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    if (action === 'override') {
      const newAllocations = allocations.filter(a => a.id !== conflict.collidingAllocationId);
      const newAlloc = {
        id: `resolved-${Date.now()}`,
        type: conflict.type,
        day: conflict.day,
        time: conflict.time,
        classroom: conflict.classroom,
        subject: conflict.subject,
        faculty: conflict.faculty,
        priority: 'force'
      };

      setAllocations([...newAllocations, newAlloc]);
      save('allocations', [...newAllocations, newAlloc]);
      setConflicts(conflicts.filter(c => c.id !== conflictId));
    } else if (action === 'reschedule') {
      setConflicts(conflicts.filter(c => c.id !== conflictId));
    }
    setShowConflictResolver(null);
  };

  // Phase 6: Rewritten runAllocation to Log for Debugging
  const runAllocation = () => {
    console.log("--- Starting Allocation ---");
    console.log("Timetables:", timetables.length);
    console.log("Faculty Bookings:", facultyBookings.length);
    console.log("External Timetables:", JSON.stringify(externalTimetables));

    const newAllocations = [];
    const newConflicts = [];
    const occupied = {};

    const addToOccupied = (day, time, room, data, allocId) => {
      const key = `${day}-${time}-${room}`;
      occupied[key] = { ...data, allocId };
    };

    try {
      // Phase 5: Process External Timetables
      externalTimetables.forEach(ext => {
        console.log("Processing External:", ext.name);
        if (ext.type === 'csv') {
          const rows = ext.data.split('\n');
          const roomMatch = ext.name.match(/Room\s*(\d+)/i) || ['Unknown', 'Unknown'];
          const targetRoom = ext.targetRoom !== 'Auto (CSV)' ? ext.targetRoom : roomMatch[0];

          rows.forEach((row, idx) => {
            if (idx === 0) return;
            const cols = row.split(',');
            if (cols.length < 2) return;
            const day = cols[0].trim().toUpperCase();
            if (days.includes(day)) {
              timeSlots.forEach((slot, sIdx) => {
                const subject = cols[sIdx + 1]?.trim();
                if (subject) {
                  const allocId = `ext-${ext.id}-${day}-${slot.p}`;
                  addToOccupied(day, slot.t, targetRoom, { type: 'External (CSV)', subject }, allocId);
                  newAllocations.push({
                    id: allocId,
                    type: 'External', day, time: slot.t, classroom: targetRoom,
                    subject: `${subject} (CSV: ${ext.name})`
                  });
                }
              });
            }
          });
        } else {
          if (ext.targetRoom) {
            days.forEach(day => {
              bookingTimeSlots.forEach(slot => {
                const allocId = `ext-${ext.id}-${day}-${slot.p}`;
                addToOccupied(day, slot.t, ext.targetRoom, { type: 'External (Manual)', subject: 'Manual File Schedule' }, allocId);
                newAllocations.push({
                  id: allocId,
                  type: 'External', day, time: slot.t, classroom: ext.targetRoom,
                  subject: `Manual Schedule (${ext.name})`
                });
              });
            });
          }
        }
      });

      // 2. Faculty Bookings
      facultyBookings.forEach(book => {
        const key = `${book.day}-${book.time}-${book.classroom}`;
        if (occupied[key]) {
          newConflicts.push({
            id: `conf-${book.id}`,
            msg: `Faculty Booking Clash: ${book.faculty}`,
            day: book.day, time: book.time, classroom: book.classroom,
            collidingAllocationId: occupied[key].allocId,
            type: book.priority, subject: book.reason, faculty: book.faculty,
            sugg: 'Reschedule or Override'
          });
        } else {
          const allocId = `book-${book.id}`;
          addToOccupied(book.day, book.time, book.classroom, { type: 'Faculty Booking', subject: book.reason }, allocId);
          newAllocations.push({
            id: allocId,
            type: 'Faculty Booking', day: book.day, time: book.time, classroom: book.classroom,
            subject: book.reason, faculty: book.faculty
          });
        }
      });

      // 3. Process Student Timetables (Allocating Labs & Classrooms)
      timetables.forEach(tt => {
        console.log("Processing TT ID:", tt.id);
        // Identify Sessions (Continuous periods of same subject)
        const sessions = [];

        days.forEach(day => {
          let currentSession = null;

          timeSlots.forEach((slot, idx) => {
            // Check logic: Slot 1 -> Slot 8
            const subject = tt.schedule[day]?.[slot.p];

            if (subject) {
              if (currentSession && currentSession.subject === subject) {
                // Extend session
                currentSession.periods.push(slot);
              } else {
                // New session
                if (currentSession) sessions.push(currentSession);
                currentSession = {
                  subject,
                  day,
                  periods: [slot],
                  course: tt.courses.find(c => c.mne === subject)
                };
              }
            } else {
              if (currentSession) {
                sessions.push(currentSession);
                currentSession = null;
              }
            }
          });
          if (currentSession) sessions.push(currentSession);
        });
        console.log("Sessions identified:", sessions.length);

        // Allocate Sessions
        sessions.forEach(session => {
          // Determine needed lab/room
          // Check if Batch Split (contains /)
          const isBatchSplit = session.subject.includes('/');
          const subjects = isBatchSplit ? session.subject.split('/') : [session.subject];

          subjects.forEach(sub => {
            const cleanSub = sub.trim();
            const course = tt.courses.find(c => c.mne === cleanSub) || { labResource: '' }; // Fallback if ad-hoc

            // Priority 1: Assigned Lab Resource
            let targetRoom = course.labResource;
            // Priority 2: Default Classroom
            if (!targetRoom) targetRoom = tt.classroom;

            // If Batch Split, we need distinct logic?
            // For now, if user typed "LabA" it allocates to LabA's resource.
            // If user typed "LabA/LabB", we iterate:
            // 1. Allocate LabA to its resource.
            // 2. Allocate LabB to its resource.

            // ATOMIC CHECK: Room must be free for ALL periods in session
            let isRoomFree = true;
            if (targetRoom) {
              session.periods.forEach(p => {
                if (occupied[`${session.day}-${p.t}-${targetRoom}`]) isRoomFree = false;
              });

              if (isRoomFree) {
                // Allocate Block
                session.periods.forEach(p => {
                  const allocId = `tt-${tt.id}-${session.day}-${p.t}-${cleanSub}`;
                  addToOccupied(session.day, p.t, targetRoom, { type: 'class', subject: cleanSub }, allocId);
                  newAllocations.push({
                    id: allocId,
                    type: isBatchSplit ? 'Batch Split' : 'Class',
                    day: session.day,
                    time: p.t,
                    classroom: targetRoom,
                    subject: `${cleanSub} (${tt.yearLevel}-${tt.section})`,
                    faculty: course.faculty
                  });
                });
              } else {
                // Conflict
                const firstP = session.periods[0];
                const conflictingAlloc = occupied[`${session.day}-${firstP.t}-${targetRoom}`]; // Just grab first conflict
                newConflicts.push({
                  id: `conflict-${tt.id}-${session.day}-${cleanSub}`,
                  msg: `Block Conflict: ${cleanSub} (Cont: ${session.periods.length} hrs)`,
                  day: session.day,
                  time: `${firstP.t}..`,
                  classroom: targetRoom,
                  collidingAllocationId: conflictingAlloc?.allocId,
                  type: 'Student Class',
                  subject: cleanSub,
                  sugg: `Room ${targetRoom} occupied during block.`
                });
              }
            } else {
              // No room assigned (virtual subject?)
            }
          });
        });
      });

    } catch (err) {
      console.error("Allocation Error:", err);
    }

    console.log("Allocations Generated:", newAllocations.length);
    setAllocations(newAllocations);
    setConflicts(newConflicts);
    save('allocations', newAllocations);
    setActiveTab('results');
  };


  const filteredAllocations = allocations.filter(a => {
    if (resultsFilter.day !== 'All' && a.day !== resultsFilter.day) return false;
    if (resultsFilter.time !== 'All' && a.time !== resultsFilter.time) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <div className="max-w-[1600px] mx-auto p-4 print:p-0 print:max-w-none">

        {/* Header */}
        <header className="bg-blue-900 text-white rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shrink-0">
              <img src="/college_logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Classroom Allocation System</h1>
              <p className="text-blue-200 text-sm">Easwari Engineering College • Information Technology</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold opacity-80">
              {classrooms.length} Resources ({classrooms.filter(r => r.type === 'Lab').length} Labs) | {new Date().toLocaleDateString()}
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-6 flex overflow-hidden border border-slate-200 print:hidden overflow-x-auto">
          {[
            { id: 'resources', label: 'Resource Manager', icon: <Settings className="w-5 h-5" /> },
            { id: 'generator', label: 'Timetable Generator', icon: <Calendar className="w-5 h-5" /> },
            { id: 'faculty', label: 'Faculty Booking', icon: <Users className="w-5 h-5" /> },
            { id: 'allocate', label: 'Allocations', icon: <CheckCircle className="w-5 h-5" /> },
            { id: 'results', label: 'View Results', icon: <LayoutGrid className="w-5 h-5" /> },
            { id: 'unallocated', label: 'Free Resources', icon: <BookOpen className="w-5 h-5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-4 font-semibold transition-all
                        ${activeTab === tab.id ? 'bg-blue-50 text-blue-900 border-b-2 border-blue-900' : 'text-slate-500 hover:bg-slate-50'}
                    `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 min-h-[600px] print:shadow-none print:border-none print:h-auto">

          {/* Phase 4: Resource Manager Tab */}
          {activeTab === 'resources' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-900">Resource Management</h2>
                <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-800 text-sm font-semibold">
                  Total Resources: {classrooms.length}
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Add New Resource</h3>
                <div className="flex gap-4">
                  <input
                    className="flex-1 p-2 border rounded-md"
                    placeholder="Resource Name (e.g. 1205, IoT Lab)"
                    value={newResource.name}
                    onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                  />
                  <select
                    className="p-2 border rounded-md w-40"
                    value={newResource.type}
                    onChange={e => setNewResource({ ...newResource, type: e.target.value })}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Lab">Lab</option>
                  </select>
                  <button
                    onClick={addResource}
                    className="bg-green-600 text-white px-6 rounded-md font-bold hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map(c => (
                  <div key={c.name} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-12 rounded-full ${c.type === 'Lab' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                      <div>
                        <h4 className="font-bold text-lg">{c.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.type === 'Lab' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {c.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeResource(c.name)}
                      className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Input Form */}
                <div className="lg:col-span-1 space-y-6 print:hidden">
                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-lg text-blue-900 border-b pb-2">Class Details (Mandatory)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Year</label>
                        <select className="w-full p-2 border rounded-md" value={currentTT.yearLevel} onChange={e => setCurrentTT({ ...currentTT, yearLevel: e.target.value })}>
                          <option value="1">I Year</option>
                          <option value="2">II Year</option>
                          <option value="3">III Year</option>
                          <option value="4">IV Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Section</label>
                        <select className="w-full p-2 border rounded-md" value={currentTT.section} onChange={e => setCurrentTT({ ...currentTT, section: e.target.value })}>
                          <option>A</option><option>B</option><option>C</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                        <select className="w-full p-2 border rounded-md" value={currentTT.semester} onChange={e => setCurrentTT({ ...currentTT, semester: e.target.value })}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Default Room</label>
                        <select className="w-full p-2 border rounded-md" value={currentTT.classroom} onChange={e => setCurrentTT({ ...currentTT, classroom: e.target.value })}>
                          {classrooms.filter(c => c.type === 'Classroom').map(c => <option key={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <input className="w-full p-2 border rounded-md text-sm" placeholder="Academic Year (e.g., 2024-2025)" value={currentTT.academicYear} onChange={e => setCurrentTT({ ...currentTT, academicYear: e.target.value })} />
                    <input className="w-full p-2 border rounded-md text-sm" placeholder="Period (e.g., June-Dec)" value={currentTT.period} onChange={e => setCurrentTT({ ...currentTT, period: e.target.value })} />
                    <input className="w-full p-2 border rounded-md text-sm" placeholder="Chairperson Name" value={currentTT.chairperson} onChange={e => setCurrentTT({ ...currentTT, chairperson: e.target.value })} />
                    <input className="w-full p-2 border rounded-md text-sm" placeholder="Coordinator Name" value={currentTT.coordinator} onChange={e => setCurrentTT({ ...currentTT, coordinator: e.target.value })} />
                    <input className="w-full p-2 border rounded-md text-sm" placeholder="Regulation (e.g., R2023)" value={currentTT.regulation} onChange={e => setCurrentTT({ ...currentTT, regulation: e.target.value })} />
                  </div>

                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-bold text-lg text-blue-900">Courses & Lab Resource</h3>
                      <button onClick={addCourse} className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {currentTT.courses.length === 0 && <div className="text-gray-400 text-xs italic text-center py-4">Add courses to start scheduling</div>}
                      {currentTT.courses.map(c => (
                        <div key={c.id} className="bg-white p-2 rounded shadow-sm border space-y-2">
                          <div className="grid grid-cols-12 gap-1">
                            <input className="col-span-3 text-xs p-1 border rounded" placeholder="Name" value={c.name} onChange={e => updateCourse(c.id, 'name', e.target.value)} />
                            <input className="col-span-3 text-xs p-1 border rounded" placeholder="Code" value={c.code} onChange={e => updateCourse(c.id, 'code', e.target.value)} />
                            <input className="col-span-2 text-xs p-1 border rounded" placeholder="MNE" value={c.mne} onChange={e => updateCourse(c.id, 'mne', e.target.value)} />
                            <input className="col-span-3 text-xs p-1 border rounded" placeholder="Faculty" value={c.faculty} onChange={e => updateCourse(c.id, 'faculty', e.target.value)} />
                            <button onClick={() => setCurrentTT({ ...currentTT, courses: currentTT.courses.filter(x => x.id !== c.id) })} className="col-span-1 text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4 mx-auto" /></button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500">Lab Res:</span>
                            <select className="flex-1 text-xs p-1 border rounded" value={c.labResource} onChange={e => updateCourse(c.id, 'labResource', e.target.value)}>
                              <option value="">-- None --</option>
                              {classrooms.filter(r => r.type === 'Lab').map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                            </select>
                            <span className="text-xs font-bold text-gray-500">Prds:</span>
                            <input type="number" className="w-12 text-xs p-1 border rounded" value={c.curr} onChange={e => updateCourse(c.id, 'curr', e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-bold text-lg text-blue-900 border-b pb-2">Schedule (Auto-fill)</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                      {days.map(d => (
                        <div key={d} className="flex gap-2 items-center">
                          <div className="w-16 font-bold text-xs">{d}</div>
                          <div className="flex-1 overflow-x-auto">
                            <div className="flex gap-1 min-w-max">
                              {timeSlots.map(s => (
                                <div key={s.p} className="flex flex-col items-center">
                                  <span className="text-[9px] text-gray-500">{s.p}</span>
                                  <input
                                    list={`courses-${d}-${s.p}`}
                                    className="w-16 text-center text-xs p-1 border rounded focus:border-blue-500"
                                    value={currentTT.schedule[d]?.[s.p] || ''}
                                    onChange={e => updateSchedule(d, s.p, e.target.value)}
                                  />
                                  <datalist id={`courses-${d}-${s.p}`}>
                                    {currentTT.courses.map(c => <option key={c.id} value={c.mne} />)}
                                  </datalist>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={calcPeriods} className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 flex justify-center items-center gap-2">
                      <LayoutGrid className="w-4 h-4" /> Calc
                    </button>
                    <button onClick={saveTimetable} className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 flex justify-center items-center gap-2">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>

                  <button onClick={() => window.print()} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 flex justify-center items-center gap-2 mt-4 shadow-lg">
                    <Printer className="w-5 h-5" /> Print / Save as PDF
                  </button>
                </div>

                {/* Right: Preview */}
                <div className="lg:col-span-2 bg-gray-100 p-8 rounded-xl overflow-auto print:p-0 print:bg-white print:overflow-visible">
                  <div className="print:hidden mb-4 flex justify-between items-center">
                    <h3 className="font-bold text-gray-500">Live Preview</h3>
                    <div className="text-xs text-gray-500">
                      Ensure "Background Graphics" is ON in Print Settings
                    </div>
                  </div>
                  <TimetablePreview
                    data={currentTT}
                    timeSlots={timeSlots} // Passed separate timeSlots (without Spl)
                    days={days}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faculty' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-blue-900">Faculty Resource Booking</h2>
                  <button
                    onClick={() => setShowBooking(!showBooking)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 transition w-full justify-center"
                  >
                    <Plus className="w-5 h-5" /> New Booking Request
                  </button>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-yellow-900 mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Current Alloc Mode</h3>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded border border-yellow-200 flex-1 hover:bg-yellow-100">
                      <input type="radio" checked={priorityMode === 'student'} onChange={() => setPriorityMode('student')} className="accent-blue-600 w-5 h-5" />
                      <span className="font-semibold text-sm">Student First</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded border border-yellow-200 flex-1 hover:bg-yellow-100">
                      <input type="radio" checked={priorityMode === 'faculty'} onChange={() => setPriorityMode('faculty')} className="accent-red-600 w-5 h-5" />
                      <span className="font-semibold text-sm">Faculty First</span>
                    </label>
                  </div>
                </div>
              </div>

              {showBooking && (
                <div className="bg-white p-6 rounded-xl border-2 border-blue-100 shadow-xl mb-8">
                  <h3 className="font-bold text-lg mb-4">Mandatory Booking Details</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input placeholder="*Faculty Name" className="p-2 border rounded" value={currentBooking.faculty} onChange={e => setCurrentBooking({ ...currentBooking, faculty: e.target.value })} />
                    <div>
                      <label className="text-xs font-bold text-gray-500">Date</label>
                      <input type="date" className="w-full p-2 border rounded" value={currentBooking.date} onChange={e => setCurrentBooking({ ...currentBooking, date: e.target.value })} />
                    </div>
                    <select className="p-2 border rounded" value={currentBooking.day} onChange={e => setCurrentBooking({ ...currentBooking, day: e.target.value })}>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select className="p-2 border rounded" value={currentBooking.time} onChange={e => setCurrentBooking({ ...currentBooking, time: e.target.value })}>
                      {bookingTimeSlots.map(s => <option key={s.t} value={s.t}>{s.t} ({s.p === 'Spl' ? 'Special' : 'Pd ' + s.p})</option>)}
                    </select>
                    <select className="p-2 border rounded" value={currentBooking.classroom} onChange={e => setCurrentBooking({ ...currentBooking, classroom: e.target.value })}>
                      <option value="">-- Select Room --</option>
                      {classrooms.map(c => <option key={c.name} value={c.name}>{c.name} ({c.type})</option>)}
                    </select>
                    <select className="p-2 border rounded" value={currentBooking.yearLevel} onChange={e => setCurrentBooking({ ...currentBooking, yearLevel: e.target.value })}>
                      <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option>
                    </select>
                    <select className="p-2 border rounded" value={currentBooking.priority} onChange={e => setCurrentBooking({ ...currentBooking, priority: e.target.value })}>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  <textarea placeholder="*Reason for booking..." className="w-full p-2 border rounded mb-4" rows="2" value={currentBooking.reason} onChange={e => setCurrentBooking({ ...currentBooking, reason: e.target.value })}></textarea>
                  <div className="flex gap-4">
                    <button onClick={addBooking} className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Confirm Booking</button>
                    <button onClick={() => setShowBooking(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {facultyBookings.map(booking => (
                  <div key={booking.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center group hover:border-blue-300 transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${booking.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{booking.priority}</span>
                        <h4 className="font-bold">{booking.faculty}</h4>
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">Year {booking.yearLevel}</span>
                      </div>
                      <p className="text-sm mt-1">Room {booking.classroom} @ {booking.time} <span className="text-gray-400">({booking.date})</span></p>
                      <p className="text-xs text-gray-500 italic">"{booking.reason}"</p>
                    </div>
                    <button onClick={() => {
                      const next = facultyBookings.filter(b => b.id !== booking.id);
                      setFacultyBookings(next);
                      save('bookings', next);
                    }} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
                {facultyBookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings yet</p>}
              </div>
            </div>
          )}

          {activeTab === 'allocate' && (
            <div className="p-12 text-center">
              <div className="max-w-xl mx-auto space-y-8">
                {/* Phase 5: External Timetables & Upload Section */}
                <div className="bg-white rounded-xl shadow-lg border p-6 text-left">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Upload className="w-5 h-5" /> Manual Timetables / Files</h3>
                  <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg mb-4">
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">1. Select Target Room (for Image/PDF)</label>
                        <select
                          className="w-full p-2 border rounded font-sm"
                          value={uploadRoom}
                          onChange={e => setUploadRoom(e.target.value)}
                        >
                          <option value="">-- Select Room (Required for Non-CSV) --</option>
                          {classrooms.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">2. Upload File (CSV, PNG, PDF)</label>
                        <input type="file" className="w-full text-sm" accept=".csv, .png, .jpg, .jpeg, .pdf" onChange={handleFileUpload} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      * CSV files are parsed for schedule (Day, 1, 2... format). Images/PDFs block the selected room entirely.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {externalTimetables.map(file => (
                      <div key={file.id} className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-100">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {file.type === 'csv' ? <FileText className="w-8 h-8 text-green-600" /> : <ImageIcon className="w-8 h-8 text-purple-600" />}
                          <div className="min-w-0">
                            <div className="font-bold text-sm truncate">{file.name}</div>
                            <div className="text-xs text-gray-500">Target: {file.targetRoom} | {file.type.toUpperCase()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.type === 'image' && (
                            <img src={file.data} className="w-10 h-10 object-cover border rounded bg-white" alt="preview" />
                          )}
                          <button onClick={() => removeExternal(file.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {externalTimetables.length === 0 && <div className="text-center text-gray-400 italic text-sm">No manual files uploaded.</div>}
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h2 className="text-2xl font-bold mb-4">Run Allocation Algorithm</h2>
                  <ul className="text-left text-gray-600 mb-8 space-y-2 bg-white p-4 rounded-lg shadow-sm">
                    <li>• Processing {timetables.length} internal timetables</li>
                    <li>• Processing {facultyBookings.length} faculty bookings</li>
                    <li>• Processing {externalTimetables.length} manual files (Priority: High)</li>
                    <li>• Logic: <strong>{priorityMode === 'student' ? 'Student First' : 'Faculty First'}</strong></li>
                  </ul>
                  <button
                    onClick={runAllocation}
                    className="w-full bg-blue-900 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-blue-800 hover:scale-105 transition flex items-center justify-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6" /> Start Allocation
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="p-6">
              {/* Phase 4: Enhanced Results Header & Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-blue-600">
                  <div className="text-gray-500 text-xs uppercase font-bold">Total Allocated</div>
                  <div className="text-2xl font-bold text-blue-900">{allocations.length}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-l-4 border-l-red-600">
                  <div className="text-gray-500 text-xs uppercase font-bold">Conflicts</div>
                  <div className="text-2xl font-bold text-red-900">{conflicts.length}</div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border col-span-2 flex items-center gap-4">
                  <div className="text-gray-400"><Filter className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">Filter Day</label>
                    <select
                      className="w-full text-sm p-1 border rounded"
                      value={resultsFilter.day}
                      onChange={e => setResultsFilter({ ...resultsFilter, day: e.target.value })}
                    >
                      <option value="All">All Days</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">Filter Time</label>
                    <select
                      className="w-full text-sm p-1 border rounded"
                      value={resultsFilter.time}
                      onChange={e => setResultsFilter({ ...resultsFilter, time: e.target.value })}
                    >
                      <option value="All">All Periods</option>
                      {bookingTimeSlots.map(s => <option key={s.t} value={s.t}>{s.t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Allocated Resources</h3>
                  <div className="bg-white border rounded-lg h-[600px] overflow-y-auto p-4 space-y-2 shadow-inner bg-gray-50">
                    {filteredAllocations.map(alloc => (
                      <div key={alloc.id} className={`p-3 border-l-4 border rounded shadow-sm ${alloc.type.startsWith('External') ? 'bg-purple-50 border-l-purple-500' : 'bg-white border-l-green-500'}`}>
                        <div className="flex justify-between">
                          <span className="font-bold text-gray-800">{alloc.classroom}</span>
                          <span className={`text-xs px-2 rounded-full ${alloc.type.startsWith('External') ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>{alloc.type}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{alloc.day} {alloc.time}</div>
                        <div className="text-sm font-semibold mt-1">{alloc.subject}</div>
                        {alloc.faculty && <div className="text-xs text-gray-400">By: {alloc.faculty}</div>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Conflicts (Action Required)</h3>
                  <div className="bg-white border rounded-lg h-[600px] overflow-y-auto p-4 space-y-2 shadow-inner bg-red-50">
                    {conflicts.map(conf => (
                      <div key={conf.id} className="p-4 bg-white border-l-4 border-l-red-500 border rounded shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setShowConflictResolver(conf.id)}>
                        <div className="font-bold text-red-800 mb-1">{conf.msg}</div>
                        <div className="text-sm text-gray-600 mb-2">
                          {conf.day} {conf.time} @ {conf.classroom}
                        </div>
                        <div className="text-xs bg-red-100 text-red-800 p-2 rounded">
                          💡 Suggestion: {conf.sugg}
                        </div>
                        <div className="mt-2 text-center text-xs text-blue-600 font-bold">Click to Resolve</div>
                      </div>
                    ))}
                    {conflicts.length === 0 && <div className="text-center text-gray-400 py-12">No conflicts detected! 🎉</div>}
                  </div>
                </div>
              </div>

              {/* Conflict Resolver Modal */}
              {showConflictResolver && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                    <h3 className="text-xl font-bold mb-4">Resolve Conflict</h3>
                    <p className="text-gray-600 mb-6">
                      How would you like to handle this conflict?
                    </p>
                    <div className="space-y-3">
                      <button onClick={() => resolveConflict(showConflictResolver, 'override')} className="w-full bg-red-600 text-white p-3 rounded font-bold hover:bg-red-700">
                        Force Override (Remove existing)
                      </button>
                      <button onClick={() => resolveConflict(showConflictResolver, 'reschedule')} className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
                        Ignore (I will reschedule manually)
                      </button>
                      <button onClick={() => setShowConflictResolver(null)} className="w-full border p-3 rounded font-bold hover:bg-gray-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'unallocated' && (
            <UnallocatedView
              allocations={allocations}
              timeSlots={bookingTimeSlots}
              days={days}
              classrooms={classrooms.map(c => c.name)}
              filters={resultsFilter}
              setFilters={setResultsFilter}
            />
          )}

        </div>
      </div>
    </div>
  );
};

export default SmartClassroomSystem;