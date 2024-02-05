import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, SimpleGrid, Box, Text, Icon, Heading, ModalFooter } from '@chakra-ui/react';
import { AddIcon, CheckIcon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { Member } from '@/lib/types';

type MemberModalProps = {
    isOpen: boolean;
    onClose: () => void;
    availableMembers: Member[];
    selectedMembers: Member[];
    onAddMember: (member: Member) => void;
    onRemoveMember: (member: Member) => void;
    onConfirmSelection: (members: Member[]) => void;
};

interface MemberCardProps {
    member: Member;
    onClick: () => void;
}

export const getBackgroundColor = (gender: number) => {
    switch (gender) {
        case 1:
            return "blue.400"; // 男性
        case 2:
            return "red.400"; // 女性
        case 3:
            return "yellow.400"; // 不明
        default:
            return "gray.400"; // 性別が指定されていない場合
    }
};


const MemberCard: React.FC<MemberCardProps> = ({ member, onClick }) => {
    return (
        <Button
            onClick={() => {
                console.log("MemberCard clicked:", member);
                onClick();
            }}
            colorScheme="green"
            variant="solid"
            size="sm" // ボタンの基本サイズを小さく設定
            w="100%" // ボタンの幅を増やす
            h="60px" // 高さは調整済み
            fontSize="sm" // フォントサイズを小さく設定
            backgroundColor={getBackgroundColor(member.gender)}
            _hover={{ backgroundColor: getBackgroundColor(member.gender) }}
        >
            <Text textAlign="center">{member.name}</Text>
        </Button>
    );
};




const renderListContent = (members: Member[], callback: (member: Member) => void) => {
    return members.length > 0 ? (
        <SimpleGrid columns={{ base: 3, md: 4, lg: 4 }} spacing={2}>
            {members.map(member => (
                <MemberCard
                    key={member.id}
                    member={member}
                    onClick={() => callback(member)}
                />
            ))}
        </SimpleGrid>
    ) : (
        <Box py={3} textAlign="center" border="1px" borderColor="gray.200" borderRadius="md" shadow="sm" width="100%">
            メンバーがいません
        </Box>
    );
};



const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, availableMembers, selectedMembers, onAddMember, onRemoveMember, onConfirmSelection }) => {
    const [tempSelectedMembers, setTempSelectedMembers] = useState<Member[]>(selectedMembers);

    useEffect(() => {
        if (isOpen) {
            setTempSelectedMembers(selectedMembers);
        }
    }, [selectedMembers, isOpen]);

    const handleOk = () => {
        onConfirmSelection(tempSelectedMembers);
        onClose(); // モーダルを閉じる
    };

    const handleCancel = () => {
        onClose();
    };

    const handleAdd = (member: Member) => {
        setTempSelectedMembers([...tempSelectedMembers, member]);
    };

    const handleRemove = (member: Member) => {
        setTempSelectedMembers(tempSelectedMembers.filter(m => m.id !== member.id));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>メンバーを選択</ModalHeader>
                <ModalCloseButton />
                <ModalBody maxHeight="60vh" overflowY="auto">
                    <Box mb={6}>
                        <Heading size="md" mb={4}>メンバー招待候補</Heading>
                        {renderListContent(
                            availableMembers.filter(member => !tempSelectedMembers.some(m => m.id === member.id)),
                            handleAdd
                        )}
                    </Box>

                    <Box>
                        <Heading size="md" mb={4}>参加者メンバー</Heading>
                        {renderListContent(
                            tempSelectedMembers,
                            handleRemove
                        )}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" mr={3} onClick={handleOk}>OK</Button>
                    <Button colorScheme="gray" onClick={handleCancel}>キャンセル</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MemberModal;
