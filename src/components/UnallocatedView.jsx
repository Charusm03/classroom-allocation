import React, { useMemo } from 'react';
import { Filter } from 'lucide-react';

const UnallocatedView = ({ allocations, timeSlots, days, classrooms, filters, setFilters }) => {

    const freeResources = useMemo(() => {
        const occupiedSet = new Set(
            allocations.map(a => `${a.day}-${a.time}-${a.classroom}`)
        );

        const result = {};

        classrooms.forEach(room => {
            result[room] = [];

            // Filter by Day if needed
            const targetDays = filters.day === 'All' ? days : [filters.day];

            targetDays.forEach(day => {
                const dayFreeSlots = [];
                timeSlots.forEach(slot => {
                    // Filter by Time if needed
                    if (filters.time !== 'All' && slot.t !== filters.time) return;

                    const key = `${day}-${slot.t}-${room}`;
                    if (!occupiedSet.has(key)) {
                        dayFreeSlots.push(slot);
                    }
                });

                if (dayFreeSlots.length > 0) {
                    // Contiguous Logic
                    // We need to group contiguous slots into blocks
                    let currentBlock = [];
                    const blocks = [];

                    // Important: Sort slots by period index (if they have p number)
                    // But timeSlots array is already ordered.
                    dayFreeSlots.forEach((slot, i) => {
                        if (currentBlock.length === 0) {
                            currentBlock.push(slot);
                        } else {
                            // Check if contiguous to previous
                            // This depends on array order. Since we iterate 'timeSlots', they are ordered.
                            // We need to check if the current slot is the immediate next index of the previous slot in the MAIN timeSlots array
                            // Or simple logic: Are they physically adjacent?
                            // Let's rely on continuity of the loop.
                            // However, we skipped filtered slots.
                            // If filtering is ON, continuity doesn't mean much visually, but let's keep logic general.

                            // Better Check:
                            const prevSlot = currentBlock[currentBlock.length - 1];
                            const prevIndex = timeSlots.findIndex(s => s.t === prevSlot.t);
                            const currIndex = timeSlots.findIndex(s => s.t === slot.t);

                            if (currIndex === prevIndex + 1) {
                                currentBlock.push(slot);
                            } else {
                                blocks.push(currentBlock);
                                currentBlock = [slot];
                            }
                        }
                    });
                    if (currentBlock.length > 0) blocks.push(currentBlock);

                    result[room].push({ day, blocks });
                }
            });
        });

        return result;
    }, [allocations, timeSlots, days, classrooms, filters]);

    // Color logic
    const getBlockColor = (length) => {
        if (length === 1) return 'bg-yellow-100 border-yellow-200 text-yellow-800'; // 1 hr
        if (length === 2) return 'bg-blue-100 border-blue-200 text-blue-800';     // 2 hrs
        return 'bg-green-100 border-green-200 text-green-800';                    // 3+ hrs
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Free Resources (With Color Coding)</h2>
                    <p className="text-sm text-gray-500">Visualizing contiguous availability.</p>
                </div>

                {/* Legend */}
                <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div> 1 Period
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div> 2 Periods
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div> 3+ Periods
                    </div>
                </div>
            </div>

            {/* Filters (Reused from parent, but displayed here too for convenience if needed, 
                but user asked for filtering IN view results and free resources. 
                Since App passes filters, we just use them, or show controls.) 
                Let's show controls here as well for specific Free view filtering.
            */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex items-center gap-4">
                <div className="text-gray-400"><Filter className="w-5 h-5" /></div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">Filter Day</label>
                    <select
                        className="w-full text-sm p-1 border rounded"
                        value={filters.day}
                        onChange={e => setFilters({ ...filters, day: e.target.value })}
                    >
                        <option value="All">All Days</option>
                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold text-gray-500">Filter Time</label>
                    <select
                        className="w-full text-sm p-1 border rounded"
                        value={filters.time}
                        onChange={e => setFilters({ ...filters, time: e.target.value })}
                    >
                        <option value="All">All Periods</option>
                        {timeSlots.map(s => <option key={s.t} value={s.t}>{s.t}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map(room => (
                    <div key={room} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="bg-slate-700 px-4 py-3 text-white flex justify-between items-center">
                            <h3 className="font-bold text-lg">Room {room}</h3>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded">
                                {freeResources[room] && freeResources[room].length > 0 ? 'Available' : 'Full'}
                            </span>
                        </div>

                        <div className="p-4 max-h-96 overflow-y-auto">
                            {freeResources[room] && freeResources[room].length > 0 ? (
                                <div className="space-y-4">
                                    {freeResources[room].map((dayData, idx) => (
                                        <div key={idx} className="border-b last:border-0 pb-2">
                                            <div className="font-bold text-slate-800 text-sm mb-2">{dayData.day}</div>
                                            <div className="flex flex-wrap gap-2">
                                                {dayData.blocks.map((block, bIdx) => (
                                                    <div
                                                        key={bIdx}
                                                        className={`border rounded px-2 py-1 text-xs shadow-sm flex flex-col items-center justify-center min-w-[60px] ${getBlockColor(block.length)}`}
                                                    >
                                                        <span className="font-bold">{block.length * 50}m</span>
                                                        <span className="opacity-75 text-[10px]">
                                                            {block[0].p} - {block[block.length - 1].p}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-8 italic">
                                    No free slots matching filter
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UnallocatedView;
