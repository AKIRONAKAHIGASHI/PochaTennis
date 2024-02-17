import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  Button,
  Divider, Textarea, Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  VStack,
  Box
} from '@chakra-ui/react';
import { Task, Comment } from '@/lib/types';
import { useToast } from '@chakra-ui/react';

interface EditTaskPopupProps {
  onClose: () => void;
  task: Task;
  onSave: (taskId: number, type: number, task: string) => void;
  saveComment: (taskId: number, content: string) => void;
}

const EditTaskPopup: React.FC<EditTaskPopupProps> = ({ onClose, task, onSave, saveComment }) => {
  const [content, setContent] = useState(task?.content || '');
  const [type, setType] = useState<number>(task?.type || 0);
  // 既存のコメント
  const [comments, setComments] = useState<Comment[]>(task?.comments || []);
  // 新しいコメントを入力
  const [newComment, setNewComment] = useState('');
  // 新しいコメントのリスト
  const [newComments, setNewComments] = useState<{ content: string; }[]>([]);

  const toast = useToast();
  const initialRef = useRef(null);

  const modalBodyRef = useRef<HTMLDivElement>(null);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // 新しいコメントオブジェクトを作成
    const newCommentObj = { content: newComment, id: Date.now() }; // idは一時的なものとして扱う

    // 新しいコメントを表示用のリストに追加
    setComments(prevComments => [...prevComments, newCommentObj]);

    // 新しいコメントを保存用のリストに追加
    setNewComments(prevNewComments => [...prevNewComments, { content: newComment }]);

    // 入力フィールドをクリア
    setNewComment('');
  };


  const handleSave = async () => {
    if (task && content.trim() !== '') {
      try {
        // タスクの内容とターゲットタイプを保存
        await onSave(task.id, type, content);

        for (const newComment of newComments) {
          await saveComment(task.id, newComment.content);
        }


        // 保存成功の通知
        toast({
          title: '完了',
          description: '課題とコメントが更新されました。',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });

        // モーダルを閉じる
        onClose();
      } catch (error) {
        // エラー処理
        console.error('保存エラー:', error);
        toast({
          title: '保存失敗',
          description: 'エラーが発生しました。',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      }
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="full" initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader ref={initialRef}>タスク編集</ModalHeader>
        <Divider />
        <ModalCloseButton />
        <ModalBody ref={modalBodyRef} maxHeight="60vh" overflowY="auto">
          <Tabs isFitted variant="line" colorScheme="teal">
            <TabList mb="1em">
              <Tab _selected={{ fontWeight: "bold", borderBottom: "2px solid" }}>課題内容</Tab>
              <Tab _selected={{ fontWeight: "bold", borderBottom: "2px solid" }}>コメント</Tab>
            </TabList>
            <TabPanels>
              {/* 課題内容のタブ */}
              <TabPanel>
                <FormControl mt={4}>
                  <FormLabel>ターゲット</FormLabel>
                  <Select
                    placeholder="タイプを選択"
                    value={type}
                    onChange={(e) => setType(Number(e.target.value))}
                    borderColor="gray.300"
                  >
                    <option value={0}>全員</option>
                    <option value={1}>すず</option>
                    <option value={2}>まり</option>
                    <option value={3}>あきろー</option>
                  </Select>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>内容</FormLabel>
                  <Textarea
                    placeholder="課題を入力"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    borderColor="gray.300"
                  />
                </FormControl>
              </TabPanel>
              {/* コメントのタブ */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {comments.map((comment, index) => (
                    <Box key={index} p={4} shadow="md" borderWidth="1px" borderColor="gray.300" borderRadius="md">
                      {comment.content}
                    </Box>
                  ))}
                  <FormControl>
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="コメントを追加"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <Button colorScheme="teal" onClick={handleAddComment}>コメントを追加</Button>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>

        </ModalBody>
        <Divider />
        <ModalFooter>
          <Button colorScheme="green" onClick={handleSave} isDisabled={!task}>保存</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskPopup;