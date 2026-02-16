import { useNavigate } from 'react-router-dom';
import { useStageStore } from '../stores/useStageStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useAuthStore } from '../stores/useAuthStore';
import useThemeStore from '../stores/useThemeStore';
import { Card, CardBody, Button, Chip } from '@heroui/react';
import { BookOpen, Star, ChevronRight, Sun, Moon } from 'lucide-react';

export default function CourseSelectPage() {
    const navigate = useNavigate();
    const { courses } = useStageStore();
    const { user } = useAuthStore();
    const { totalStars } = useProgressStore();
    const { isDark, toggleTheme } = useThemeStore();

    const studentStars = totalStars[user?.studentId] || 0;

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            <div className="max-w-4xl mx-auto space-y-8">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">안녕, <span style={{ color: 'var(--sq-primary)' }}>{user?.name}</span> 👋</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--sq-muted)' }}>학습할 과목을 선택하세요</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Chip color="warning" variant="flat" startContent={<Star size={14} className="text-amber-400" />}>
                            ⭐ {studentStars}
                        </Chip>
                        <Button size="sm" variant="flat" onPress={() => navigate('/profile')}>내 프로필</Button>
                        <button onClick={toggleTheme} className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'var(--sq-card-bg)', border: '1px solid var(--sq-card-border)', color: 'var(--sq-primary)' }}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <Button size="sm" variant="flat" color="danger" onPress={() => { useAuthStore.getState().logout(); navigate('/'); }}>로그아웃</Button>
                    </div>
                </div>

                {/* 과목 카드들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => {
                        const completedStages = course.stages.filter(stage => {
                            const sp = useProgressStore.getState().progress?.[user?.studentId]?.[course.id]?.[stage.id];
                            return sp?.easy && sp?.normal && sp?.hard;
                        }).length;

                        return (
                            <Card
                                key={course.id}
                                isPressable
                                onPress={() => navigate(`/course/${course.id}`)}
                                className="sq-card group transition-all duration-300 hover:scale-[1.02]"
                            >
                                <CardBody className="p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{course.icon}</span>
                                            <div>
                                                <h3 className="text-lg font-bold transition-colors" style={{ color: 'var(--sq-text)' }}>{course.title}</h3>
                                                <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{course.description}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} style={{ color: 'var(--sq-muted)' }} className="group-hover:translate-x-1 transition-transform mt-1" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sq-muted)' }}>
                                            <BookOpen size={14} />
                                            <span>{course.stages.length}개 스테이지</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {course.stages.map((stage, i) => {
                                                const sp = useProgressStore.getState().progress?.[user?.studentId]?.[course.id]?.[stage.id];
                                                const complete = sp?.easy && sp?.normal && sp?.hard;
                                                return (
                                                    <div key={i} className={`w-3 h-3 rounded-full transition-colors`}
                                                        style={{ background: complete ? 'var(--sq-primary)' : 'var(--sq-border)' }} />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="w-full rounded-full h-2" style={{ background: 'var(--sq-border)' }}>
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{ background: `linear-gradient(90deg, var(--sq-primary), #5a9fd4)`, width: `${course.stages.length > 0 ? (completedStages / course.stages.length * 100) : 0}%` }}
                                        />
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
