import { createClient } from '@supabase/supabase-js'
import { Schedule, Member, Task } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URLとAnon Keyは環境変数で設定する必要があります。');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const fetchTasks = async (): Promise<Task[] | null> => {
  let { data: tasks, error } = await supabase
    .from('t_task')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching tasks', error);
    return null;
  }

  return tasks;
};

export const newTask = async (
  content: string
): Promise<void> => {
  const { data, error: taskError } = (await supabase
    .from('t_task')
    .insert([{
      content
    }])
    .single());

  if (taskError) throw taskError;

};

export const updateTask = async (
  taskId: number,
  content: string
) => {
  const { error: taskError } = await supabase
    .from('t_task')
    .update({
      content: content
    })
    .eq('id', taskId);

  if (taskError) {
    throw taskError;
  }

};


export const deleteTask = async (taskId: number) => {
  const { data, error } = await supabase
    .from('t_task')
    .delete()
    .eq('id', taskId);

  if (error) {
    throw error;
  }

  return data;
};


export const fetchSchedulesWithMembers = async (year: number, month: number): Promise<Schedule[] | null> => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  let { data: schedules, error } = await supabase
    .from('t_schedule')
    .select('*')
    .gte('start_time', startDate.toLocaleDateString('en-CA') + " 00:00:00")
    .lte('start_time', endDate.toLocaleDateString('en-CA') + " 23:59:59")
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching schedules', error);
    return null;
  }

  if (!schedules) {
    return [];
  }

  // 各スケジュールに対する参加者リストを非同期で取得
  const schedulesWithMembers = await Promise.all(schedules.map(async (schedule) => {
    const members = await db_fetchScheduleMembers(schedule.id);
    return {
      ...schedule,
      start_time: new Date(schedule.start_time),
      end_time: new Date(schedule.end_time),
      members // 各スケジュールに参加者リストを追加
    };
  }));

  return schedulesWithMembers;
};


export const db_fetchScheduleMembers = async (scheduleId: number) => {
  let { data: memberLinks, error: linkError } = await supabase
    .from('schedule_members')
    .select('member_id')
    .eq('schedule_id', scheduleId);

  if (linkError) throw linkError;

  const memberIds = memberLinks ? memberLinks.map(link => link.member_id) : [];

  // memberIdsが空でないことを確認
  if (memberIds.length === 0) {
    return []; // 空の配列を返す
  }

  let { data: members, error: memberError } = await supabase
    .from('m_user')
    .select('*')
    .in('id', memberIds);

  if (memberError) throw memberError;

  return members;
};

export const updateSchedule = async (
  scheduleId: number,
  title: string,
  event_type: number,
  startDateTime: Date,
  endDateTime: Date,
  members: Member[],
  remarks: string
) => {
  const { error: scheduleError } = await supabase
    .from('t_schedule')
    .update({
      title: title,
      event_type,
      start_time: startDateTime,
      end_time: endDateTime,
      remarks: remarks
    })
    .eq('id', scheduleId);

  if (scheduleError) {
    throw scheduleError;
  }

  await updateScheduleMembers(scheduleId, members);

};
export const updateScheduleMembers = async (
  scheduleId: number,
  members: Member[]
) => {
  // 既存のメンバー関連付けを削除
  await supabase
    .from('schedule_members')
    .delete()
    .eq('schedule_id', scheduleId);

  // 新しいメンバーで関連付けを作成
  const memberEntries = members.map(member => ({
    schedule_id: scheduleId,
    member_id: member.id
  }));

  const { error: memberError } = await supabase
    .from('schedule_members')
    .insert(memberEntries);

  if (memberError) {
    throw memberError;
  }
};


export const deleteSchedule = async (scheduleId: number) => {
  const { data, error } = await supabase
    .from('t_schedule')
    .delete()
    .eq('id', scheduleId);

  if (error) {
    throw error;
  }

  return data;
};

export const fetchMembers = async (): Promise<Member[] | null> => {
  let { data: members, error } = await supabase
    .from('m_user')
    .select('*');

  if (members) {
    members.sort((a, b) => {
      if (a.gender === b.gender) {
        return a.id - b.id; // genderが同じ場合は、idで昇順ソート
      } else {
        return b.gender - a.gender; // genderで降順ソート
      }
    });
  }
  if (error) {
    console.error('Error fetching members', error);
    return null;
  }

  return members;
};

export const newSchedule = async (
  title: string,
  eventType: number,
  startDateTime: Date,
  endDateTime: Date,
  members: Member[],
  remarks: string
): Promise<void> => {
  const { data, error: schduleError } = (await supabase
    .from('t_schedule')
    .insert([{
      title,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      event_type: eventType,
      remarks: remarks
    }])
    .select('id')
    .single());

  if (schduleError) throw schduleError;

  const memberEntries = members.map(member => ({
    schedule_id: data.id,
    member_id: member.id
  }));
  console.log(memberEntries);

  const { error: memberError } = await supabase
    .from('schedule_members')
    .insert(memberEntries);

  if (memberError) throw memberError;
};