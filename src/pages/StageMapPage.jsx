import { useParams, useNavigate } from 'react-router-dom';
import { useStageStore } from '../stores/useStageStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Button, Chip } from '@heroui/react';
import { Star, Lock, ChevronLeft, ChevronRight, Play, BookOpen, Upload } from 'lucide-react';

export default function StageMapPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { getCourse } = useStageStore();
    const { user } = useAuthStore();
    const { isStageUnlocked, isStageComplete, isMissionCompleted } = useProgressStore();

    const course = getCourse(courseId);
    if (!course) return <div className="p-8" style={{ color: 'var(--sq-text)' }}>과목을 찾을 수 없습니다.</div>;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="flat" onPress={() => navigate('/courses')}>
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <span>{course.icon}</span> {course.title}
                        </h1>
                        <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{course.description}</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {course.stages.map((stage, index) => {
                        const unlocked = isStageUnlocked(user?.studentId, courseId, course.stages, stage.order);
                        const complete = isStageComplete(user?.studentId, courseId, stage.id);
                        const easyDone = isMissionCompleted(user?.studentId, courseId, stage.id, 'easy');
                        const normalDone = isMissionCompleted(user?.studentId, courseId, stage.id, 'normal');
                        const hardDone = isMissionCompleted(user?.studentId, courseId, stage.id, 'hard');

                        return (
                            <div key={stage.id} className="relative">
                                {index < course.stages.length - 1 && (
                                    <div className="absolute left-8 top-full w-0.5 h-6" style={{ background: 'var(--sq-border)', zIndex: 0 }} />
                                )}

                                <div
                                    className={`sq-card p-6 transition-all duration-300 ${unlocked ? 'cursor-pointer hover:scale-[1.01]' : 'stage-locked cursor-not-allowed'} ${complete ? 'animate-unlock-glow' : ''}`}
                                    onClick={() => unlocked && navigate(`/course/${courseId}/stage/${stage.id}`)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold"
                                                style={{
                                                    background: complete ? `linear-gradient(135deg, var(--sq-primary), #5a9fd4)` : unlocked ? 'rgba(63,114,175,0.15)' : 'var(--sq-border)',
                                                    color: complete ? '#fff' : unlocked ? 'var(--sq-primary)' : 'var(--sq-muted)',
                                                    border: unlocked && !complete ? '1px solid var(--sq-border)' : 'none',
                                                }}>
                                                {unlocked ? stage.order : <Lock size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">{stage.title}</h3>
                                                <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{stage.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-1">
                                                {[easyDone, normalDone, hardDone].map((done, i) => (
                                                    <Star key={i} size={20} className={done ? 'text-amber-400 fill-amber-400 star-glow' : ''} style={done ? {} : { color: 'var(--sq-border)' }} />
                                                ))}
                                            </div>
                                            {unlocked && <ChevronRight size={20} style={{ color: 'var(--sq-muted)' }} />}
                                        </div>
                                    </div>

                                    {unlocked && (
                                        <div className="flex gap-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--sq-border)' }}>
                                            <Chip size="sm" variant="flat" color={easyDone ? 'success' : 'default'} startContent={<Play size={12} />}>하: 동영상</Chip>
                                            <Chip size="sm" variant="flat" color={normalDone ? 'success' : 'default'} startContent={<BookOpen size={12} />}>중: 튜토리얼</Chip>
                                            <Chip size="sm" variant="flat" color={hardDone ? 'success' : 'default'} startContent={<Upload size={12} />}>상: 실습</Chip>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
