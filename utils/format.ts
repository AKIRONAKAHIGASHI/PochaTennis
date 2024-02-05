export const formatTime = (date: Date | null): string => {
    if (!date) {
        return '';
    }

    // YYYY-MM-DDThh:mm 形式にフォーマット
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatScheduleTime = (startTime: Date | null, endTime: Date | null): string => {
    if (!startTime || !endTime) {
        return '';
    }

    // 月と日を "2/1" の形式で取得
    const month = (startTime.getMonth() + 1).toString();
    const day = startTime.getDate().toString();
    const datePart = `${month}/${day}`;

    // 開始時間と終了時間を "13:02" の形式で取得
    const startHours = startTime.getHours().toString().padStart(2, '0');
    const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
    const endHours = endTime.getHours().toString().padStart(2, '0');
    const endMinutes = endTime.getMinutes().toString().padStart(2, '0');

    // 最終的な文字列を組み立てる
    return `${datePart}　${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};
