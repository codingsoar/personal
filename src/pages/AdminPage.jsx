import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useStageStore } from '../stores/useStageStore';
import { useProgressStore } from '../stores/useProgressStore';
import useThemeStore from '../stores/useThemeStore';
import { Card, CardBody, Button, Tabs, Tab, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Progress, Badge } from '@heroui/react';
import { LayoutDashboard, BookPlus, ClipboardCheck, MessageSquare, LogOut, Users, Star, CheckCircle2, XCircle, Plus, Trash2, Sun, Moon } from 'lucide-react';

export default function AdminPage() {
    const navigate = useNavigate();
    const { logout, registeredStudents, addStudent, removeStudent } = useAuthStore();
    const { courses, addCourse, deleteCourse } = useStageStore();
    const { totalStars, submissions, updateSubmission } = useProgressStore();
    const { isDark, toggleTheme } = useThemeStore();
    const [activeTab, setActiveTab] = useState('dashboard');

    const [showNewCourse, setShowNewCourse] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const [newCourseIcon, setNewCourseIcon] = useState('📚');

    const [newStudentId, setNewStudentId] = useState('');
    const [newStudentName, setNewStudentName] = useState('');

    const [feedbackIdx, setFeedbackIdx] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');

    const pendingCount = submissions.filter(s => s.status === 'pending').length;

    const handleAddCourse = () => {
        if (!newCourseTitle.trim()) return;
        addCourse({
            id: `course-${Date.now()}`,
            title: newCourseTitle,
            description: newCourseDesc,
            icon: newCourseIcon,
            theme: { primaryColor: '#3F72AF', accentColor: '#DBE2EF', bgPattern: 'blueprint' },
            stages: [],
        });
        setNewCourseTitle(''); setNewCourseDesc(''); setNewCourseIcon('📚');
        setShowNewCourse(false);
    };

    const handleAddStudent = () => {
        if (!newStudentId.trim() || !newStudentName.trim()) return;
        addStudent(newStudentId.trim(), newStudentName.trim());
        setNewStudentId(''); setNewStudentName('');
    };

    const handleApprove = (idx) => updateSubmission(idx, { status: 'approved' });
    const handleReject = (idx) => { setFeedbackIdx(idx); setFeedbackText(''); };
    const handleSendFeedback = () => {
        if (feedbackIdx !== null) {
            updateSubmission(feedbackIdx, { status: 'rejected', feedback: feedbackText });
            setFeedbackIdx(null);
        }
    };

    const inputCN = { inputWrapper: 'border-[var(--sq-input-border)]', input: '' };

    return (
        <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">🛠️ 관리자 LXP</h1>
                    <div className="flex gap-2 items-center">
                        <Badge content={pendingCount} color="danger" isInvisible={pendingCount === 0}>
                            <Button variant="flat" size="sm" onPress={() => setActiveTab('assess')}>미검토 제출물</Button>
                        </Badge>
                        <button onClick={toggleTheme} className="p-2 rounded-lg transition-all hover:scale-110"
                            style={{ background: 'var(--sq-card-bg)', border: '1px solid var(--sq-card-border)', color: 'var(--sq-primary)' }}>
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <Button color="danger" variant="flat" size="sm" onPress={() => { logout(); navigate('/'); }} startContent={<LogOut size={14} />}>로그아웃</Button>
                    </div>
                </div>

                {/* 탭 */}
                <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab} variant="underlined" color="primary"
                    classNames={{ tabList: 'border-b', tab: 'text-sm' }}>

                    <Tab key="dashboard" title={<span className="flex items-center gap-1.5"><LayoutDashboard size={14} />대시보드</span>}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <Card className="sq-card"><CardBody className="p-5 text-center">
                                <p className="text-3xl font-bold" style={{ color: 'var(--sq-primary)' }}>{registeredStudents.length}</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--sq-muted)' }}>등록 학생</p>
                            </CardBody></Card>
                            <Card className="sq-card"><CardBody className="p-5 text-center">
                                <p className="text-3xl font-bold" style={{ color: 'var(--sq-muted)' }}>{courses.length}</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--sq-muted)', opacity: 0.6 }}>개설 과목</p>
                            </CardBody></Card>
                            <Card className="sq-card"><CardBody className="p-5 text-center">
                                <p className="text-3xl font-bold text-red-400">{pendingCount}</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--sq-muted)' }}>미검토 제출물</p>
                            </CardBody></Card>
                        </div>

                        <Card className="sq-card mt-6">
                            <CardBody className="p-4">
                                <h3 className="font-semibold mb-4 flex items-center gap-2"><Users size={16} />학생 진도 현황</h3>
                                <Table aria-label="학생 진도" removeWrapper>
                                    <TableHeader>
                                        <TableColumn>학번</TableColumn>
                                        <TableColumn>이름</TableColumn>
                                        <TableColumn>총 별</TableColumn>
                                        <TableColumn>진행률</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {registeredStudents.map(st => {
                                            const stars = totalStars[st.studentId] || 0;
                                            const totalPossible = courses.reduce((a, c) => a + c.stages.length * 3, 0);
                                            const pct = totalPossible > 0 ? Math.round((stars / totalPossible) * 100) : 0;
                                            return (
                                                <TableRow key={st.studentId}>
                                                    <TableCell>{st.studentId}</TableCell>
                                                    <TableCell>{st.name}</TableCell>
                                                    <TableCell><span className="text-amber-400">⭐ {stars}</span></TableCell>
                                                    <TableCell><Progress value={pct} color="primary" size="sm" className="max-w-[120px]" /></TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Tab>

                    <Tab key="plan" title={<span className="flex items-center gap-1.5"><BookPlus size={14} />계획(Plan)</span>}>
                        <div className="space-y-6 mt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">과목 관리</h3>
                                <Button size="sm" className="text-white" style={{ background: 'var(--sq-primary)' }} onPress={() => setShowNewCourse(true)} startContent={<Plus size={14} />}>새 과목</Button>
                            </div>
                            {courses.map(c => (
                                <Card key={c.id} className="sq-card">
                                    <CardBody className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{c.icon}</span>
                                            <div>
                                                <p className="font-medium">{c.title}</p>
                                                <p className="text-sm" style={{ color: 'var(--sq-muted)' }}>{c.stages.length}개 스테이지 · {c.description}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="flat" color="danger" isIconOnly onPress={() => deleteCourse(c.id)}><Trash2 size={14} /></Button>
                                    </CardBody>
                                </Card>
                            ))}

                            <h3 className="text-lg font-semibold mt-8">학생 등록</h3>
                            <div className="flex gap-2">
                                <Input placeholder="학번" value={newStudentId} onValueChange={setNewStudentId} variant="bordered" size="sm" classNames={inputCN} />
                                <Input placeholder="이름" value={newStudentName} onValueChange={setNewStudentName} variant="bordered" size="sm" classNames={inputCN} />
                                <Button size="sm" className="text-white" style={{ background: 'var(--sq-primary)' }} onPress={handleAddStudent} startContent={<Plus size={14} />}>추가</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {registeredStudents.map(s => (
                                    <Chip key={s.studentId} variant="flat" onClose={() => removeStudent(s.studentId)}>
                                        {s.studentId} {s.name}
                                    </Chip>
                                ))}
                            </div>
                        </div>

                        <Modal isOpen={showNewCourse} onClose={() => setShowNewCourse(false)}>
                            <ModalContent>
                                <ModalHeader>새 과목 추가</ModalHeader>
                                <ModalBody className="space-y-3">
                                    <Input label="아이콘 (이모지)" value={newCourseIcon} onValueChange={setNewCourseIcon} variant="bordered" classNames={inputCN} />
                                    <Input label="과목명" value={newCourseTitle} onValueChange={setNewCourseTitle} variant="bordered" classNames={inputCN} />
                                    <Textarea label="설명" value={newCourseDesc} onValueChange={setNewCourseDesc} variant="bordered" classNames={inputCN} />
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="flat" onPress={() => setShowNewCourse(false)}>취소</Button>
                                    <Button className="text-white" style={{ background: 'var(--sq-primary)' }} onPress={handleAddCourse}>추가</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Tab>

                    <Tab key="assess" title={<span className="flex items-center gap-1.5"><ClipboardCheck size={14} />평가(Assess)</span>}>
                        <div className="space-y-4 mt-6">
                            <h3 className="text-lg font-semibold">제출물 검토</h3>
                            {submissions.length === 0 ? (
                                <p className="text-center py-8" style={{ color: 'var(--sq-muted)' }}>아직 제출물이 없습니다.</p>
                            ) : (
                                <Table aria-label="제출물" removeWrapper>
                                    <TableHeader>
                                        <TableColumn>학생</TableColumn>
                                        <TableColumn>파일</TableColumn>
                                        <TableColumn>상태</TableColumn>
                                        <TableColumn>작업</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {submissions.map((sub, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{sub.studentName} ({sub.studentId})</TableCell>
                                                <TableCell>{sub.fileName}</TableCell>
                                                <TableCell>
                                                    <Chip size="sm" color={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'} variant="flat">
                                                        {sub.status === 'approved' ? '승인' : sub.status === 'rejected' ? '반려' : '대기'}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    {sub.status === 'pending' && (
                                                        <div className="flex gap-1">
                                                            <Button size="sm" color="success" variant="flat" isIconOnly onPress={() => handleApprove(idx)}><CheckCircle2 size={14} /></Button>
                                                            <Button size="sm" color="danger" variant="flat" isIconOnly onPress={() => handleReject(idx)}><XCircle size={14} /></Button>
                                                        </div>
                                                    )}
                                                    {sub.feedback && <p className="text-xs mt-1" style={{ color: 'var(--sq-muted)', opacity: 0.6 }}>💬 {sub.feedback}</p>}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </Tab>

                    <Tab key="feedback" title={<span className="flex items-center gap-1.5"><MessageSquare size={14} />피드백</span>}>
                        <div className="space-y-4 mt-6">
                            <h3 className="text-lg font-semibold">학생별 피드백</h3>
                            {registeredStudents.map(st => {
                                const studentSubs = submissions.filter(s => s.studentId === st.studentId);
                                return (
                                    <Card key={st.studentId} className="sq-card">
                                        <CardBody className="p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{st.name} ({st.studentId})</p>
                                                <Chip size="sm" variant="flat" color="warning">⭐ {totalStars[st.studentId] || 0}</Chip>
                                            </div>
                                            {studentSubs.length > 0 ? (
                                                <div className="space-y-2">
                                                    {studentSubs.map((sub, i) => (
                                                        <div key={i} className="flex items-center justify-between text-sm p-2 rounded"
                                                            style={{ background: 'var(--sq-card-bg)', border: '1px solid var(--sq-border)' }}>
                                                            <span>{sub.fileName}</span>
                                                            <div className="flex items-center gap-2">
                                                                <Chip size="sm" color={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'} variant="flat">
                                                                    {sub.status === 'approved' ? '승인' : sub.status === 'rejected' ? '반려' : '대기'}
                                                                </Chip>
                                                                {sub.feedback && <span className="text-xs" style={{ color: 'var(--sq-muted)', opacity: 0.6 }}>💬 {sub.feedback}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm" style={{ color: 'var(--sq-muted)', opacity: 0.5 }}>제출물 없음</p>
                                            )}
                                        </CardBody>
                                    </Card>
                                );
                            })}
                        </div>
                    </Tab>
                </Tabs>

                {/* 반려 피드백 모달 */}
                <Modal isOpen={feedbackIdx !== null} onClose={() => setFeedbackIdx(null)}>
                    <ModalContent>
                        <ModalHeader>반려 사유 입력</ModalHeader>
                        <ModalBody>
                            <Textarea placeholder="개선점을 알려주세요..." value={feedbackText} onValueChange={setFeedbackText} variant="bordered" classNames={inputCN} />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={() => setFeedbackIdx(null)}>취소</Button>
                            <Button color="danger" onPress={handleSendFeedback}>반려 처리</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}
