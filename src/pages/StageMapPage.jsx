import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useStageStore } from '../stores/useStageStore';

const STAGE_ICONS = [
    'school',
    'terminal',
    'security',
    'code',
    'data_object',
    'lan',
    'function',
    'memory',
    'hive',
    'rocket_launch',
];

const LANE_Y = [600, 430, 760, 340, 560, 840, 660];
const NODE_SIZE = 160;
const NODE_STEP_X = 420;
const NODE_CENTER = NODE_SIZE / 2;
const CANVAS_SCROLL_OFFSET_X = 650;
const CANVAS_SCROLL_OFFSET_Y = 340;
const CURVE_DX = 240;
const CURVE_PREV_OFFSET = 80;
const CANVAS_PADDING = 700;

export default function StageMapPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const course = useStageStore((state) => state.courses.find((item) => item.id === courseId));
    const { user } = useAuthStore();
    const { isStageUnlocked, isStageComplete, isMissionCompleted } = useProgressStore();
    const canvasRef = useRef(null);
    const panStateRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        startScrollLeft: 0,
        startScrollTop: 0,
        lastX: 0,
        lastY: 0,
    });
    const [isPanning, setIsPanning] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const canvas = canvasRef.current;
            const pan = panStateRef.current;
            if (!canvas || !pan.active) return;

            const deltaX = event.clientX - pan.startX;
            const deltaY = event.clientY - pan.startY;
            canvas.scrollLeft = pan.startScrollLeft - deltaX;
            canvas.scrollTop = pan.startScrollTop - deltaY;
            pan.lastX = event.clientX;
            pan.lastY = event.clientY;
        };

        const stopPan = () => {
            if (!panStateRef.current.active) return;
            panStateRef.current.active = false;
            setIsPanning(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', stopPan);
        window.addEventListener('mouseleave', stopPan);
        window.addEventListener('blur', stopPan);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopPan);
            window.removeEventListener('mouseleave', stopPan);
            window.removeEventListener('blur', stopPan);
        };
    }, []);

    const orderedStages = useMemo(() => {
        if (!course) return [];
        return [...course.stages].sort((a, b) => a.order - b.order);
    }, [course]);

    const stageNodes = useMemo(() => {
        return orderedStages.map((stage, index) => {
            const unlocked = isStageUnlocked(user?.studentId, courseId, orderedStages, stage.order);
            const completed = isStageComplete(user?.studentId, courseId, stage.id);
            const missionDoneCount = ['easy', 'normal', 'hard'].filter((difficulty) =>
                isMissionCompleted(user?.studentId, courseId, stage.id, difficulty)
            ).length;
            return {
                ...stage,
                unlocked,
                completed,
                missionDoneCount,
                icon: STAGE_ICONS[index % STAGE_ICONS.length],
                x: 220 + index * NODE_STEP_X,
                y: LANE_Y[index % LANE_Y.length] + (Math.floor(index / LANE_Y.length) % 2 === 1 ? 30 : 0),
            };
        });
    }, [orderedStages, isStageUnlocked, user?.studentId, courseId, isStageComplete, isMissionCompleted]);

    const activeStage = useMemo(() => {
        const unlockedPending = stageNodes.find((node) => node.unlocked && !node.completed);
        if (unlockedPending) return unlockedPending;
        return stageNodes.find((node) => node.completed) || stageNodes[0] || null;
    }, [stageNodes]);

    const [selectedStageId, setSelectedStageId] = useState(null);

    useEffect(() => {
        if (!canvasRef.current || !activeStage) return;
        canvasRef.current.scrollLeft = Math.max(activeStage.x - CANVAS_SCROLL_OFFSET_X, 0);
        canvasRef.current.scrollTop = Math.max(activeStage.y - CANVAS_SCROLL_OFFSET_Y, 0);
    }, [activeStage]);

    if (!course) {
        return (
            <div className="min-h-screen bg-background-light text-dark-text p-8">
                Class not found.
            </div>
        );
    }

    const selectedStage = stageNodes.find((node) => node.id === selectedStageId) || activeStage;
    const canvasWidth = Math.max(2200, CANVAS_PADDING + stageNodes.length * NODE_STEP_X);
    const canvasHeight = 1200;
    const completionRate = course.stages.length > 0
        ? Math.round((stageNodes.filter((stage) => stage.completed).length / course.stages.length) * 100)
        : 0;

    const handleCanvasMouseDown = (event) => {
        if (event.button !== 1 || !canvasRef.current) return;
        event.preventDefault();
        panStateRef.current = {
            active: true,
            startX: event.clientX,
            startY: event.clientY,
            startScrollLeft: canvasRef.current.scrollLeft,
            startScrollTop: canvasRef.current.scrollTop,
            lastX: event.clientX,
            lastY: event.clientY,
        };
        setIsPanning(true);
    };

    return (
        <div className="h-screen overflow-hidden bg-background-light text-dark-text font-display flex flex-col selection:bg-accent-pink selection:text-white">
            <header className="flex-none flex items-center justify-between border-b border-accent-pink/20 bg-white/80 backdrop-blur-md px-4 md:px-10 py-3 z-30">
                <div className="flex items-center gap-3 md:gap-8">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">hub</span>
                        </div>
                        <h1 className="text-base md:text-lg font-bold tracking-tight">{course.title} Skill Map</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="text-sm px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium">Dashboard</button>
                        <button onClick={() => navigate('/dashboard')} className="text-sm px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">My Class</button>
                        <button onClick={() => navigate('/dashboard')} className="text-sm px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">Leaderboard</button>
                        <button onClick={() => navigate('/dashboard')} className="text-sm px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">Marketplace</button>
                    </nav>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={() => navigate('/courses')} className="h-10 px-4 rounded-full bg-white border border-accent-purple/20 text-sm text-slate-700 hover:border-primary/40 hover:text-primary transition-colors">
                        Back
                    </button>
                    <div
                        className="w-10 h-10 rounded-full border-2 border-primary bg-cover bg-center"
                        style={{ backgroundImage: `url('https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=random')` }}
                    />
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white via-[#f0f9ff] to-[#e6f7ff]" />
                <div className="absolute inset-0 opacity-35 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00bbf9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onAuxClick={(event) => {
                        if (event.button === 1) event.preventDefault();
                    }}
                    className={`absolute inset-0 overflow-auto scroll-smooth pr-[420px] ${isPanning ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
                >
                    <div className="relative flex items-center justify-start min-w-full min-h-full">
                        <div className="relative" style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}>
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                {stageNodes.slice(0, -1).map((node, index) => {
                                    const next = stageNodes[index + 1];
                                    if (!next) return null;
                                    const path = `M ${node.x + NODE_CENTER} ${node.y + NODE_CENTER} C ${node.x + CURVE_DX} ${node.y + NODE_CENTER}, ${next.x - CURVE_PREV_OFFSET} ${next.y + NODE_CENTER}, ${next.x + NODE_CENTER} ${next.y + NODE_CENTER}`;
                                    const completePath = node.completed;
                                    return (
                                        <path
                                            key={`${node.id}-${next.id}`}
                                            d={path}
                                            fill="none"
                                            stroke={completePath ? '#00f5d4' : '#9b5de5'}
                                            strokeOpacity={completePath ? 0.9 : 0.65}
                                            strokeWidth={completePath ? 4 : 3}
                                            strokeLinecap="round"
                                            strokeDasharray={completePath ? undefined : '12 8'}
                                        />
                                    );
                                })}
                            </svg>

                            {stageNodes.map((node) => {
                                const isActive = node.id === activeStage?.id;
                                const isSelected = node.id === selectedStage?.id;
                                const baseClass = 'absolute rounded-full flex items-center justify-center z-10 group transition-all';
                                let stateClass = 'bg-white border-2 border-accent-purple/30 hover:border-accent-purple';

                                if (node.completed) {
                                    stateClass = 'bg-white border-4 border-secondary shadow-[0_0_15px_rgba(0,245,212,0.3)]';
                                } else if (node.unlocked) {
                                    stateClass = 'bg-primary text-background-dark ring-4 ring-primary/30 shadow-[0_0_20px_rgba(0,187,249,0.45)]';
                                }

                                return (
                                    <button
                                        key={node.id}
                                        onClick={() => setSelectedStageId(node.id)}
                                        className={`${baseClass} ${stateClass} ${isSelected ? 'scale-110' : 'hover:scale-105'} ${isActive ? 'animate-pulse-glow' : ''}`}
                                        style={{ left: `${node.x}px`, top: `${node.y}px`, width: `${NODE_SIZE}px`, height: `${NODE_SIZE}px` }}
                                    >
                                        <span className={`material-symbols-outlined text-7xl ${node.unlocked || node.completed ? '' : 'text-accent-purple/60'}`}>
                                            {node.unlocked || node.completed ? node.icon : 'lock'}
                                        </span>
                                        <span className={`absolute -bottom-12 w-72 text-center text-base font-bold ${node.unlocked ? 'text-primary' : node.completed ? 'text-secondary' : 'text-slate-600'}`}>
                                            {node.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <aside className="absolute top-4 bottom-4 right-4 w-[360px] md:w-[380px] bg-white/95 backdrop-blur-xl border border-accent-purple/20 rounded-[28px] shadow-2xl overflow-hidden flex flex-col z-20">
                    <div className="p-6 border-b border-accent-purple/20 bg-white/60">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full border-2 border-primary p-0.5">
                                    <img
                                        className="w-full h-full rounded-full object-cover"
                                        alt="Student avatar"
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=random`}
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary text-background-dark text-xs font-bold px-2 py-0.5 rounded-full">
                                    Lv12
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-end mb-1">
                                    <h3 className="text-slate-900 font-bold text-lg">Course Progress</h3>
                                    <span className="text-primary text-xs font-bold">{completionRate}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-accent-purple/20">
                                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${completionRate}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <span className="bg-slate-50 border border-accent-purple/20 text-slate-600 text-xs px-3 py-1 rounded-full">
                                Stages {course.stages.length}
                            </span>
                            <span className="bg-slate-50 border border-accent-purple/20 text-slate-600 text-xs px-3 py-1 rounded-full">
                                Completed {stageNodes.filter((stage) => stage.completed).length}
                            </span>
                        </div>
                    </div>

                    {selectedStage && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${selectedStage.unlocked ? 'bg-primary/15 text-primary border-primary/30' : selectedStage.completed ? 'bg-secondary/15 text-secondary border-secondary/30' : 'bg-slate-50 text-accent-purple border-accent-purple/30'}`}>
                                        {selectedStage.completed ? 'Completed' : selectedStage.unlocked ? 'Active' : 'Locked'}
                                    </span>
                                    <span className="text-slate-500 text-xs">Stage {selectedStage.order}</span>
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">{selectedStage.title}</h2>
                                    <p className="text-slate-500 text-sm leading-relaxed">{selectedStage.description || 'No description provided.'}</p>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 border border-accent-purple/20">
                                    <h4 className="text-slate-900 text-sm font-bold mb-3">Mission Completion</h4>
                                    <ul className="flex flex-col gap-2 text-sm">
                                        {['easy', 'normal', 'hard'].map((difficulty) => {
                                            const done = isMissionCompleted(user?.studentId, courseId, selectedStage.id, difficulty);
                                            return (
                                                <li key={difficulty} className="flex items-center justify-between">
                                                    <span className={`flex items-center gap-2 ${done ? 'text-slate-800' : 'text-slate-500'}`}>
                                                        <span className="material-symbols-outlined text-[16px]">{done ? 'check_circle' : 'radio_button_unchecked'}</span>
                                                        {difficulty.toUpperCase()}
                                                    </span>
                                                    <span className={`text-xs ${done ? 'text-secondary' : 'text-slate-500'}`}>{done ? 'Done' : 'Pending'}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="bg-slate-50 rounded-2xl p-4 border border-accent-purple/20">
                                    <h4 className="text-slate-900 text-sm font-bold mb-3">Rewards</h4>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center bg-white border border-accent-purple/20 rounded-xl p-2 w-20">
                                            <span className="text-accent-yellow font-bold text-lg">+300</span>
                                            <span className="text-slate-500 text-[10px] uppercase">XP</span>
                                        </div>
                                        <div className="flex flex-col items-center bg-white border border-accent-purple/20 rounded-xl p-2 w-20">
                                            <span className="material-symbols-outlined text-accent-pink mb-1">military_tech</span>
                                            <span className="text-slate-500 text-[10px] uppercase">Badge</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-accent-purple/20 bg-white/70">
                                <button
                                    disabled={!selectedStage.unlocked}
                                    onClick={() => selectedStage.unlocked && navigate(`/course/${courseId}/stage/${selectedStage.id}`)}
                                    className={`w-full h-12 rounded-full font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors ${selectedStage.unlocked
                                            ? 'bg-primary text-background-dark hover:bg-[#35c9fb]'
                                            : 'bg-slate-100 text-accent-purple/70 border border-accent-purple/20 cursor-not-allowed opacity-75'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{selectedStage.unlocked ? 'play_arrow' : 'lock'}</span>
                                    {selectedStage.unlocked ? 'Open Stage' : 'Locked'}
                                </button>
                                {!selectedStage.unlocked && (
                                    <p className="text-center text-slate-500 text-xs mt-3">Complete previous stage to unlock</p>
                                )}
                            </div>
                        </>
                    )}
                </aside>
            </main>
        </div>
    );
}
