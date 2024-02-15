import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, FormErrorMessage, ModalFooter, Button, useDisclosure, Divider, Textarea } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

interface TaskPopupProps {
    onClose: () => void;
    onSave: (remarks: string) => void;
};

const TaskPopup: React.FC<TaskPopupProps> = ({ onClose, onSave }) => {
    const [contentError, setContentError] = useState('');
    const initialRef = useRef(null);
    const [content, setContent] = useState('');
    const toast = useToast();

    const handleSave = async () => {
        if (!content.trim()) {
            setContentError('内容は入力必須です');
            return;
        }
        setContentError('');

        try {
            await onSave(content);
            toast({
                title: '保存成功',
                description: '課題がデータベースに保存されました。',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
            onClose();
        } catch (error) {
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
    };

    return (
        <Modal isOpen={true} onClose={onClose} size="xl" initialFocusRef={initialRef}>
            <ModalOverlay />
            <ModalContent my={10} mx={5}>
                <ModalHeader ref={initialRef} >課題を追加</ModalHeader>
                <Divider />
                <ModalCloseButton />
                <ModalBody maxHeight="60vh" overflowY="auto">
                    <FormControl isInvalid={!!contentError} mt={4}>
                        <FormLabel>課題</FormLabel>
                        <Textarea
                            placeholder="課題を入力"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        {contentError && <FormErrorMessage>{contentError}</FormErrorMessage>}
                    </FormControl>
                </ModalBody>
                <Divider />

                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={handleSave}>
                        保存
                    </Button>
                    <Button onClick={onClose}>閉じる</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default TaskPopup;
