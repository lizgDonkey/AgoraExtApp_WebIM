import { useSelector } from 'react-redux'
import { Flex, Text, Image } from 'rebass'
import { Switch, Tag } from 'antd';
import _ from 'lodash'
import avatarUrl from '../../../themes/img/avatar-big@2x.png'

const SearchList = ({ roomListInfo, searchUser, onSetMute, muteMembers }) => {
    const roomOwner = useSelector((state) => state.room.info.owner);
    // const roomAdmins = useSelector((state) => state.room.admins);
    // 新的空数组，存用户头像，昵称，环信ID
    const aryList = [];
    Object.keys(roomListInfo).forEach(item => {
        const userName = roomListInfo[item].nickname;
        const avatarUrl = roomListInfo[item].avatarurl;
        const roleType = roomListInfo[item].ext;
        aryList.push([userName, avatarUrl, item, roleType]);
        return aryList;
    })

    let speakerTeacher = []
    let coachTeacher = []
    let student = []

    _.forIn(aryList, (val, key) => {
        let newVal = {}
        switch (val[3]) {
            case '1':
                newVal = _.assign(val, { id: val[2] })
                speakerTeacher.push(newVal)
                break;
            case '2':
                newVal = _.assign(val, { id: val[2] })
                student.push(newVal)
                break;
            case '3':
                newVal = _.assign(val, { id: val[2] })
                coachTeacher.push(newVal)
                break;
            default:
                break;
        }
    })
    const roomUserList = _.concat(speakerTeacher, coachTeacher, student)
    return (
        <div>
            {
                roomUserList.map((member, key) => {
                    if (member[2] === roomOwner) {
                        return null
                    } else {
                        if (member[0] && (member[0].toLocaleLowerCase()).indexOf(searchUser.toLocaleLowerCase()) !== -1) {
                            return (
                                <Flex justifyContent='space-between' alignItems='center' mt='8px' key={key}>
                                    <Flex alignItems='center'>
                                        <Image src={member[1] || avatarUrl} className='lsit-user-img' />
                                        <Flex ml='8px'>
                                            {Number(member[3]) === 1 && <Tag className='tags' ><Text className='tags-txt' ml='4px' mt='1px'>主讲老师</Text></Tag>}
                                            {Number(member[3]) === 3 && <Tag className='tags' ><Text className='tags-txt' ml='4px' mt='1px'>辅导老师</Text></Tag>}
                                            <Text className='username' ml='5px' >{member[0]}</Text>
                                        </Flex>
                                    </Flex>
                                    {
                                        Number(member[3]) === 2 && <Switch
                                            size="small"
                                            title="禁言"
                                            checked={muteMembers.includes(member[2])}
                                            onClick={onSetMute(member[2])}
                                        />
                                    }
                                </Flex>
                            )
                        }
                    }
                })
            }
        </div>
    )
}

export default SearchList;