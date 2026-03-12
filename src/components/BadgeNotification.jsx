import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';
import { useBadgeStore } from '../stores/useBadgeStore';
import { useProgressStore } from '../stores/useProgressStore';
import { useAssessmentStore } from '../stores/useAssessmentStore';
import { useMarketplaceStore } from '../stores/useMarketplaceStore';

export default function BadgeNotification() {
    const [notifications, setNotifications] = useState([]);
    const { user } = useAuthStore();

    useEffect(() => {
        const handleBadgeUnlock = (event) => {
            const { badge, studentId } = event.detail;
            
            // Only show for the currently logged in user
            if (user && user.role === 'student' && user.studentId === studentId) {
                const id = Date.now() + Math.random();
                setNotifications(prev => [...prev, { ...badge, id }]);
                
                // Remove after showing for 5 seconds
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== id));
                }, 5000);
            }
        };

        window.addEventListener('badgeUnlocked', handleBadgeUnlock);
        return () => window.removeEventListener('badgeUnlocked', handleBadgeUnlock);
    }, [user]);

    // Global listener to check badges when relevant state changes
    const progress = useProgressStore(state => state.progress);
    const totalStars = useProgressStore(state => state.totalStars);
    const submissions = useProgressStore(state => state.submissions);
    const sessions = useAssessmentStore(state => state.sessions);
    const purchases = useMarketplaceStore(state => state.purchases);
    
    useEffect(() => {
        if (user && user.role === 'student' && user.studentId) {
            // Minor timeout to let other state updates settle before checking badge logic
            const timer = setTimeout(() => {
                useBadgeStore.getState().checkBadges(user.studentId);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [user, progress, totalStars, submissions, sessions, purchases]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 flex items-center gap-4 border-2 border-primary/20 pointer-events-auto"
                        style={{ minWidth: '300px' }}
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent-pink/10 flex items-center justify-center text-3xl border-2 border-primary/30 shadow-inner">
                            {notif.emoji}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-primary uppercase tracking-wider mb-1">
                                새로운 뱃지 획득! 🏆
                            </p>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                                {notif.name}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {notif.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
