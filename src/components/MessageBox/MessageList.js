import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Tabs } from 'antd';
import { Text, Flex } from 'rebass'
import _ from 'lodash'
import ToolBar from '../ToolBar'
import MessageItem from './Message/index'
import QuestionMessage from './QaList/QuestionMessage'
import { CHAT_TABS, CHAT_TABS_KEYS } from './constants'
import store from '../../redux/store'
import { removeChatNotification } from '../../redux/aciton'
import { getUserInfo } from '../../api/userInfo'
import { getHistoryMessages } from '../../api/historyMessages'


import './list.css'

const { TabPane } = Tabs;

// 列表项
const MessageList = ({ activeKey, setActiveKey }) => {
  // 控制 Toolbar 组件是否展示
  const [hide, sethide] = useState(true);
  // 控制 Toolbar 组件是否展示图片 
  const [isTool, setIsTool] = useState(false);
  const [qaUser, setQaUser] = useState('');

  // 获取当前登陆ID，及成员数
  const userName = useSelector((state) => state.loginName);
  const userCount = useSelector(state => state.room.info.affiliations_count);
  // 获取当前登陆的用户权限
  const isTeacher = useSelector(state => state.loginInfo.ext)
  const messageList = useSelector(state => state.messages.list) || [];
  const notification = useSelector(state => state.messages.notification);
  //获取群组成员，及成员的用户属性
  const roomUsers = useSelector(state => state.room.users)
  const roomListInfo = useSelector((state) => state.userListInfo);

  // 是否隐藏赞赏消息
  const isHiedReward = useSelector(state => state.isReward);
  // 是否为提问消息
  const isHiedQuestion = useSelector(state => state.isQa);
  // 是否有权限
  let hasEditPermisson = (Number(isTeacher) === 1 || Number(isTeacher) === 3)
  // 获取提问列表
  const qaList = useSelector(state => state.messages.qaList) || [];
  let bool = _.find(qaList, (v, k) => {
    return v.showRedNotice
  })
  // 加载默认展示
  useEffect(() => {
    if (activeKey === 'USER') {
      sethide(false)
    } else if (activeKey === 'QA') {
      setIsTool(true);
    } else return
  }, [activeKey])
  // 切换 tab 
  const handleTabChange = (key) => {
    setActiveKey(key)
    switch (key) {
      case "CHAT":
        sethide(true);
        setIsTool(false);
        store.dispatch(removeChatNotification(false))
        break;
      case "QA":
        sethide(true);
        setIsTool(true);
        break;
      case "USER":
        sethide(false)
        break;
      default:
        break;
    }
  }
  // 需要拿到选中的提问者id
  const getClickUser = (user) => {
    setQaUser(user)
  }

  // 加载成员信息
  let speakerTeacher = []
  let coachTeacher = []
  let student = []

  // 遍历群组成员，过滤owner
  const newRoomUsers = []
  roomUsers.map(item => {
    if (item.owner) {
      return null
    }
    return newRoomUsers.push(item.member);
  })

  useEffect(() => {
    getUserInfo(newRoomUsers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUsers])

  // 遍历成员列表，拿到成员数据，结构和 roomAdmin 统一
  roomUsers.map((item) => {
    let val
    if (roomListInfo) {
      val = roomListInfo && roomListInfo[item.member]
    } else {
      return
    }
    let newVal = {}
    switch (val && val.ext) {
      case '1':
        newVal = _.assign(val, { id: item.member })
        speakerTeacher.push(newVal)
        break;
      case '2':
        newVal = _.assign(val, { id: item.member })
        student.push(newVal)
        break;
      case '3':
        newVal = _.assign(val, { id: item.member })
        coachTeacher.push(newVal)
        break;
      default:
        break;
    }
  })
  const roomUserList = _.concat(speakerTeacher, coachTeacher, student)

  // 监听滚动条滑到顶部
  const msgListRef = useRef()
  const handleScroll = (e) => {
    if (e.target.scrollTop === 0) {
      getHistoryMessages();
    }
  }

  return (
    <div className='message'>
      {hasEditPermisson ? (
        <Tabs activeKey={activeKey} onChange={handleTabChange}>
          {
            CHAT_TABS.map(({ key, name, component: Component, className }) => (
              <TabPane tab={<Flex>
                <Text whiteSpace="nowrap">{name === '成员' ? `${name}(${userCount - 1})` : name}</Text>
                {name === '提问' && bool && bool.showRedNotice && (
                  <Text ml="6px" whiteSpace="nowrap" color="red" fontSize='40px'>·</Text>
                )}
                {name !== '提问' && Boolean(notification[key]) && (
                  <Text ml="6px" whiteSpace="nowrap" color="red" fontSize='40px'>·</Text>
                )}

              </Flex>} key={key}>
                <div className={className} ref={msgListRef} onScroll={handleScroll}>
                  <Component {
                    ...key === CHAT_TABS_KEYS.chat && {
                      messageList,
                      isHiedReward,
                      activeKey
                    }
                  } {...key === CHAT_TABS_KEYS.qa && {
                    getClickUser
                  }} {...key === CHAT_TABS_KEYS.user && {
                    roomUserList
                  }} />
                </div>
              </TabPane>
            ))
          }
        </Tabs>
      ) : (
          isHiedQuestion ? (
            <div className="member-msg" onScroll={handleScroll}>
              <QuestionMessage userName={userName} />
            </div>
          ) : (
              <div className="member-msg" onScroll={handleScroll}>
                {
                  messageList.length > 0 ? (
                    <MessageItem messageList={messageList} isHiedReward={isHiedReward} />
                  ) : (
                      <div>
                        <Text textAlign='center' color='#D3D6D8'>暂无消息</Text>
                      </div>
                    )
                }
              </div>
            )
        )}
      <ToolBar hide={hide} isTool={isTool} qaUser={qaUser} activeKey={activeKey} />
    </div>
  )
}
export default MessageList