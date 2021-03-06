
import { Switch } from 'antd'
import { Flex, Text, Image } from 'rebass'
import _ from 'lodash'

const MuteList = ({ roomListInfo, muteMembers, onSetMute }) => {
    return (
        <div>
            {muteMembers.map((member, key) => {
                const isTeacher = roomListInfo && (Number(_.get(roomListInfo[member], 'ext')) === 3 || Number(_.get(roomListInfo[member], 'ext')) === 1);
                if (!isTeacher && !isNaN(Number(_.get(roomListInfo[member], 'ext')))) {
                    return <Flex justifyContent='space-between' alignItems='center' mt='10px' key={key}>
                        <Flex alignItems='center'>
                            <Image src={(_.get(roomListInfo[member], 'avatarurl'))} className='lsit-user-img' />
                            <Text className='username' ml='5px' >{_.get(roomListInfo[member], 'nickname') || _.get(roomListInfo[member], 'id')}</Text>
                        </Flex>
                        <Switch
                            size="small"
                            title="禁言"
                            checked={muteMembers.includes(_.get(roomListInfo[member], 'id'))}
                            onClick={onSetMute(_.get(roomListInfo[member], 'id'))}
                        />
                    </Flex>
                }
            })}
        </div>
    )
}

export default MuteList;