import React, { useContext, useReducer, useEffect } from "react"
import { getMessaging, onMessage } from "firebase/messaging";
import { firebaseCloudMessaging } from "../lib/webpush";
import toast, { Toaster } from "react-hot-toast";
import { useZinc } from "./zinc"
import { Notification,NotificationBody } from "../components/Notification";

interface LayoutAction {
  type: string;
  payload?: any;
}

interface LayoutState {
  showMobileMenu: boolean
  showModal: boolean
  showSlideOver: boolean
  showNotification: boolean
  cache: any
  assignmentConfigId?: number
  assignmentConfig?: any
  assignmentId?: number
  notification?: any
  viewingConfigSegment?: string
  stdioTestCase?: any
  reportId?: string
  valgrindTestCase?: any
  modalType?: string
  gradingPayload?: any
  coursePageSlideOver?: string
  userId?: string
  registrationToken?: string
  configSlideOver?: string
  viewingTaskAssignedGroups?: String
}




function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case 'toggleModal':
      return {...state, showModal: !state.showModal, cache: action.payload}
    case 'toggleSlideOver':
      return {...state, showSlideOver: !state.showSlideOver, cache: action.payload}
    case 'toggleMobileMenu':
      return {...state, showMobileMenu: !state.showMobileMenu}
    case 'closeModal':
      return {...state, showModal: false}
    case 'closeSlideOver': 
      return {...state, showSlideOver: false}
    case 'closeMobileMenu':
      return {...state, showMobileMenu: false}
    case 'showNotification':
      toast.custom((t) =>(
        <Notification trigger={t}>
          <NotificationBody
            title={action.payload.title}
            body={action.payload.message}
            success={action.payload.success}
            id={t.id} />
        </Notification>
      ));
      return {...state, showNotification: true, notification: action.payload }
    case 'setRegistrationToken':
      return {...state, registrationToken: action.payload }
    case 'dismissNotification':
      toast.dismiss(action.payload)
      return {...state, showNotification: false}
    case 'assignmentCreated':
      return {...state, showModal: true, assignmentId: action.payload }
    case 'configureSchedule':
      return {...state, showSlideOver: true, assignmentConfig: action.payload, viewingConfigSegment: 'schedule' }
    case 'configureGeneral':
      return {...state, showSlideOver: true, assignmentConfig: action.payload, viewingConfigSegment: 'general' }
    case 'configureYaml':
      return {...state, showModal: true, assignmentConfig: action.payload, viewingConfigSegment: 'yaml'}
    case 'manageAssignedUsers':
      return {...state, showSlideOver: true, configSlideOver: 'users' }
    case 'viewStdioComparison': 
      return {...state, showModal: true, stdioTestCase: action.payload, modalType: 'stdiotest' }
    case 'viewValgrindReport':
      return {...state, showModal: true, valgrindTestCase: action.payload, modalType: 'valgrind' }
    case 'viewReport':
      return {...state, showSlideOver: true, reportId: action.payload }
    case 'viewAssignmentSubmissions':
      return { ...state, showSlideOver: true, coursePageSlideOver: 'submissions', assignmentConfigId: action.payload.configId, viewingTaskAssignedGroups: action.payload.sections  }
    case 'viewCourseStudent':
      return { ...state, showSlideOver: true, coursePageSlideOver: 'student', userId: action.payload }
    case 'viewAssignmentComplementaryFiles':
      return {...state, showSlideOver: true, configSlideOver: 'files', assignmentConfigId: action.payload }
    case 'confirmRegrading':
      return {...state, showModal: true, gradingPayload: action.payload, modalType: 'regrading' }
    case 'configYAMLUpdate':
      return {...state, showModal: true, gradingPayload: action.payload, modalType:"yaml" }
    case 'createAssignmentConfigSuccess':
      return {...state, showModal: true, assignmentConfigId: action.payload }
    case 'updateNotification':
      return {...state, notification: action.payload }
    case 'assignmentSupportingFilesUploader':
      return {...state, showModal: true, modalType:'files', assignmentConfigId: action.payload}
    default:
      return state;
  }
}

const initialLayoutState: LayoutState = {
  showMobileMenu: false,
  showModal: false,
  showSlideOver: false,
  showNotification: false,
  cache: null
}

interface LayoutProviderProps {
  children: React.ReactNode
}

const LayoutStateContext = React.createContext({} as LayoutState);
const LayoutDispatchContext = React.createContext({} as React.Dispatch<LayoutAction>)

export const useLayoutState = () => useContext(LayoutStateContext)
export const useLayoutDispatch = () => useContext(LayoutDispatchContext);

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  
  const {user, currentSemester} = useZinc();
  const [state, dispatch] = useReducer<React.Reducer<LayoutState, LayoutAction>>(layoutReducer, initialLayoutState)

  useEffect(() => {
    setupNotification();
    async function setupNotification() {
      try {
        const token = await firebaseCloudMessaging.init();
        if(token) {
          const messaging = getMessaging();
          // TODO: call API to fetch lastest notification 
          const notiRes = await fetch(`/api/notification/getNotification?&id=${user}`,{
            method: 'GET'
          });
          const noti = await notiRes.json()
          const notification = noti.notification
          // if the fetch token is not the same as DB
          if(token != notification){
            // update the DB one
            const response = await fetch(`/api/notification/update`,{
              method: 'POST',
              body: JSON.stringify({
                registrationToken: token,
                userId: user,
                currentSemester
              })
            });
          }
          dispatch({ type: 'setRegistrationToken', payload: token });
          onMessage(messaging, message => {
            const {title, body} = message.data!
            toast.custom((t) =>(
              <Notification trigger={t}>
                <NotificationBody title={title} body={body} success={true} id = {t.id}></NotificationBody>
              </Notification>
            ))
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [])

  return (
    <LayoutDispatchContext.Provider value={dispatch}>
      <LayoutStateContext.Provider value={state}>
        <Toaster position="top-right" />
        { children }
      </LayoutStateContext.Provider>
    </LayoutDispatchContext.Provider>
  )
}

