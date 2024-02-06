export interface Schedule {
    id: number;
    title: string;
    event_type: number;
    start_time: Date;
    end_time: Date;
    members: Member[];
    remarks: string;
};

export interface Member {
    id: number;
    name: string;
    gender: number;
}