import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import useThemeStore from '../stores/useThemeStore';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { Shield, Sun, Moon, ChevronLeft } from 'lucide-react';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { loginAdmin } = useAuthStore();
    const { isDark, toggleTheme } = useThemeStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (loginAdmin(password)) {
            navigate('/admin');
        } else {
            setError('비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--sq-bg)', color: 'var(--sq-text)' }}>
            {/* 다크 모드 토글 */}
            <button
                onClick={toggleTheme}
                className="fixed top-4 right-4 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                style={{ background: 'var(--sq-card-bg)', border: '1px solid var(--sq-card-border)', color: 'var(--sq-primary)' }}
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="w-full max-w-md space-y-8">
                {/* 로고 영역 */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg"
                        style={{ background: `linear-gradient(135deg, #112D4E, var(--sq-primary))` }}>
                        <Shield size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--sq-text)' }}>
                        관리자 로그인
                    </h1>
                    <p style={{ color: 'var(--sq-muted)' }} className="text-sm">StarQuest 관리 콘솔</p>
                </div>

                {/* 관리자 로그인 카드 */}
                <Card className="sq-card" style={{ background: 'var(--sq-card-bg)', borderColor: 'var(--sq-card-border)' }}>
                    <CardBody className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium" style={{ color: 'var(--sq-muted)' }}>관리자 비밀번호</label>
                                <Input
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onValueChange={setPassword}
                                    variant="bordered"
                                    classNames={{ inputWrapper: 'border-[var(--sq-input-border)] hover:border-[var(--sq-primary)]', input: 'text-[var(--sq-text)]' }}
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <Button type="submit" fullWidth size="lg" className="font-semibold text-white"
                                style={{ background: `linear-gradient(135deg, #112D4E, var(--sq-primary))` }}>
                                관리자 로그인
                            </Button>
                        </form>
                    </CardBody>
                </Card>

                {/* 학생 로그인 링크 */}
                <p className="text-center text-xs" style={{ color: 'var(--sq-muted)', opacity: 0.7 }}>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-1 hover:underline transition-colors"
                        style={{ color: 'var(--sq-primary)' }}
                    >
                        <ChevronLeft size={12} /> 학생 로그인으로 돌아가기
                    </button>
                </p>
            </div>
        </div>
    );
}
