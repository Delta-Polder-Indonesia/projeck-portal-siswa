import { ClassRoom, Teacher } from '../../../types';

export function applyExclusiveClassAssignment(
    allTeachers: Teacher[],
    allClasses: ClassRoom[],
    targetTeacherId: string,
    selectedClassIds: string[],
) {
    const selectedSet = new Set(selectedClassIds);

    const nextTeachers = allTeachers.map((item) => {
        if (item.id === targetTeacherId) {
            return { ...item, classIds: [...selectedSet] };
        }
        return { ...item, classIds: item.classIds.filter((classId) => !selectedSet.has(classId)) };
    });

    const nextClasses = allClasses.map((item) => {
        if (selectedSet.has(item.id)) {
            return { ...item, teacherId: targetTeacherId };
        }
        if (item.teacherId === targetTeacherId) {
            return { ...item, teacherId: '' };
        }
        return item;
    });

    return { nextTeachers, nextClasses };
}
