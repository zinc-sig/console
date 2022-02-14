import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { setHours, setMinutes} from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useLayoutDispatch } from "../../contexts/layout";
import { UPDATE_ASSIGNMENT_CONFIG } from "../../graphql/mutations/user";
import {Modal} from '../Modal'

const getLocalDate = (date: string) => {
  if(date) {
    return utcToZonedTime(`${date}Z`, 'Asia/Hong_Kong');
  }
  return null;
}

export function ScheduleConfig({ schedules, onChange }) {
  const router = useRouter();
  const { assignmentConfigId } = router.query;
  const dispatch = useLayoutDispatch();
  const [updateConfig, { loading }] = useMutation(UPDATE_ASSIGNMENT_CONFIG);
  const today = new Date()

  const updateSchedule = async (schedule) => {
    try {
      await updateConfig({
        variables: {
          id: parseInt(assignmentConfigId as string, 10),
          update: schedule
        }
      });
      dispatch({ type: 'showNotification', payload: { success: true, title: 'Assignment Config Updated', message: 'Changes to assignment schedule has been saved'}});
      onChange();
    } catch (error: any) {
      dispatch({ type: 'showNotification', payload: { success: false, title: 'Error', message: error.message}})
    }
  }

  return (
    <fieldset className="mt-6">
      <div className="flex justify-between">
        <div>
          <legend className="text-base leading-6 font-medium text-gray-900">Scheduling</legend>
          <p className="text-sm leading-5 text-gray-500">Date and Time settings for assignment.</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="showAt" className="block text-sm font-medium leading-5 text-gray-900">
            Announce
          </label>
          <div className="relative rounded-md shadow-sm">
            <DatePicker
              id="showAt"
              showTimeSelect
              selected={getLocalDate(schedules.showAt)}
              onChange={date => updateSchedule({
                showAt: zonedTimeToUtc(date, 'Asia/Hong_Kong')
              })}
              injectTimes={[
                setHours(setMinutes(new Date(), 59), 23)
              ]}
              placeholderText="Assignment Announcement Date"
              className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
              dateFormat="MMMM d, yyyy h:mm aa"
              />
          </div>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <label htmlFor="startCollectionAt" className="block text-sm font-medium leading-5 text-gray-900">
            Start Collection
          </label>
          {/* <button onClick={()=>{
            dispatch({ type: 'toggleModal' })
          }}>
            <input type="text" className="relative rounded-md shadow-sm w-full p-2" placeholder="Assignment Collection Start Dat" disabled ></input>
          </button> */}
          <div className="relative rounded-md shadow-sm">
            <DatePicker
              id="startCollectionAt"
              showTimeSelect
              selected={getLocalDate(schedules.startCollectionAt)}
              onChange={date => updateSchedule({
                startCollectionAt: zonedTimeToUtc(date, 'Asia/Hong_Kong')
              })}
              injectTimes={[
                setHours(setMinutes(new Date(), 59), 23)
              ]}
              maxDate={getLocalDate(schedules.dueAt)}
              placeholderText="Assignment Collection Start Date"
              className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
              dateFormat="MMMM d, yyyy h:mm aa"
              />
          </div>

          {/* <Modal>
            <div className="relative rounded-md shadow-sm">
              <div>
                testing data
              </div>
              <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-1">
          `    <button
                  onClick={() => {
                    dispatch({ type: 'closeModal' });
                  }}
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                  Back to Assignments Config
                </button>
              </span>`
            </div>
          </Modal> */}
          
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <label htmlFor="dueAt" className="block text-sm font-medium leading-5 text-gray-900">
            Due
          </label>
          <div className="relative rounded-md shadow-sm">
            <DatePicker
              id="dueAt"
              showTimeSelect
              selected={getLocalDate(schedules.dueAt)}
              onChange={date => {
                if(date > getLocalDate(schedules.stopCollectionAt)!) {
                  updateSchedule({
                    dueAt: zonedTimeToUtc(date, 'Asia/Hong_Kong'),
                    stopCollectionAt: zonedTimeToUtc(date, 'Asia/Hong_Kong')
                  });
                } else {
                  updateSchedule({
                    dueAt: zonedTimeToUtc(date, 'Asia/Hong_Kong')
                  });
                }
              }}
              injectTimes={[
                setHours(setMinutes(new Date(), 59), 23)
              ]}
              minDate={getLocalDate(schedules.startCollectionAt)}
              placeholderText="Assignment Grades Release Date"
              className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
              dateFormat="MMMM d, yyyy h:mm aa"
              />
          </div>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <label htmlFor="stopCollectionAt" className="block text-sm font-medium leading-5 text-gray-900">
            Stop Collection
          </label>
          <div className="relative rounded-md shadow-sm">
            <DatePicker
              id="stopCollectionAt"
              showTimeSelect
              selected={getLocalDate(schedules.stopCollectionAt)}
              onChange={date => updateSchedule({
                stopCollectionAt: zonedTimeToUtc(date, 'Asia/Hong_Kong')
              })}
              injectTimes={[
                setHours(setMinutes(new Date(), 59), 23)
              ]}
              minDate={getLocalDate(schedules.dueAt)}
              placeholderText="Assignment Collection Closing Date"
              className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
              dateFormat="MMMM d, yyyy h:mm aa"
              />
          </div>
        </div>
        {
          !schedules.showImmediateScores && (
            <div className="mt-4 flex flex-col space-y-2">
              <label htmlFor="releaseGradeAt" className="block text-sm font-medium leading-5 text-gray-900">
                Release Grade
              </label>
              <div className="relative rounded-md shadow-sm">
                <DatePicker
                  id="releaseGradeAt"
                  showTimeSelect
                  selected={getLocalDate(schedules.releaseGradeAt)}
                  onChange={date => updateSchedule({
                    releaseGradeAt: zonedTimeToUtc(date, 'Asia/Hong_Kong')
                  })}
                  injectTimes={[
                    setHours(setMinutes(new Date(), 59), 23)
                  ]}
                  placeholderText="Assignment Grades Release Date"
                  className="form-input block w-full sm:text-sm sm:leading-5 transition ease-in-out duration-150"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  />
              </div>
            </div>
          )
        }
      </div>
    </fieldset>
  )
}