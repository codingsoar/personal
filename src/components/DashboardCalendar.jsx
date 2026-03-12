import { useEffect, useState } from 'react';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DashboardCalendar = ({ classData = {} }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    useEffect(() => {
        if (selectedDate && !classData[selectedDate.date]) {
            setSelectedDate(null);
        }
    }, [classData, selectedDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const handleDateClick = (day) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate({ date: dateStr, data: classData[dateStr] });
    };

    const renderSessionPreview = (session) => (
        <div
            key={session.id}
            className="inline-flex max-w-full items-center gap-1 rounded-full border border-admin-secondary/20 bg-admin-secondary/10 px-2 py-1 text-[11px]"
            title={`${session.courseTitle} · ${session.label}`}
        >
            <span className="shrink-0 text-xs leading-none">{session.courseIcon || '📚'}</span>
            <span className="truncate font-semibold text-admin-secondary">{session.label}</span>
        </div>
    );

    const renderCalendar = () => {
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-40 bg-transparent" />);
        }

        for (let day = 1; day <= days; day++) {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const data = classData[dateStr];
            const sessions = data?.sessions || [];
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const isSelected = selectedDate?.date === dateStr;

            cells.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`flex h-40 cursor-pointer flex-col overflow-hidden border border-white/5 p-3 transition-all hover:bg-white/5 ${
                        isSelected ? 'bg-white/10 ring-2 ring-admin-primary' : ''
                    } ${isToday ? 'bg-admin-primary/10' : ''}`}
                >
                    <div className="flex items-start justify-between gap-2">
                        <span className={`text-sm font-medium ${isToday ? 'text-admin-primary' : 'text-gray-400'}`}>{day}</span>
                        {sessions.length > 0 && (
                            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-gray-300">
                                {sessions.length}개
                            </span>
                        )}
                    </div>
                    {data && (
                        <div className="mt-3 flex-1 overflow-hidden">
                            <div className="flex flex-wrap content-start gap-1.5">
                                {sessions.slice(0, 6).map(renderSessionPreview)}
                                {sessions.length > 6 && (
                                    <div className="inline-flex items-center rounded-full bg-white/5 px-2 py-1 text-[10px] text-gray-500">
                                        +{sessions.length - 6}개
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return cells;
    };

    return (
        <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-admin-card-dark p-7">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-white">수업 차시 캘린더</h3>
                    <p className="text-sm text-gray-400">날짜별로 등록된 차시와 과목을 확인할 수 있습니다.</p>
                </div>
                <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-background-dark p-1">
                    <button onClick={prevMonth} className="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="min-w-[100px] text-center text-sm font-bold text-white">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={nextMonth} className="rounded p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="mb-2 grid grid-cols-7 text-center">
                {weekDays.map((day) => (
                    <div key={day} className="py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid auto-rows-fr flex-1 grid-cols-7 gap-px overflow-hidden rounded-lg border border-white/5 bg-white/5">
                {renderCalendar()}
            </div>

            {selectedDate && selectedDate.data && (
                <div className="mt-6 rounded-xl border border-white/5 bg-background-dark/50 p-4 animate-in slide-in-from-top-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-white">등록된 차시</h4>
                            <p className="text-sm text-admin-secondary">{selectedDate.date}</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-admin-green">{selectedDate.data.sessions.length}</span>
                            <p className="text-xs uppercase text-gray-500">Sessions</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {selectedDate.data.sessions.map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                            >
                                <div className="min-w-0">
                                    <div className="truncate text-xs font-medium text-gray-400">
                                        {session.courseIcon || '📚'} {session.courseTitle}
                                    </div>
                                    <div className="truncate text-sm font-semibold text-white">{session.label}</div>
                                </div>
                                <div className="whitespace-nowrap text-[10px] text-gray-400">{session.date}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardCalendar;
