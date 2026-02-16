import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useStageStore } from '../stores/useStageStore';
import useThemeStore from '../stores/useThemeStore';
import { Card, CardBody, Button, Chip, Progress } from '@heroui/react';
import { Star, ChevronLeft, User, BookOpen, Sun, Moon } from 'lucide-react';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { courses } = useStageStore();
    const { progress, totalStars, isMissionCompleted } = useProgressStore();
    const { isDark, toggleTheme } = useThemeStore();

    const studentStars = totalStars[user?.studentId] || 0;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button isIconOnly variant="flat" onPress={() => navigate('/courses')}>
                            <ChevronLeft size={20} />
                        </Button>
                        <h1 className="text-2xl font-bold">내 프로필</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'var(--sq-card-bg)', border: '1px solid var(--sq-card-border)', color: 'var(--sq-primary)' }}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <Button size="sm" variant="flat" color="danger" onPress={() => { logout(); navigate('/'); }}>로그아웃</Button>
                    </div>
                </div>

                {/* 프로필 카드 */}
                <Card className="sq-card">
                    <CardBody className="p-6 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                            style={{ background: 'linear-gradient(135deg, var(--sq-primary), #2b5a91)' }}>
                            <User size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>학번: {user?.studentId}</p>
                        </div>
                        <div className="flex gap-3">
                            <Chip color="warning" variant="flat" startContent={<Star size={14} className="text-amber-400" />}>
                                ⭐ {studentStars}
                            </Chip>
                            <Chip variant="flat" startContent={<BookOpen size={14} />} style={{ color: 'var(--sq-primary)' }}>
                                {courses.length} 과목
                            </Chip>
                        </div>
                    </CardBody>
                </Card>

                {/* 과목별 진도 */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">과목별 진도</h3>
                    {courses.map(course => {
                        const stagesComplete = course.stages.filter(stage => {
                            const sp = progress?.[user?.studentId]?.[course.id]?.[stage.id];
                            return sp?.easy && sp?.normal && sp?.hard;
                        }).length;
                        const pct = course.stages.length > 0 ? Math.round(stagesComplete / course.stages.length * 100) : 0;

                        return (
                            <Card key={course.id} className="sq-card">
                                <CardBody className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{course.icon}</span>
                                            <span className="font-semibold">{course.title}</span>
                                        </div>
                                        <span className="text-sm font-medium" style={{ color: 'var(--sq-primary)' }}>{pct}%</span>
                                    </div>
                                    <Progress value={pct} color="primary" size="sm" />
                                    <div className="grid grid-cols-5 gap-2">
                                        {course.stages.map(stage => {
                                            const sp = progress?.[user?.studentId]?.[course.id]?.[stage.id];
                                            const difficulties = ['easy', 'normal', 'hard'];
                                            return (
                                                <div key={stage.id} className="text-center">
                                                    <p className="text-xs mb-1" style={{ color: 'var(--sq-muted)' }}>S{stage.order}</p>
                                                    <div className="flex justify-center gap-0.5">
                                                        {difficulties.map(d => (
                                                            <Star key={d} size={12} className={sp?.[d] ? 'text-amber-400 fill-amber-400' : ''} style={sp?.[d] ? {} : { color: 'var(--sq-border)' }} />
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
