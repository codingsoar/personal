import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useStageStore } from '../stores/useStageStore';
import { CheckCircle2, Star } from 'lucide-react';

const DIFFICULTY_META = {
    easy: {
        label: 'Easy',
        sublabel: 'Video + Quiz',
        iconName: 'play_arrow',
        gradient: 'from-primary to-[#2b5a91]',
        chip: 'bg-secondary/15 text-secondary border-secondary/30',
    },
    normal: {
        label: 'Normal',
        sublabel: 'Tutorial Mission',
        iconName: 'menu_book',
        gradient: 'from-primary to-[#5a9fd4]',
        chip: 'bg-accent-yellow/15 text-amber-600 border-amber-500/30',
    },
    hard: {
        label: 'Hard',
        sublabel: 'Practice Assignment',
        iconName: 'upload',
        gradient: 'from-[#112D4E] to-primary',
        chip: 'bg-accent-pink/15 text-accent-pink border-accent-pink/30',
    },
};

export default function StagePage() {
    const { courseId, stageId } = useParams();
    const navigate = useNavigate();
    const course = useStageStore((state) => state.courses.find((item) => item.id === courseId));
    const { user } = useAuthStore();
    const { isMissionCompleted } = useProgressStore();

    const stage = course?.stages?.find((item) => item.id === stageId);

    const difficulties = useMemo(() => {
        if (!stage?.missions) return [];
        return ['easy', 'normal', 'hard'].map((key) => ({
            key,
            ...DIFFICULTY_META[key],
            mission: stage.missions[key],
        }));
    }, [stage]);

    if (!course || !stage) {
        return (
            <div className="min-h-screen bg-background-light text-dark-text p-8">
                Stage not found.
            </div>
        );
    }

    const completedCount = difficulties.filter(({ key }) =>
        isMissionCompleted(user?.studentId, courseId, stageId, key)
    ).length;

    return (
        <div className="min-h-screen bg-background-light text-dark-text font-display selection:bg-accent-pink selection:text-white">
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-accent-pink/20 bg-white/80 backdrop-blur-md px-4 md:px-10 py-3">
                <div className="flex items-center gap-3 md:gap-8">
                    <div className="flex items-center gap-3 text-slate-900">
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">hub</span>
                        </div>
                        <h1 className="text-base md:text-lg font-bold tracking-tight">{course.title} Stage</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')} className="text-sm px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">Dashboard</button>
                        <button onClick={() => navigate('/dashboard')} className="text-sm px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">My Class</button>
                        <button onClick={() => navigate(`/course/${courseId}`)} className="text-sm px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium">Skill Map</button>
                    </nav>
                </div>
                <button onClick={() => navigate(`/course/${courseId}`)} className="h-10 px-4 rounded-full bg-white border border-accent-purple/20 text-sm text-slate-700 hover:border-primary/40 hover:text-primary transition-colors">
                    Back to Map
                </button>
            </header>

            <main className="p-4 md:p-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    <section className="bg-white rounded-2xl p-6 md:p-8 border border-accent-purple/20 shadow-card">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Stage {stage.order}</p>
                                <h2 className="text-2xl md:text-3xl font-bold mt-1">{stage.title}</h2>
                                <p className="text-slate-500 mt-2">{stage.description || 'No description provided.'}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-500">Completion</span>
                                <span className="text-sm font-bold text-primary">{completedCount}/{difficulties.length}</span>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {difficulties.map(({ key, label, sublabel, iconName, gradient, mission, chip }) => {
                            const done = isMissionCompleted(user?.studentId, courseId, stageId, key);
                            return (
                                <button
                                    key={key}
                                    onClick={() => navigate(`/course/${courseId}/stage/${stageId}/mission/${key}`)}
                                    className="text-left bg-white rounded-2xl border border-accent-purple/20 p-6 shadow-card hover:shadow-lg hover:scale-[1.01] transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                                            {done ? <CheckCircle2 size={24} className="text-white" /> : <span className="material-symbols-outlined text-white text-[24px]">{iconName}</span>}
                                        </div>
                                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${done ? chip : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {done ? 'COMPLETED' : 'PENDING'}
                                        </span>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{label}</h3>
                                        <p className="text-sm text-slate-500">{sublabel}</p>
                                    </div>

                                    <p className="mt-3 text-sm text-slate-600 min-h-10">{mission?.title || 'Mission not configured'}</p>

                                    <div className="mt-4 flex items-center gap-2">
                                        <Star size={18} className={done ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                                        <span className="text-xs text-slate-500">1 Star reward</span>
                                    </div>
                                </button>
                            );
                        })}
                    </section>
                </div>
            </main>
        </div>
    );
}
