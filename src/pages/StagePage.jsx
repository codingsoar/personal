import { useParams, useNavigate } from 'react-router-dom';
import { useStageStore } from '../stores/useStageStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Star, ChevronLeft, Play, BookOpen, Upload, CheckCircle2 } from 'lucide-react';

export default function StagePage() {
    const { courseId, stageId } = useParams();
    const navigate = useNavigate();
    const { getStage } = useStageStore();
    const { user } = useAuthStore();
    const { isMissionCompleted } = useProgressStore();

    const stage = getStage(courseId, stageId);
    if (!stage) return <div className="p-8" style={{ color: 'var(--sq-text)' }}>스테이지를 찾을 수 없습니다.</div>;

    const difficulties = [
        { key: 'easy', label: '하 (Easy)', sublabel: '동영상 학습', icon: Play, gradient: 'linear-gradient(135deg, var(--sq-primary), #2b5a91)', chipColor: 'success', mission: stage.missions.easy },
        { key: 'normal', label: '중 (Normal)', sublabel: '튜토리얼', icon: BookOpen, gradient: 'linear-gradient(135deg, var(--sq-primary), #5a9fd4)', chipColor: 'warning', mission: stage.missions.normal },
        { key: 'hard', label: '상 (Hard)', sublabel: '실습 과제', icon: Upload, gradient: 'linear-gradient(135deg, #112D4E, var(--sq-primary))', chipColor: 'danger', mission: stage.missions.hard },
    ];

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="flat" onPress={() => navigate(`/course/${courseId}`)}>
                        <ChevronLeft size={20} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Stage {stage.order}: {stage.title}</h1>
                        <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{stage.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {difficulties.map(({ key, label, sublabel, icon: Icon, gradient, chipColor, mission }) => {
                        const done = isMissionCompleted(user?.studentId, courseId, stageId, key);
                        return (
                            <Card
                                key={key}
                                isPressable
                                onPress={() => navigate(`/course/${courseId}/stage/${stageId}/mission/${key}`)}
                                className="sq-card group transition-all hover:scale-[1.03] duration-300"
                            >
                                <CardBody className="p-6 space-y-4 text-center">
                                    <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                                        style={{ background: gradient }}>
                                        {done ? <CheckCircle2 size={28} className="text-white" /> : <Icon size={28} className="text-white" />}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold">{label}</h3>
                                        <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{sublabel}</p>
                                    </div>

                                    <p className="text-sm font-medium" style={{ color: 'var(--sq-muted)' }}>{mission?.title}</p>

                                    <div className="flex items-center justify-center gap-2">
                                        <Star size={20} className={done ? 'text-amber-400 fill-amber-400 star-glow' : ''} style={done ? {} : { color: 'var(--sq-border)' }} />
                                        <Chip size="sm" variant="flat" color={done ? chipColor : 'default'}>
                                            {done ? '완료!' : '도전하기'}
                                        </Chip>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-2">
                    {difficulties.map(({ key }) => {
                        const done = isMissionCompleted(user?.studentId, courseId, stageId, key);
                        return <Star key={key} size={32} className={`transition-all duration-300 ${done ? 'text-amber-400 fill-amber-400 star-glow animate-star-earned' : ''}`} style={done ? {} : { color: 'var(--sq-border)' }} />;
                    })}
                </div>
            </div>
        </div>
    );
}
