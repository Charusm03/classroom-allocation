import React from 'react';

const TimetablePreview = ({ data, timeSlots, days }) => {
    const {
        regulation, chairperson, coordinator, classroom, effectiveDate,
        period, semester, section, yearLevel, department, courses, schedule,
        academicYear, labRoomAssignments
    } = data;

    const getTotalPeriods = () => {
        return courses.reduce((acc, curr) => acc + (curr.allot || 0), 0);
    };

    return (
        <div className="bg-white p-8 max-w-[210mm] mx-auto shadow-lg print:shadow-none print:w-[210mm] print:h-[297mm] print:p-4 print:mx-0 print:overflow-hidden print:text-[10px] transform-gpu">
            {/* CSS to force single page in print */}
            <style dangerouslySetInnerHTML={{
                __html: `
            @media print {
                @page { size: A4 portrait; margin: 5mm; }
                body { -webkit-print-color-adjust: exact; }
                .print-scale-down { transform: scale(0.95); transform-origin: top center; }
            }
        `}} />

            <div className="print-scale-down h-full flex flex-col">
                {/* Header */}
                <div className="text-center mb-2 border-b-2 border-blue-900 pb-2">
                    <div className="flex justify-center items-center gap-4 mb-2">
                        <img src="/college_logo.png" alt="College Logo" className="h-24 object-contain" />
                    </div>
                    <h1 className="text-lg font-bold text-blue-900 uppercase">Easwari Engineering College, Chennai-89</h1>
                    <p className="text-xs font-bold">(Autonomous)</p>
                    <h2 className="text-md font-bold mt-1 uppercase">Department of {department || 'INFORMATION TECHNOLOGY'}</h2>
                    <h3 className="text-sm font-bold text-blue-800 mt-1 uppercase">Class Timetable - {academicYear || '2024-2025'} ({period || 'June-Dec'})</h3>
                    <div className="flex justify-center gap-4 text-sm font-bold mt-1">
                        <span>Year: {yearLevel}</span>
                        <span>Semester: {semester}</span>
                        <span>Section: {section}</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-2">
                    <div className="flex items-end">
                        <span className="font-bold w-40 text-blue-900">Class Committee Chairperson:</span>
                        <span className="border-b border-black flex-1 px-1">{chairperson}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold w-24 text-blue-900">Class Room:</span>
                        <span className="border-b border-black flex-1 px-1">{classroom}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold w-40 text-blue-900">Class Coordinator:</span>
                        <span className="border-b border-black flex-1 px-1">{coordinator}</span>
                    </div>
                    <div className="flex items-end">
                        <span className="font-bold w-24 text-blue-900">w.e.f:</span>
                        <span className="border-b border-black flex-1 px-1">{effectiveDate}</span>
                    </div>
                    <div className="flex items-end col-span-2">
                        <span className="font-bold w-20 text-blue-900">Regulation:</span>
                        <span className="border-b border-black flex-1 px-1">{regulation}</span>
                    </div>
                </div>

                {/* Main Timetable */}
                <div className="flex-1">
                    <table className="w-full border-collapse border border-black mb-4 text-center text-[10px]">
                        <thead>
                            <tr className="bg-blue-900 text-white print:bg-gray-200 print:text-black">
                                <th className="border border-black p-1 w-12">DAY</th>
                                {timeSlots.map((slot, index) => (
                                    <React.Fragment key={slot.p}>
                                        {/* Break Logic: 9:55-10:10. Assuming slots[1] ends at 9:55 and slots[2] starts at 10:10 */}
                                        {/* Break - Morning Slot */}
                                        {slot.t === '10:10-11:00' && <th className="border border-black bg-yellow-100 text-black w-6 writing-vertical p-0" rowSpan={days.length + 1}><div className="p-1">BREAK</div></th>}

                                        <th className="border border-black p-1">
                                            <div className="font-bold">{slot.p}</div>
                                            <div className="text-[8px] whitespace-nowrap">{slot.t}</div>
                                        </th>

                                        {/* Lunch Logic: 12:40-1:30. Assuming slots[4] ends at 12:40 and slots[5] starts at 1:30 */}
                                        {/* Lunch - Afternoon Slot */}
                                        {slot.t === '1:30-2:15' && <th className="border border-black bg-orange-100 text-black w-6 writing-vertical p-0" rowSpan={days.length + 1}><div className="p-1">LUNCH</div></th>}
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {days.map(day => {
                                // Identify continuous sessions for this day
                                const sessions = [];
                                const skippedPeriods = new Set();

                                // Periods that come after breaks (shouldn't merge across these)
                                const periodsAfterBreak = [3, 6]; // Period 3 is after morning break (10:10-11:00), Period 6 is after lunch (1:30-2:15)

                                timeSlots.forEach((slot, slotIdx) => {
                                    if (skippedPeriods.has(slot.p)) return;

                                    const subject = schedule[day]?.[slot.p];
                                    if (!subject) return;

                                    // Look ahead to find continuous periods with same subject (but stop at breaks)
                                    let spanCount = 1;
                                    for (let i = slotIdx + 1; i < timeSlots.length; i++) {
                                        const nextSlot = timeSlots[i];
                                        const nextSubject = schedule[day]?.[nextSlot.p];

                                        // Stop if we hit a break boundary
                                        if (periodsAfterBreak.includes(nextSlot.p)) {
                                            break;
                                        }

                                        if (nextSubject === subject) {
                                            spanCount++;
                                            skippedPeriods.add(nextSlot.p);
                                        } else {
                                            break;
                                        }
                                    }

                                    sessions.push({
                                        period: slot.p,
                                        subject,
                                        span: spanCount,
                                        isLab: subject.includes('(L)')
                                    });
                                });

                                return (
                                    <tr key={day}>
                                        <td className="border border-black font-bold bg-blue-50">{day}</td>
                                        {timeSlots.map((slot, index) => {
                                            // Check if this period should be skipped (part of a merged cell)
                                            if (skippedPeriods.has(slot.p)) {
                                                return (
                                                    <React.Fragment key={slot.p}>
                                                        {slot.t === '10:10-11:00' && <td className="p-0 border-none"></td>}
                                                        {slot.t === '1:30-2:15' && <td className="p-0 border-none"></td>}
                                                    </React.Fragment>
                                                );
                                            }

                                            const session = sessions.find(s => s.period === slot.p);
                                            const subject = schedule[day]?.[slot.p] || '';

                                            // Find lab resource - prioritize session-specific assignment
                                            const sessionKey = `${day}-${slot.p}`;
                                            const labResource = labRoomAssignments?.[sessionKey] || courses.find(c => c.mne === subject)?.labResource;

                                            return (
                                                <React.Fragment key={slot.p}>
                                                    {slot.t === '10:10-11:00' && <td className="p-0 border-none"></td>}

                                                    <td
                                                        className={`border border-black h-8 relative p-0.5 ${session?.isLab ? 'bg-purple-50' : ''}`}
                                                        colSpan={session?.span || 1}
                                                    >
                                                        <div className="font-bold text-blue-900 leading-tight flex flex-col items-center justify-center">
                                                            <div className="flex items-center gap-1">
                                                                {subject}
                                                                {session?.isLab && session?.span > 1 && (
                                                                    <span className="text-[8px] text-purple-600 font-normal">({session.span}p)</span>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </td>

                                                    {slot.t === '1:30-2:15' && <td className="p-0 border-none"></td>}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                            {days.map(day => (
                                <tr key={day}>
                                    <td className="border border-black font-bold bg-blue-50">{day}</td>
                                    {timeSlots.map((slot, index) => (
                                        <React.Fragment key={slot.p}>
                                            {slot.t === '10:10-11:00' && <td className="p-0 border-none"></td>} {/* Phantom cell for Break column rowspan */}

                                            <td className="border border-black h-8 relative p-0.5">
                                                <div className="font-bold text-blue-900 leading-tight">{schedule[day]?.[slot.p] || ''}</div>
                                            </td>

                                            {slot.t === '1:30-2:15' && <td className="p-0 border-none"></td>} {/* Phantom cell for Lunch column rowspan */}
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Course Details */}
                    <table className="w-full border-collapse border border-black text-[10px] mb-4">
                        <thead>
                            <tr className="bg-blue-900 text-white print:bg-gray-200 print:text-black">
                                <th className="border border-black p-1 w-20">COURSE CODE</th>
                                <th className="border border-black p-1 text-left">COURSE NAME</th>
                                <th className="border border-black p-1 w-12">MNE</th>
                                <th className="border border-black p-1 text-left">NAME OF THE FACULTY</th>
                                <th className="border border-black p-1 w-12">DEPT</th>
                                <th className="border border-black p-1 w-24">LAB RESOURCE</th>
                                <th className="border border-black p-1 w-12">Periods</th>
                                <th className="border border-black p-1 w-12">Allotted</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td className="border border-black p-1 text-center font-mono">{course.code}</td>
                                    <td className="border border-black p-1">{course.name}</td>
                                    <td className="border border-black p-1 text-center font-bold">{course.mne}</td>
                                    <td className="border border-black p-1">{course.faculty}</td>
                                    <td className="border border-black p-1 text-center">{course.dept}</td>
                                    <td className="border border-black p-1 text-center italic">
                                        {(() => {
                                            // Find all assigned labs for this course
                                            const assignedLabs = new Set();
                                            if (labRoomAssignments) {
                                                Object.entries(labRoomAssignments).forEach(([key, labName]) => {
                                                    const [d, p] = key.split('-');
                                                    // Check if this slot has this course
                                                    if (schedule[d]?.[p] === course.mne) {
                                                        assignedLabs.add(labName);
                                                    }
                                                });
                                            }

                                            const labsList = Array.from(assignedLabs);
                                            return labsList.length > 0 ? labsList.join(', ') : (course.labResource || '-');
                                        })()}
                                    </td>
                                    <td className="border border-black p-1 text-center italic">{course.labResource || '-'}</td>
                                    <td className="border border-black p-1 text-center">{course.curr}</td>
                                    <td className="border border-black p-1 text-center font-bold">{course.allot}</td>
                                </tr>
                            ))}
                            <tr className="font-bold bg-gray-100">
                                <td colSpan={7} className="border border-black p-1 text-right pr-4">Total Periods</td>
                                <td className="border border-black p-1 text-center">{getTotalPeriods()}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Signatures */}
                    <div className="flex justify-between items-end mt-8 px-8 mb-4">
                        <div className="text-center">
                            <div className="border-t border-black w-24"></div>
                            <p className="text-[10px] font-bold mt-1">Timetable Coordinator</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-black w-24"></div>
                            <p className="text-[10px] font-bold mt-1">Vice-Principal (Academic)</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-black w-24"></div>
                            <p className="text-[10px] font-bold mt-1">HOD/{department === 'INFORMATION TECHNOLOGY' ? 'IT' : 'DEPT'}</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-black w-24"></div>
                            <p className="text-[10px] font-bold mt-1">Principal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetablePreview;
