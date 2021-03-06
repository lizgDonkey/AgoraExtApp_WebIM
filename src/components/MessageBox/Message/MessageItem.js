import React from 'react'
import { useSelector } from 'react-redux'
import { Flex, Text, Image } from 'rebass'
import { Tag } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { getRoomWhileList } from '../../../api/chatroom'
import WebIM from '../../../utils/WebIM'
import icon_mute from '../../../themes/img/jinyan1.png'
import icon_chat from '../../../themes/img/liaotian.png'
import avatarUrl from '../../../themes/img/avatar-big@2x.png'

// 消息渲染
const MessageItem = ({ message, setShowModal, setRecallMsgId }) => {
    const isTeacher = useSelector(state => state.loginInfo.ext)
    const roomMuteList = useSelector(state => state.room.muteList)

    // 聊天框禁言
    const onSetMute = (message) => {
        let options = {
            chatRoomId: message.to,   // 聊天室id
            users: [message.from]   // 成员id列表
        };
        WebIM.conn.addUsersToChatRoomWhitelist(options).then((res) => {
            getRoomWhileList(message.to)
        })
    }
    // 聊天框移除禁言
    const onRemoveMute = (message) => {
        let options = {
            chatRoomId: message.to,  // 群组id
            userName: message.from            // 要移除的成员
        }
        WebIM.conn.rmUsersFromChatRoomWhitelist(options).then((res) => {
            getRoomWhileList(message.to)
        })
    }
    // 打开确认框
    const openModal = (val) => () => {
        setShowModal('block')
        setRecallMsgId(val)
    }

    let isTextMsg = message.type === 'txt' || message.contentsType === 'TEXT';
    let isCustomMsg = message.contentsType === "CUSTOM";
    let isCmdMsg = message.contentsType === 'COMMAND' || message.type === "cmd"
    let isShowIcon = (Number(isTeacher) === 1 || Number(isTeacher) === 3)


    return (
        <div style={{ marginTop: '16px' }} key={message.id}>
            {
                isCmdMsg && (
                    <div style={{
                        display: 'flex', justifyContent: 'center'
                    }}>
                        <Text fontSize='12px' color='#7C848C'>{message.ext.nickName || '您'}删除了一条消息</Text>
                    </div>
                )
            }
            {
                isTextMsg && (
                    <>
                        <Flex >
                            <div>
                                <Image src={message.ext.avatarUrl || avatarUrl}
                                    className='msg-img'
                                />
                            </div>
                            <Flex ml='8px'>
                                {(message.ext.role === 1) && <Tag className='tags' ><Text className='tags-txt' ml='4px' mt='1px'>主讲老师</Text></Tag>}
                                {(message.ext.role === 3) && <Tag className='tags' ><Text className='tags-txt' ml='4px' mt='1px'>辅导老师</Text></Tag>}
                                <Text className='msg-sender' ml='8px'>{message.ext.nickName || message.from}</Text>
                                {isShowIcon &&
                                    <>
                                        {!roomMuteList.includes(message.from) ? (
                                            message.ext.role === 2 && <Image src={icon_mute} className='mute-img' title="禁言" onClick={() => { onSetMute(message) }}></Image>
                                        ) : (
                                                message.ext.role === 2 && <Image src={icon_chat} className='mute-img' title="解除禁言" onClick={() => { onRemoveMute(message) }}></Image>
                                            )}
                                        <DeleteOutlined width='14px' className='delete-icon' title="删除消息" onClick={openModal(message.id)} />
                                    </>
                                }

                            </Flex>
                        </Flex>
                        <div className='msg-text txt'>
                            <Text style={{ wordBreak: 'break-all' }}>{message.msg || message.data}</Text>
                        </div>
                    </>
                )
            }
            {
                isCustomMsg && (
                    <div>
                        <Flex >
                            <div>
                                <Image src={message.ext.avatarUrl || avatarUrl} className='msg-img' />
                            </div>
                            <Flex >
                                <Text className='msg-sender' ml='8px'>{message.ext.nickName || message.from}</Text>
                            </Flex>
                        </Flex>
                        <Flex className='msg' alignItems='center' ml='28px'>
                            <Text mr='2px' className='admire-msg'>{message.customExts.des}</Text>
                            <Image src={message.customExts.url} width='24px' height='24px'></Image>
                        </Flex>
                    </div>
                )
            }
        </div>
    )
}
export default MessageItem