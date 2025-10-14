import React, { useState } from 'react';
import { Calendar, Upload, Download, AlertCircle, CheckCircle, Building2, Users, TrendingUp, FileUp } from 'lucide-react';

const SmartClassroomAllocation = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [scheduleData, setScheduleData] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState('');

  const classrooms = [
    { id: 'CS-LAB-1', capacity: 60, type: 'CS_LAB', building: 'IT Block' },
    { id: 'CS-LAB-2', capacity: 60, type: 'CS_LAB', building: 'IT Block' },
    { id: 'EC-LAB-1', capacity: 50, type: 'EC_LAB', building: 'EC Block' },
    { id: 'MECH-LAB-1', capacity: 40, type: 'MECH_LAB', building: 'Mech Block' },
    { id: 'ROOM-101', capacity: 80, type: 'THEORY', building: 'Main Block' },
    { id: 'ROOM-102', capacity: 80, type: 'THEORY', building: 'Main Block' },
    { id: 'ROOM-201', capacity: 100, type: 'THEORY', building: 'Main Block' },
    { id: 'ROOM-202', capacity: 100, type: 'THEORY', building: 'Main Block' },
    { id: 'AUDITORIUM', capacity: 300, type: 'EVENT', building: 'Main Block' }
  ];

  const labRequirements = {
    'Data Structures': 'CS_LAB',
    'Database Management': 'CS_LAB',
    'Computer Networks': 'CS_LAB',
    'Web Development': 'CS_LAB',
    'Operating Systems': 'CS_LAB',
    'Compiler Design': 'CS_LAB',
    'Artificial Intelligence': 'CS_LAB',
    'Machine Learning': 'CS_LAB',
    'Data Mining': 'CS_LAB',
    'Cloud Computing': 'CS_LAB',
    'Digital Electronics': 'EC_LAB',
    'Microprocessor': 'EC_LAB',
    'Embedded Systems': 'EC_LAB',
    'Digital Signal Processing': 'EC_LAB',
    'VLSI Design': 'EC_LAB',
    'Circuit Theory': 'EC_LAB',
    'Workshop Practice': 'MECH_LAB',
    'Robotics': 'MECH_LAB',
    'Engineering Graphics': 'THEORY',
    'Mathematics': 'THEORY',
    'Physics': 'THEORY',
    'Thermodynamics': 'THEORY',
    'Fluid Mechanics': 'THEORY',
    'Structural Analysis': 'THEORY',
    'Discrete Mathematics': 'THEORY',
    'Computer Architecture': 'THEORY',
    'Software Engineering': 'THEORY',
    'Engineering Mechanics': 'THEORY',
    'Surveying': 'THEORY',
    'Heat Transfer': 'THEORY',
    'Calculus': 'THEORY'
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  const parseScheduleInput = (text) => {
    const lines = text.trim().split('\n');
    const parsed = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line || line.startsWith('#')) continue;
      
      if (i === 0 && line.toLowerCase().includes('subject')) continue;
      
      const parts = line.split(',').map(p => p.trim());
      
      if (parts.length >= 8) {
        parsed.push({
          id: Date.now() + Math.random() + i,
          subject: parts[0],
          department: parts[1],
          year: parts[2],
          section: parts[3],
          students: parseInt(parts[4]),
          day: parts[5],
          time: parts[6],
          duration: parseInt(parts[7]),
          requiredLabType: labRequirements[parts[0]] || 'THEORY'
        });
      }
    }
    
    return parsed;
  };

  const handleScheduleSubmit = () => {
    if (!inputText.trim()) {
      alert('Please upload a CSV file or paste schedule data');
      return;
    }
    const parsed = parseScheduleInput(inputText);
    if (parsed.length === 0) {
      alert('No valid schedule data found. Please check the format.');
      return;
    }
    setScheduleData(parsed);
    setActiveTab('allocate');
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
    return allocs.some(alloc => 
      alloc.room === room &&
      alloc.day === day &&
      alloc.id !== currentId &&
      timeOverlap(alloc.time, alloc.duration, time, duration)
    );
  };

  const allocateRooms = () => {
    const newAllocations = [];
    const newConflicts = [];
    
    const sortedSchedule = [...scheduleData].sort((a, b) => b.students - a.students);
    
    for (let event of sortedSchedule) {
      let allocated = false;
      
      const suitableRooms = classrooms.filter(room => 
        (room.type === event.requiredLabType || 
         (event.requiredLabType === 'THEORY' && room.type === 'THEORY') ||
         (room.type === 'EVENT' && event.students > 100)) &&
        room.capacity >= event.students
      );
      
      for (let room of suitableRooms) {
        if (!checkConflict(room.id, event.day, event.time, event.duration, event.id, newAllocations)) {
          newAllocations.push({
            ...event,
            room: room.id,
            building: room.building,
            roomCapacity: room.capacity,
            utilization: ((event.students / room.capacity) * 100).toFixed(1)
          });
          allocated = true;
          break;
        }
      }
      
      if (!allocated) {
        newConflicts.push({
          ...event,
          reason: 'No suitable room available or time conflict'
        });
      }
    }
    
    setAllocations(newAllocations);
    setConflicts(newConflicts);
    calculateAnalytics(newAllocations, newConflicts);
    setActiveTab('results');
  };

  const calculateAnalytics = (allocs, confs) => {
    const totalRooms = classrooms.length;
    const usedRooms = new Set(allocs.map(a => a.room)).size;
    const avgUtilization = allocs.length > 0 
      ? allocs.reduce((sum, a) => sum + parseFloat(a.utilization), 0) / allocs.length 
      : 0;
    
    const byDay = {};
    allocs.forEach(a => {
      byDay[a.day] = (byDay[a.day] || 0) + 1;
    });
    
    const byBuilding = {};
    allocs.forEach(a => {
      byBuilding[a.building] = (byBuilding[a.building] || 0) + 1;
    });
    
    setAnalytics({
      totalAllocations: allocs.length,
      roomsUsed: usedRooms,
      totalRooms: totalRooms,
      utilizationRate: avgUtilization.toFixed(1),
      byDay,
      byBuilding,
      conflicts: confs.length
    });
  };

  const downloadReport = () => {
    let report = 'CLASSROOM ALLOCATION REPORT\n';
    report += '='.repeat(80) + '\n\n';
    report += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    report += 'ALLOCATIONS:\n';
    report += '-'.repeat(80) + '\n';
    allocations.forEach(a => {
      report += `${a.subject} | ${a.department}-${a.year}-${a.section} | `;
      report += `Students: ${a.students} | ${a.day} ${a.time} | `;
      report += `Room: ${a.room} (${a.building}) | Utilization: ${a.utilization}%\n`;
    });
    
    if (conflicts.length > 0) {
      report += '\n\nCONFLICTS:\n';
      report += '-'.repeat(80) + '\n';
      conflicts.forEach(c => {
        report += `${c.subject} | ${c.department}-${c.year}-${c.section} | `;
        report += `Students: ${c.students} | ${c.day} ${c.time} | `;
        report += `REASON: ${c.reason}\n`;
      });
    }
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'allocation_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSampleCSV = () => {
    const sampleData = `Subject,Department,Year,Section,Students,Day,Time,Duration
Data Structures,CSE,2,A,55,Monday,09:00,60
Database Management,CSE,3,A,50,Monday,10:00,60
Computer Networks,CSE,3,B,48,Monday,09:00,60
Web Development,IT,3,A,52,Monday,11:00,60
Mathematics,ECE,1,A,75,Monday,09:00,60`;
    
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_schedule.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-200 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-10 h-10" />
            <h1 className="text-4xl font-semibold tracking-tight">
              Smart Classroom Allocation
            </h1>
          </div>
          <p className="text-stone-200 text-lg">Intelligent Multi-Modal Resource Optimization</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 mb-8 backdrop-blur-sm bg-opacity-95">
          <div className="flex border-b border-stone-300">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 py-5 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
                activeTab === 'input'
                  ? 'bg-white text-blue-900 border-blue-900 shadow-sm'
                  : 'text-stone-600 border-transparent hover:bg-stone-50 hover:text-slate-800'
              }`}
            >
              <Upload className="w-5 h-5 inline mr-2" />
              Input Schedule
            </button>
            <button
              onClick={() => setActiveTab('allocate')}
              className={`flex-1 py-5 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
                activeTab === 'allocate'
                  ? 'bg-white text-blue-900 border-blue-900 shadow-sm'
                  : 'text-stone-600 border-transparent hover:bg-stone-50 hover:text-slate-800'
              } ${scheduleData.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={scheduleData.length === 0}
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Allocate Rooms
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-5 px-6 font-medium text-sm transition-all duration-200 border-b-2 ${
                activeTab === 'results'
                  ? 'bg-white text-blue-900 border-blue-900 shadow-sm'
                  : 'text-stone-600 border-transparent hover:bg-stone-50 hover:text-slate-800'
              } ${allocations.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={allocations.length === 0}
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              View Results
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 backdrop-blur-sm bg-opacity-95">
          {activeTab === 'input' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Input Schedule Data</h2>
              
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <label className="bg-blue-900 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2">
                    <FileUp className="w-5 h-5" />
                    Upload CSV File
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={downloadSampleCSV}
                    className="bg-white border border-stone-300 hover:border-stone-400 text-stone-700 font-medium text-sm px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download Sample CSV
                  </button>
                </div>
                {fileName && (
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg">
                    <p className="text-sm">
                      <strong>File loaded:</strong> {fileName}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-3">
                  Or Paste Schedule Data (CSV Format)
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-64 p-4 border-2 border-stone-300 rounded-lg font-mono text-stone-700 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-20 transition-all duration-200 placeholder-stone-400 text-sm"
                  placeholder="Subject,Department,Year,Section,Students,Day,Time,Duration
Data Structures,CSE,2,A,55,Monday,09:00,60
Database Management,CSE,3,A,50,Monday,10:00,60"
                />
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
                <p className="text-sm text-slate-900 mb-2">
                  <strong>CSV Format:</strong> Subject, Department, Year, Section, Students, Day, Time, Duration(mins)
                </p>
                <p className="text-xs text-slate-600">
                  Example: Data Structures, CSE, 2, A, 55, Monday, 09:00, 60
                </p>
              </div>
              
              <button
                onClick={handleScheduleSubmit}
                className="bg-blue-900 hover:bg-slate-900 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Parse & Continue
              </button>
            </div>
          )}

          {activeTab === 'allocate' && (
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Review & Allocate</h2>
              
              <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg mb-6">
                <p>
                  <strong>{scheduleData.length} classes</strong> parsed successfully and ready for allocation
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Classrooms:</h3>
                <div className="grid grid-cols-3 gap-4">
                  {classrooms.map(room => (
                    <div key={room.id} className="border-2 border-stone-200 rounded-lg p-4 bg-stone-50 hover:bg-stone-100 transition-colors">
                      <div className="font-semibold text-slate-900 mb-1">{room.id}</div>
                      <div className="text-sm text-slate-600 mb-1">
                        Capacity: {room.capacity} | Type: {room.type}
                      </div>
                      <div className="text-xs text-slate-500">{room.building}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Parsed Schedule Preview:</h3>
                <div className="max-h-80 overflow-y-auto border border-stone-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-100 sticky top-0 border-b border-stone-200">
                      <tr>
                        <th className="p-3 text-left font-medium text-stone-700">Subject</th>
                        <th className="p-3 text-left font-medium text-stone-700">Dept-Year-Sec</th>
                        <th className="p-3 text-left font-medium text-stone-700">Students</th>
                        <th className="p-3 text-left font-medium text-stone-700">Day</th>
                        <th className="p-3 text-left font-medium text-stone-700">Time</th>
                        <th className="p-3 text-left font-medium text-stone-700">Lab Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map(item => (
                        <tr key={item.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors duration-150">
                          <td className="p-3 text-slate-700">{item.subject}</td>
                          <td className="p-3 text-slate-600">{item.department}-{item.year}-{item.section}</td>
                          <td className="p-3 text-slate-600">{item.students}</td>
                          <td className="p-3 text-slate-600">{item.day}</td>
                          <td className="p-3 text-slate-600">{item.time}</td>
                          <td className="p-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {item.requiredLabType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={allocateRooms}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Run Allocation Algorithm
              </button>
            </div>
          )}

          {activeTab === 'results' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Allocation Results</h2>
                <button
                  onClick={downloadReport}
                  className="bg-blue-900 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>

              {analytics && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 rounded-xl shadow-lg backdrop-blur-sm">
                    <Users className="w-8 h-8 mb-3 opacity-80" />
                    <div className="text-3xl font-semibold mb-1">{analytics.totalAllocations}</div>
                    <div className="text-sm opacity-90">Total Allocations</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white p-6 rounded-xl shadow-lg backdrop-blur-sm">
                    <Building2 className="w-8 h-8 mb-3 opacity-80" />
                    <div className="text-3xl font-semibold mb-1">{analytics.roomsUsed}/{analytics.totalRooms}</div>
                    <div className="text-sm opacity-90">Rooms Utilized</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-500 text-white p-6 rounded-xl shadow-lg backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                    <div className="text-3xl font-semibold mb-1">{analytics.utilizationRate}%</div>
                    <div className="text-sm opacity-90">Avg Utilization</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-600 to-amber-500 text-white p-6 rounded-xl shadow-lg backdrop-blur-sm">
                    <AlertCircle className="w-8 h-8 mb-3 opacity-80" />
                    <div className="text-3xl font-semibold mb-1">{conflicts.length}</div>
                    <div className="text-sm opacity-90">Conflicts</div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Successful Allocations ({allocations.length})
                </h3>
                <div className="max-h-96 overflow-y-auto border border-stone-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-stone-100 sticky top-0 border-b border-stone-200">
                      <tr>
                        <th className="p-3 text-left font-medium text-stone-700">Subject</th>
                        <th className="p-3 text-left font-medium text-stone-700">Class</th>
                        <th className="p-3 text-left font-medium text-stone-700">Students</th>
                        <th className="p-3 text-left font-medium text-stone-700">Schedule</th>
                        <th className="p-3 text-left font-medium text-stone-700">Room</th>
                        <th className="p-3 text-left font-medium text-stone-700">Building</th>
                        <th className="p-3 text-left font-medium text-stone-700">Utilization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations.map((alloc, idx) => (
                        <tr key={idx} className="border-b border-stone-100 hover:bg-stone-50 transition-colors duration-150">
                          <td className="p-3 text-slate-700">{alloc.subject}</td>
                          <td className="p-3 text-slate-600">{alloc.department}-{alloc.year}-{alloc.section}</td>
                          <td className="p-3 text-slate-600">{alloc.students}</td>
                          <td className="p-3 text-slate-600">{alloc.day} {alloc.time}</td>
                          <td className="p-3 font-semibold text-blue-900">{alloc.room}</td>
                          <td className="p-3 text-slate-600">{alloc.building}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-stone-200 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full transition-all"
                                  style={{ width: `${alloc.utilization}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-600 font-medium">{alloc.utilization}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {conflicts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    Conflicts Detected ({conflicts.length})
                  </h3>
                  <div className="border-2 border-amber-200 rounded-lg bg-amber-50 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-amber-100 border-b border-amber-200">
                        <tr>
                          <th className="p-3 text-left font-medium text-amber-900">Subject</th>
                          <th className="p-3 text-left font-medium text-amber-900">Class</th>
                          <th className="p-3 text-left font-medium text-amber-900">Students</th>
                          <th className="p-3 text-left font-medium text-amber-900">Schedule</th>
                          <th className="p-3 text-left font-medium text-amber-900">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conflicts.map((conf, idx) => (
                          <tr key={idx} className="border-t border-amber-200">
                            <td className="p-3 text-amber-900">{conf.subject}</td>
                            <td className="p-3 text-amber-800">{conf.department}-{conf.year}-{conf.section}</td>
                            <td className="p-3 text-amber-800">{conf.students}</td>
                            <td className="p-3 text-amber-800">{conf.day} {conf.time}</td>
                            <td className="p-3 text-amber-900 font-medium">{conf.reason}</td>
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
    </div>
  );
};

export default SmartClassroomAllocation;