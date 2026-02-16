import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultStudents } from '../data/sampleCourses';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAdmin: false,
            registeredStudents: defaultStudents,

            loginStudent: (studentId, name) => {
                const students = get().registeredStudents;
                const found = students.find(s => s.studentId === studentId && s.name === name);
                if (found) {
                    set({ user: { ...found, role: 'student' }, isAdmin: false });
                    return true;
                }
                return false;
            },

            loginAdmin: (password) => {
                if (password === 'admin1234') {
                    set({ user: { name: '관리자', role: 'admin' }, isAdmin: true });
                    return true;
                }
                return false;
            },

            logout: () => set({ user: null, isAdmin: false }),

            addStudent: (studentId, name) => {
                set(state => ({
                    registeredStudents: [...state.registeredStudents, { studentId, name }],
                }));
            },

            removeStudent: (studentId) => {
                set(state => ({
                    registeredStudents: state.registeredStudents.filter(s => s.studentId !== studentId),
                }));
            },
        }),
        { name: 'starquest-auth' }
    )
);
